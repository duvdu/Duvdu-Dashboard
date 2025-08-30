import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractsPanel from "@/features/contracts/components/ContractsPanel";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/users.api";
import ComplaintsPanel from "../components/panels/ComplaintsPanel";
import PayoutMethodsPanel from "../components/panels/PayoutMethodsPanel";
import ProjectsPanel from "../components/panels/ProjectsPanel";
import SubscriptionsPanel from "../components/panels/SubscriptionsPanel";
import TransactionsPanel from "../components/panels/TransactionsPanel";
import UserProfileHeader from "../components/UserProfileHeader";
import { PERMISSION_KEYS } from "@/config/permissions";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import ContractsFundTransactionsPanel from "@/features/contracts/components/ContractsFundTransactionsPanel";

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
      <DashboardLayout className=" py-6">
        <div>
          <UserProfileHeader user={user} refetch={refetch} />
          <Tabs defaultValue="payout-methods" className="mt-8 flex-wrap">
            <TabsList className="mb-4">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.WITHDRAW_METHODS.VIEW]}
              >
                <TabsTrigger value="payout-methods">Payout Methods</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.COMPLAINTS.VIEW]}
              >
                <TabsTrigger value="complaints">Complaints</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.TRANSACTIONS.VIEW]}
              >
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.TRANSACTIONS.VIEW]}
              >
                <TabsTrigger value="financial-log">Financial Log</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.FUND_TRANSACTIONS.VIEW]}
              >
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.PROJECTS.VIEW]}
              >
                <TabsTrigger value="content-log">Content Log</TabsTrigger>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.CONTRACTS.VIEW]}
              >
                <TabsTrigger value="contract-log">Contract Log</TabsTrigger>
              </ProtectedComponent>
            </TabsList>
            <TabsContent value="payout-methods">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.WITHDRAW_METHODS.VIEW]}
              >
                <PayoutMethodsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="complaints">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.COMPLAINTS.VIEW]}
              >
                <ComplaintsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="subscriptions">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.TRANSACTIONS.VIEW]}
              >
                <SubscriptionsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="financial-log">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.TRANSACTIONS.VIEW]}
              >
                <TransactionsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="payouts">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.FUND_TRANSACTIONS.VIEW]}
              >
                <ContractsFundTransactionsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="content-log">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.PROJECTS.VIEW]}
              >
                <ProjectsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
            <TabsContent value="contract-log">
              <ProtectedComponent
                permissionKeys={[PERMISSION_KEYS.CONTRACTS.VIEW]}
              >
                <ContractsPanel userId={id} />
              </ProtectedComponent>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}
