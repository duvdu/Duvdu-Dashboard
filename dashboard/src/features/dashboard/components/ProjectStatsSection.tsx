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
import { BarChart3 } from "lucide-react";
import React from "react";

type ProjectStats = {
  totalProjects: number;
  projectsByDate: { count: number; date: string }[];
};

export const ProjectStatsSection: React.FC<{ projectStats: ProjectStats }> = ({
  projectStats,
}) => {
  const chartData = projectStats.projectsByDate.map((item) => ({
    date: item.date,
    count: item.count,
  }));
  const chartConfig = {
    count: {
      label: "Projects",
      color: "var(--chart-1)",
    },
  };
  // Dummy trend for now
  const trend = "up";
  const trendValue = "+5.2%";
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <StatCard
            title="Total Projects"
            value={projectStats.totalProjects}
            icon={<BarChart3 className="w-6 h-6" />}
            trend={trend as any}
            trendValue={trendValue}
            description="All projects created in the system."
          />
        </div>
        <div className="md:col-span-2">
          <ChartCard
            title="Projects Over Time"
            description="Track the trend of project creation by date."
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
                    <ChartTooltipContent labelKey="count" nameKey="date" />
                  }
                />
                <ChartLegend content={<ChartLegendContent nameKey="date" />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};
