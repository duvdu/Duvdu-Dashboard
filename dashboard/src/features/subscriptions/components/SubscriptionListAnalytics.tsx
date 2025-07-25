import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { subscriptionsAnalyticsSchema } from "../schemas/subscriptions-analytics.schema";
import type { SubscriptionsAnalyticsSchema } from "../schemas/subscriptions-analytics.schema";
import axios from "@/lib/axios";
import { ChartCard } from "@/features/dashboard/components/ui/ChartCard";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetchSubscriptionsAnalytics = async (
  filters: SubscriptionsAnalyticsSchema
) => {
  const { data } = await axios.get(
    "/api/analysis/payment/subscriptions-analysis",
    { params: filters }
  );
  return data;
};

export default function TransactionListAnalytics() {
  const form = useForm<SubscriptionsAnalyticsSchema>({
    resolver: zodResolver(subscriptionsAnalyticsSchema),
    defaultValues: { interval: "month" },
  });
  const [filters, setFilters] = useState<SubscriptionsAnalyticsSchema>({
    interval: "month",
  });

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["subscriptions-analytics", filters],
    queryFn: () => fetchSubscriptionsAnalytics(filters),
  });

  function onSubmit(values: SubscriptionsAnalyticsSchema) {
    setFilters(values);
    refetch();
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Analytics Filters"
          description="Filter subscription analytics by interval, date, and currency."
          className="!min-h-0 col-span-2 bg-card border border-border shadow-sm"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-4 items-end"
            >
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("interval") === "custom" && (
                <>
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button type="submit">Apply</Button>
            </form>
          </Form>
        </ChartCard>
      </div>
      {/* Loading/Error */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8" />
        </div>
      ) : isError ? (
        <div className="flex justify-center py-8">
          <Badge variant="destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load analytics."}
          </Badge>
        </div>
      ) : data ? (
        <>
          {/* Stat Cards - Minimal, Modern */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Revenue",
                value: data.summary.totalSubscriptionRevenue,
                icon: <DollarSign className="w-6 h-6 text-primary" />,
                description: "Sum of all subscription revenue.",
              },
              {
                title: "Active Subscriptions",
                value: data.summary.activeSubscriptions,
                icon: <BarChart3 className="w-6 h-6 text-green-600" />,
                description: "Number of currently active subscriptions.",
              },
              {
                title: "New Subscriptions",
                value: data.summary.newSubscriptions,
                icon: <TrendingUp className="w-6 h-6 text-yellow-600" />,
                description: "Subscriptions started in the selected period.",
              },
              {
                title: "Cancelled Subscriptions",
                value: data.summary.cancelledSubscriptions,
                icon: <ArrowDownRight className="w-6 h-6 text-red-600" />,
                description: "Subscriptions cancelled in the selected period.",
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className="relative overflow-hidden bg-card border border-border shadow-sm text-foreground"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Growth & Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              {
                title: "Revenue Growth",
                value: data.growthMetrics.revenueGrowth?.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-green-600" />,
                description:
                  "Change in subscription revenue over the selected period.",
              },
              {
                title: "Subscription Growth",
                value: data.growthMetrics.subscriptionGrowth?.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
                description:
                  "Change in subscription count over the selected period.",
              },
              {
                title: "MRR Growth",
                value: data.growthMetrics.mrrGrowth?.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-yellow-600" />,
                description:
                  "Change in monthly recurring revenue over the selected period.",
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className="bg-card border border-border shadow-sm text-foreground"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              {
                title: "Highest Subscription",
                value: data.topMetrics.highestSubscription,
                icon: <ArrowUpRight className="w-6 h-6 text-green-600" />,
                description: "Largest single subscription.",
              },
              {
                title: "Lowest Subscription",
                value: data.topMetrics.lowestSubscription,
                icon: <ArrowDownRight className="w-6 h-6 text-red-600" />,
                description: "Smallest single subscription.",
              },
              {
                title: "Most Common Subscription Amount",
                value: data.topMetrics.mostCommonSubscriptionAmount,
                icon: <Coins className="w-6 h-6 text-indigo-600" />,
                description: "Most frequent subscription value.",
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className="bg-card border border-border shadow-sm text-foreground"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Revenue & Subscriptions Over Time Chart */}

          {/* Revenue Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <ChartCard
              title="Revenue Analysis"
              description="Breakdown of deposits and withdraws."
              className="bg-card border border-border shadow-sm"
            >
              <ChartContainer
                config={{
                  total: { label: "Total", color: "#6366f1" },
                  success: { label: "Success", color: "#22c55e" },
                  pending: { label: "Pending", color: "#eab308" },
                  failed: { label: "Failed", color: "#ef4444" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { type: "Deposits", ...data.revenueAnalysis.deposits },
                      { type: "Withdraws", ...data.revenueAnalysis.withdraws },
                    ]}
                    margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="type" axisLine={false} tickLine={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total"
                      fill="#6366f1"
                      name="Total"
                      radius={4}
                    />
                    <Bar
                      dataKey="success"
                      fill="#22c55e"
                      name="Success"
                      radius={4}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#eab308"
                      name="Pending"
                      radius={4}
                    />
                    <Bar
                      dataKey="failed"
                      fill="#ef4444"
                      name="Failed"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>
            {/* Subscription Tiers Analysis */}
            <ChartCard
              title="Subscription Tiers"
              description="Breakdown by subscription tier."
              className="bg-card border border-border shadow-sm"
            >
              <ChartContainer
                config={{
                  count: { label: "Count", color: "#6366f1" },
                  revenue: { label: "Revenue", color: "#22c55e" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.subscriptionTiers.tierAnalysis}
                    margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="tier" axisLine={false} tickLine={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#6366f1"
                      name="Count"
                      radius={4}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#22c55e"
                      name="Revenue"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>
          </div>
          {/* Currency Breakdown */}
          <ChartCard
            title="Currency Breakdown"
            description="Revenue and subscription count by currency."
            className="mt-8 bg-card border border-border shadow-sm"
          >
            <ChartContainer
              config={{
                totalRevenue: { label: "Total Revenue", color: "#6366f1" },
                subscriptionCount: { label: "Subscriptions", color: "#22c55e" },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.currencyBreakdown}
                  margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="currency" axisLine={false} tickLine={false} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#6366f1"
                    name="Total Revenue"
                    radius={4}
                  />
                  <Bar
                    dataKey="subscriptionCount"
                    fill="#22c55e"
                    name="Subscriptions"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        </>
      ) : null}
    </div>
  );
}
