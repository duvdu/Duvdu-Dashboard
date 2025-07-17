import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/users.api";
import PayoutMethodsPanel from "../components/panels/PayoutMethodsPanel";
import TransactionsPanel from "../components/panels/TransactionsPanel";
import UserProfileHeader from "../components/UserProfileHeader";

export default function UserProfilePage() {
  const { id } = useParams();
  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  if (error) {
    return (
      <DashboardLayout className="w-full py-8 justify-center">
        <div className="text-center text-2xl font-bold">
          Error: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <DashboardLayout className="w-full py-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <div>
          <UserProfileHeader user={user} refetch={refetch} />
          <Tabs defaultValue="payout-methods" className="mt-8 flex-wrap">
            <TabsList className="mb-4">
              <TabsTrigger value="payout-methods">Payout Methods</TabsTrigger>
              <TabsTrigger value="complaints">Complaints</TabsTrigger>
              <TabsTrigger value="subscription-insight">
                Subscription Insight
              </TabsTrigger>
              <TabsTrigger value="financial-log">Financial Log</TabsTrigger>
              <TabsTrigger value="content-log">Content Log</TabsTrigger>
              <TabsTrigger value="contract-log">Contract Log</TabsTrigger>
            </TabsList>
            <TabsContent value="payout-methods">
              <PayoutMethodsPanel userId={id} />
            </TabsContent>
            <TabsContent value="complaints">
              <div>Complaints content goes here.</div>
            </TabsContent>
            <TabsContent value="subscription-insight">
              <div>Subscription Insight content goes here.</div>
            </TabsContent>
            <TabsContent value="financial-log">
              <TransactionsPanel userId={id} />
            </TabsContent>
            <TabsContent value="content-log">
              <div>Content Log content goes here.</div>
            </TabsContent>
            <TabsContent value="contract-log">
              <div>Contract Log content goes here.</div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}
