import DashboardLayout from "@/components/layout/DashboardLayout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionListAnalytics from "@/features/transactions/components/TransactionListAnalytics";
import TransactionListTable from "@/features/transactions/components/TransactionListTable";

export default function TransactionsListPage() {
  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      <Tabs defaultValue="table">
        <TabsList className="grid grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TransactionListTable />
        </TabsContent>
        <TabsContent value="analytics">
          <TransactionListAnalytics />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
