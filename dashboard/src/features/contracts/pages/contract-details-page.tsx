import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getContractById } from "../api/contract.api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Image } from "@/components/ui/image";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldCheck,
  Link2,
} from "lucide-react";
import { DeleteContractModal } from "../components/DeleteContractModal";

export default function ContractDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById(id!),
    enabled: !!id,
  });
  console.log(data);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader className="w-8 h-8 mx-auto mt-10" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
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
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Contract not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const {
    customer,
    sp,
    status,
    address,
    totalPrice,
    startDate,
    deadline,
    insurance,
    projectScale,
    qrCodeVerification,
  } = {
    ...data.contract,
    customer: data.customer,
    sp: data.sp,
  };
  console.log(customer, sp, "customer");

  return (
    <DashboardLayout className="w-full mx-auto py-8 ">
      <DeleteContractModal />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full relative">
        {/* Customer Info */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Customer
            </CardTitle>
            <CardDescription>
              {customer.username && `@${customer.username}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Image
              src={customer.profileImage}
              alt={customer.name}
              className="w-20 h-20 rounded-full border"
              preview
            />
            <div>
              <div className="font-bold text-lg">{customer.name}</div>
              <div className="text-sm text-muted-foreground">
                {customer.email}
              </div>
              <div className="text-sm text-muted-foreground">
                {customer.phoneNumber?.number}
              </div>
              {customer.isOnline && <Badge variant="success">Online</Badge>}
            </div>
          </CardContent>
        </Card>
        {/* Service Provider Info */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Service Provider
            </CardTitle>
            <CardDescription>
              {sp.username && `@${sp.username}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Image
              src={sp.profileImage}
              alt={sp.name}
              className="w-20 h-20 rounded-full border"
              preview
            />
            <div>
              <div className="font-bold text-lg">{sp.name}</div>
              <div className="text-sm text-muted-foreground">{sp.email}</div>
              <div className="text-sm text-muted-foreground">
                {sp.phoneNumber?.number}
              </div>
              {sp.isOnline && <Badge variant="success">Online</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Contract Summary */}
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Contract Summary
          </CardTitle>
          <div className="flex gap-2">
            <Badge
              variant={
                status === "completed"
                  ? "success"
                  : status === "canceled"
                  ? "destructive"
                  : "secondary"
              }
            >
              {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
            </Badge>
            {qrCodeVerification && <Badge variant="success">QR Verified</Badge>}
            {insurance && (
              <Badge variant="outline">Insurance: {insurance}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {address}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" /> Total Price:{" "}
              <span className="font-semibold">{totalPrice}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" /> Start:{" "}
              {startDate ? new Date(startDate).toLocaleDateString() : "-"} |
              Deadline:{" "}
              {deadline ? new Date(deadline).toLocaleDateString() : "-"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" /> Project Scale:{" "}
              {projectScale?.numberOfUnits} {projectScale?.unit} @{" "}
              {projectScale?.unitPrice} each
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {/* <ProtectedComponent
              permissionKey={PERMISSION_KEYS.CONTRACTS.UPDATE}
            >
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/contracts/update/${id}`)}
              >
                <Edit2Icon className="w-4 h-4 mr-1" /> Edit
              </Button>
            </ProtectedComponent> */}
            {/* <ProtectedComponent
              permissionKey={PERMISSION_KEYS.CONTRACTS.DELETE}
            >
              <Button
                variant="destructive"
                onClick={() =>
                  onOpen("deleteContract", { id }, () =>
                    navigate("/dashboard/contracts")
                  )
                }
              >
                <Trash2Icon className="w-4 h-4 mr-1" /> Delete
              </Button>
            </ProtectedComponent> */}
            {data.contract?.paymentLink && (
              <Button variant="link" asChild>
                <a
                  href={data.contract?.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link2 className="w-4 h-4 mr-1" /> Payment Link
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Attachments Section */}
      {data.contract?.attachments && data.contract?.attachments.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            {data.contract?.attachments.map((att, idx) => (
              <Image
                key={idx}
                src={att}
                alt={`Attachment ${idx + 1}`}
                className="w-32 h-32 rounded-lg border"
                preview
              />
            ))}
          </CardContent>
        </Card>
      )}
      {/* Raw JSON for debugging (remove in production) */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </DashboardLayout>
  );
}
