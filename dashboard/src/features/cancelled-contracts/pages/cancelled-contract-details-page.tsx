import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeftIcon, Briefcase, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCancelledContractById } from "../api/cancelled-contract.api";

export default function CancelledContractDetailsPage() {
  const { id } = useParams();
  const { onOpen, refetch } = useModal();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cancelled-contract", id],
    queryFn: () => getCancelledContractById(id!),
    enabled: !!id,
  });

  if (isLoading) return <DashboardLoader />;
  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  if (!data) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Cancelled contract not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const { contract, cancelReason, user, createdAt } = data;
  const { customer, sp, contract: contractData } = contract;
  const status = contractData.status;

  return (
    <DashboardLayout className="w-full mx-auto py-6 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard/cancelled-contracts">
                <ArrowLeftIcon className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Cancelled Contract Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                onOpen("approveCancelledContract", { id: data._id }, refetch)
              }
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                onOpen("rejectCancelledContract", { id: data._id }, refetch)
              }
            >
              Reject
            </Button>
          </div>
        </div>
        <div className="text-gray-600 mt-1">
          {/* Cancelled Contract #{data._id.slice(-8)} */}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={customer.profileImage}
                  alt={customer.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                  preview
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {customer.name}
                  </h3>
                  {customer.username && (
                    <p className="text-sm text-gray-600">
                      @{customer.username}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {customer.phoneNumber?.number}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Service Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={sp.profileImage}
                  alt={sp.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                  preview
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{sp.name}</h3>
                  {sp.username && (
                    <p className="text-sm text-gray-600">@{sp.username}</p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {sp.phoneNumber?.number}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Cancelled By:</span>{" "}
                {user?.name}
              </div>
              <div>
                <span className="font-semibold">Reason:</span> {cancelReason}
              </div>
              <div>
                <span className="font-semibold">Cancelled At:</span>{" "}
                {new Date(createdAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{status}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
