import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { MediaPreview } from "@/components/ui/media-preview";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractComplaintsPanel from "@/features/complaints/components/ContractComplaintsPanel";
import ContractReviewsPanel from "@/features/contract-reviews/components/ContractReviewsPanel";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeftIcon,
  Briefcase,
  Calculator,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  File,
  FileText,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Receipt,
  ShieldCheck,
  Timer,
  ToolCase,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getContractById } from "../api/contract.api";
import ContractsFundTransactionsPanel from "../components/ContractsFundTransactionsPanel";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in_progress":
    case "active":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "canceled":
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "in_progress":
    case "active":
      return <Activity className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "canceled":
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateProgress = (startDate: string, deadline: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(deadline).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
};

export default function ContractDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <DashboardLoader />;
  }

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
    tools,
    functions,
    details,
    firstPaymentAmount,
    secondPaymentAmount,
    duration,
    equipmentPrice,
    submitFiles,
    attachments,
    appointmentDate,
    createdAt,
    updatedAt,
  } = {
    ...data.contract,
    customer: data.customer,
    sp: data.sp,
  };

  const progress = calculateProgress(startDate, deadline);
  const isOverdue = new Date(deadline) < new Date() && status !== "completed";
  const daysRemaining = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <DashboardLayout loading={isLoading} className="w-full mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/dashboard/contracts">
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Contract Details
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Contract #{data.contract._id.slice(-8)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${getStatusColor(status)} flex items-center gap-2`}
            >
              {getStatusIcon(status)}
              {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
            </Badge>
            {qrCodeVerification && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                QR Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status !== "completed" && status !== "canceled" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Project Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Started: {formatDate(startDate)}</span>
              <span>Deadline: {formatDate(deadline)}</span>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Project is overdue</span>
              </div>
            )}
            {!isOverdue && daysRemaining > 0 && (
              <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{daysRemaining} days remaining</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fund-transactions">Payouts</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Project Overview
                    </div>
                    <Button variant="link" size="sm" asChild>
                      <Link to={`/dashboard/projects/${data.contract.project}`}>
                        View Project Details
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-gray-900">{address}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Appointment Date</span>
                      </div>
                      <p className="text-gray-900">
                        {formatDate(appointmentDate)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="w-4 h-4" />
                        <span className="font-medium">Duration</span>
                      </div>
                      <p className="text-gray-900">{duration} days</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calculator className="w-5 h-5" />
                        <span className="font-medium">Project Scale</span>
                      </div>
                      <p className="text-gray-900">
                        {projectScale?.numberOfUnits} {projectScale?.unit} @{" "}
                        {formatCurrency(projectScale?.unitPrice)} each
                      </p>
                    </div>
                  </div>

                  {details && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Project Details</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-medium">Total Price</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(totalPrice)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Receipt className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          First Payment
                        </span>
                      </div>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency(firstPaymentAmount)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Receipt className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Second Payment
                        </span>
                      </div>
                      <p className="text-xl font-bold text-purple-900">
                        {formatCurrency(secondPaymentAmount)}
                      </p>
                    </div>
                  </div>

                  {equipmentPrice > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Wrench className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Equipment Cost
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(equipmentPrice)}
                      </p>
                    </div>
                  )}

                  {insurance && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Insurance Coverage
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-yellow-900">
                        {formatCurrency(insurance)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tools & Functions */}
              {(tools?.length > 0 || functions?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ToolCase className="w-5 h-5" />
                      Tools & Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tools?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Tools
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tools.map((tool) => (
                              <div
                                key={tool._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {tool.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {tool.units} units
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(tool.unitPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {functions?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Functions
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {functions.map((func) => (
                              <div
                                key={func._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {func.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {func.units} units
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(func.unitPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submitted Files */}
              {submitFiles?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Submitted Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {submitFiles.map((file, index) => (
                        <div
                          key={file._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">
                                File {index + 1}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDateTime(file.dateOfSubmission)}
                              </p>
                              {file.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {file.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                file.status === "approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : file.status === "rejected"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {file.status}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={file.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {attachments?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Paperclip className="w-5 h-5" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {attachments.map((attachment, index) => (
                        <MediaPreview
                          key={index}
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          preview
                          className="w-full h-32 object-cover rounded-lg border cursor-pointer transition-transform group-hover:scale-105"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer
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
                      <div className="flex items-center gap-2 mt-2">
                        {customer.isOnline ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Online
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-600 border-gray-200"
                          >
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {customer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {customer.phoneNumber?.number}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Provider Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Service Provider
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
                      <div className="flex items-center gap-2 mt-2">
                        {sp.isOnline ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Online
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-600 border-gray-200"
                          >
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{sp.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {sp.phoneNumber?.number}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Contract Created
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Project Started
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Deadline
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(deadline)}
                        </p>
                      </div>
                    </div>

                    {status === "completed" && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Completed
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="fund-transactions">
          <div className="py-4">
            <ContractsFundTransactionsPanel contractId={data.contract._id} />
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="py-4">
            <ContractReviewsPanel id={data.contract._id} />
          </div>
        </TabsContent>
        <TabsContent value="complaints">
          <div className="py-4">
            <ContractComplaintsPanel id={data.contract._id} />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
