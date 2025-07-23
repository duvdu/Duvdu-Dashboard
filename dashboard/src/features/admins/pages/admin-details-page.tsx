import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../users/api/users.api";
import AdminProfileHeader from "../components/AdminProfileHeader";
import AdminRolePermissionsPanel from "../components/AdminRolePermissionsPanel";

export default function AdminDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: admin,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });

  if (error) {
    return (
      <DashboardLayout className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/admins")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/dashboard/admins")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admins
        </Button>
        <h1 className="text-2xl font-bold">Admin Details</h1>
      </div>

      <div className="space-y-6">
        <AdminProfileHeader admin={admin} refetch={refetch} />
        <AdminRolePermissionsPanel admin={admin} />
      </div>
    </DashboardLayout>
  );
}
