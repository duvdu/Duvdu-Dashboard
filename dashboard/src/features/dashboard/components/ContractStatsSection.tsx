import { StatCard } from "./ui/StatCard";
import { ChartCard } from "./ui/ChartCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { Briefcase } from "lucide-react";
import React from "react";

type ContractStats = {
  totalContracts: number;
  contractsByStatus: { status: string; count: number }[];
  contractsByCycle: {
    cycle: string;
    count: number;
    statusBreakdown: { status: string; count: number }[];
  }[];
  contractsByDate: { date: string; count: number }[];
};

const statusColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const ContractStatsSection: React.FC<{
  contractStats: ContractStats;
}> = ({ contractStats }) => {
  // Bar chart for contracts by status
  const statusChartData = contractStats.contractsByStatus.map((item) => ({
    status: item.status,
    count: item.count,
  }));
  const statusChartConfig = Object.fromEntries(
    contractStats.contractsByStatus.map((item, idx) => [
      item.status,
      { label: item.status, color: statusColors[idx % statusColors.length] },
    ])
  );

  // Grouped bar chart for contracts by cycle and status
  const allStatuses = Array.from(
    new Set(
      contractStats.contractsByCycle.flatMap((cycle) =>
        cycle.statusBreakdown.map((sb) => sb.status)
      )
    )
  );
  const cycleChartData = contractStats.contractsByCycle.map((cycle) => {
    const entry: any = { cycle: cycle.cycle };
    allStatuses.forEach((status) => {
      const found = cycle.statusBreakdown.find((sb) => sb.status === status);
      entry[status] = found ? found.count : 0;
    });
    return entry;
  });
  const cycleChartConfig = Object.fromEntries(
    allStatuses.map((status, idx) => [
      status,
      { label: status, color: statusColors[idx % statusColors.length] },
    ])
  );

  const chartData = contractStats.contractsByDate.map((item) => ({
    date: item.date,
    count: item.count,
  }));
  const chartConfig = {
    count: {
      label: "Contracts",
      color: "var(--chart-1)",
    },
  };

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="md:col-span-1">
          <StatCard
            title="Total Contracts"
            value={contractStats.totalContracts}
            icon={<Briefcase className="w-6 h-6" />}
            description="All contracts managed in the system."
          />
        </div>
        <div className="md:col-span-2">
          <ChartCard
            title="Contracts Over Time"
            description="Track the trend of contract creation by date."
          >
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelKey="count"
                      nameKey="date"
                      formatter={(value: any, name: string, props: any) => {
                        return `${new Date(
                          props.payload.date
                        ).toLocaleDateString()} - count: ${value}`;
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent nameKey="date" />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
        <div className="md:col-span-2 flex flex-col gap-6">
          <ChartCard
            title="Contracts by Status"
            description="Overview of contracts grouped by their current status."
          >
            <ChartContainer
              config={statusChartConfig}
              className="h-[180px] w-full"
            >
              <BarChart data={statusChartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelKey="count" nameKey="status" />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Contracts by Cycle & Status"
            description="Breakdown of contract cycles with status distribution for each cycle type."
          >
            <ChartContainer
              config={cycleChartConfig}
              className="h-[180px] w-full"
            >
              <BarChart data={cycleChartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="cycle"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend
                  content={<ChartLegendContent />}
                  wrapperStyle={{
                    paddingTop: "10px",
                    overflow: "auto",
                    maxWidth: "100%",
                  }}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    maxWidth: "100%",
                  }}
                />
                {allStatuses.map((status, idx) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    fill={statusColors[idx % statusColors.length]}
                    radius={4}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};
