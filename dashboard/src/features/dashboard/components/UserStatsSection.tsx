import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import React from "react";
import { StatCard } from "./ui/StatCard";
import { Users, UserCheck, UserPlus, Eye } from "lucide-react";
import { TopUsersSection } from "./TopUsersSection";
import { useVisitorsStore } from "../store/visitors.store";

type UserStats = {
  totalUsers: number;
  onlineUsers: number;
  newUsers: number;
  usersByRank: { rank: string; count: number; color: string }[];
};

export const UserStatsSection: React.FC<{
  userStats: UserStats;
  topUsers: any;
}> = ({ userStats, topUsers }) => {
  const { onlineVisitors, loggedInVisitors } = useVisitorsStore();

  // Use the color property (now mapped to theme variables)
  const chartData = userStats.usersByRank.map((item) => ({
    name: item.rank,
    value: item.count,
    color: item.color,
  }));
  const chartConfig = Object.fromEntries(
    userStats.usersByRank.map((item) => [
      item.rank,
      { label: item.rank, color: item.color },
    ])
  );
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Users"
          value={userStats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          description="The total number of users registered in the system."
        />
        <StatCard
          title="Online Users"
          value={loggedInVisitors}
          icon={<UserCheck className="w-6 h-6" />}
          description="Users currently online and active."
          className="h-full"
        />
        <StatCard
          title="New Users"
          value={userStats.newUsers}
          icon={<UserPlus className="w-6 h-6" />}
          description="Number of users who joined recently."
          className="h-full"
        />
        <StatCard
          title="Online Visitors"
          value={onlineVisitors}
          className="h-full"
          icon={<Eye className="w-6 h-6" />}
          description="Number of visitors currently browsing the site."
        />
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Users by Rank</CardTitle>
            <CardDescription>
              Distribution of users by their rank or experience level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="h-[100px] w-full flex items-center justify-center"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={30}
                  label
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelKey="value" nameKey="name" />
                  }
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <TopUsersSection className="md:col-span-6" topUsers={topUsers} />
      </div>
    </section>
  );
};
