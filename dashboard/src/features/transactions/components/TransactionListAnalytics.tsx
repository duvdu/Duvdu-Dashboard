import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { transactionsAnalyticsSchema } from "@/features/transactions/schemas/transactions-analytics.schema";
import type { TransactionsAnalyticsSchema } from "@/features/transactions/schemas/transactions-analytics.schema";
import { getTransactionsAnalysis } from "@/features/transactions/api/transactions.api";
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
  Activity,
  Coins,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TransactionListAnalytics() {
  const form = useForm<TransactionsAnalyticsSchema>({
    resolver: zodResolver(transactionsAnalyticsSchema),
    defaultValues: { interval: "month" },
  });
  const [filters, setFilters] = useState<TransactionsAnalyticsSchema>({
    interval: "month",
  });

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["transactions-analytics", filters],
    queryFn: () => getTransactionsAnalysis(filters),
  });

  function onSubmit(values: TransactionsAnalyticsSchema) {
    setFilters(values);
    refetch();
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Analytics Filters"
          description="Filter transaction analytics by interval, date, and currency."
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
                value: data.summary.totalRevenue,
                icon: <DollarSign className="w-6 h-6 text-primary" />,
                badge: data.currencyBreakdown[0]?.currency,
                description: "Sum of all transaction revenue.",
              },
              {
                title: "Total Transactions",
                value: data.summary.totalTransactions,
                icon: <BarChart3 className="w-6 h-6 text-green-600" />,
                description: "Number of all transactions.",
              },
              {
                title: "Avg. Transaction Value",
                value: data.summary.averageTransactionValue,
                icon: <Coins className="w-6 h-6 text-yellow-600" />,
                description: "Average value per transaction.",
              },
              {
                title: "Funding Rate",
                value: data.summary.fundingRate + "%",
                icon: <Activity className="w-6 h-6 text-blue-600" />,
                description: "Percentage of transactions that are funded.",
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
                  {stat.badge && (
                    <Badge className="bg-muted text-muted-foreground text-xs px-2 py-0.5 ml-1 mt-2">
                      {stat.badge}
                    </Badge>
                  )}
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
                value: data.growthMetrics.revenueGrowth.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-green-600" />,
                description: "Change in revenue over the selected period.",
              },
              {
                title: "Transaction Growth",
                value: data.growthMetrics.transactionGrowth.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
                description:
                  "Change in transaction count over the selected period.",
              },
              {
                title: "Funding Growth",
                value: data.growthMetrics.fundingGrowth.toFixed(2) + "%",
                icon: <TrendingUp className="w-6 h-6 text-yellow-600" />,
                description:
                  "Change in funded transactions over the selected period.",
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
                title: "Highest Transaction",
                value: data.topMetrics.highestTransaction,
                icon: <ArrowUpRight className="w-6 h-6 text-green-600" />,
                badge: data.currencyBreakdown[0]?.currency,
                description: "Largest single transaction.",
              },
              {
                title: "Lowest Transaction",
                value: data.topMetrics.lowestTransaction,
                icon: <ArrowDownRight className="w-6 h-6 text-red-600" />,
                badge: data.currencyBreakdown[0]?.currency,
                description: "Smallest single transaction.",
              },
              {
                title: "Most Common Currency",
                value: data.topMetrics.mostCommonCurrency,
                icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
                description: "Currency used most often.",
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
                    <Badge className="bg-muted text-muted-foreground text-xs px-2 py-0.5 ml-1 mt-2">
                      {stat.badge}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Revenue Over Time Chart */}

          {/* Revenue Analysis & Funded Transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Revenue Analysis */}
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
            {/* Funded Transactions Analysis */}
            <ChartCard
              title="Funded Transactions Analysis"
              description="Detailed funded transaction stats."
              className="bg-card border border-border shadow-sm"
            >
              <ChartContainer
                config={{
                  totalAmount: { label: "Total Amount", color: "#6366f1" },
                  successAmount: { label: "Success Amount", color: "#22c55e" },
                  pendingAmount: { label: "Pending Amount", color: "#eab308" },
                  failedAmount: { label: "Failed Amount", color: "#ef4444" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Amount",
                        totalAmount:
                          data.fundedTransactionsAnalysis.totalAmount,
                        successAmount:
                          data.fundedTransactionsAnalysis.successAmount,
                        pendingAmount:
                          data.fundedTransactionsAnalysis.pendingAmount,
                        failedAmount:
                          data.fundedTransactionsAnalysis.failedAmount,
                      },
                      {
                        name: "Count",
                        totalAmount: data.fundedTransactionsAnalysis.totalCount,
                        successAmount:
                          data.fundedTransactionsAnalysis.successCount,
                        pendingAmount:
                          data.fundedTransactionsAnalysis.pendingCount,
                        failedAmount:
                          data.fundedTransactionsAnalysis.failedCount,
                      },
                    ]}
                    margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalAmount"
                      fill="#6366f1"
                      name="Total"
                      radius={4}
                    />
                    <Bar
                      dataKey="successAmount"
                      fill="#22c55e"
                      name="Success"
                      radius={4}
                    />
                    <Bar
                      dataKey="pendingAmount"
                      fill="#eab308"
                      name="Pending"
                      radius={4}
                    />
                    <Bar
                      dataKey="failedAmount"
                      fill="#ef4444"
                      name="Failed"
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
            description="Revenue and transaction count by currency."
            className="mt-8 bg-card border border-border shadow-sm"
          >
            <ChartContainer
              config={{
                totalRevenue: { label: "Total Revenue", color: "#6366f1" },
                fundedRevenue: { label: "Funded Revenue", color: "#22c55e" },
                transactionCount: { label: "Transactions", color: "#eab308" },
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
                  <Bar
                    dataKey="totalRevenue"
                    fill="#6366f1"
                    name="Total Revenue"
                    radius={4}
                  />
                  <Bar
                    dataKey="fundedRevenue"
                    fill="#22c55e"
                    name="Funded Revenue"
                    radius={4}
                  />
                  <Bar
                    dataKey="transactionCount"
                    fill="#eab308"
                    name="Transactions"
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
