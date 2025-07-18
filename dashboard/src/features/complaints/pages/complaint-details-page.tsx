import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useRBAC } from "@/contexts/RBACProvider";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Paperclip } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getComplaintById } from "../api/complaint.api";
import type { Complaint } from "../types/complaint.types";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["complaint", id],
    queryFn: () => getComplaintById(id as string),
    enabled: !!id,
  });
  const { onOpen } = useModal();

  useRBAC();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-16">
          <Loader className="w-10 h-10" />
        </div>
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
          <AlertDescription>Complaint not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const complaint = data as Complaint;
  const isClosed = Boolean(complaint.closedBy);
  const status = isClosed ? (
    <Badge
      variant="destructive"
      className="text-xs px-3 py-1 rounded-full font-bold"
    >
      Closed
    </Badge>
  ) : (
    <Badge
      variant="success"
      className="text-xs px-3 py-1 rounded-full font-bold"
    >
      Open
    </Badge>
  );
  const feedbacks = complaint.state.filter((s) => s.feedback);
  const hasAttachments =
    complaint.attachments && complaint.attachments.length > 0;

  return (
    <DashboardLayout>
      <div className="flex gap-4 items-center mb-4">
        <Button variant="outline" asChild>
          <Link to="/dashboard/complaints">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Complaint Details</h2>
      </div>
      <Card className={`w-full overflow-x-hidden  mx-auto  gap-1 shadow-lg `}>
        <CardHeader className="flex flex-row items-center gap-6 border-b pb-4 relative">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage
              src={complaint.reporter.profileImage || undefined}
              alt={complaint.reporter.name}
            />
            <AvatarFallback className="text-lg font-bold">
              {complaint.reporter.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate flex items-center gap-2">
              {complaint.reporter.name}
              <span className="text-muted-foreground font-normal ml-1 truncate text-base">
                (@{complaint.reporter.username})
              </span>
            </CardTitle>
          </div>

          <div className="flex flex-wrap  items-center gap-2 min-w-fit">
            {complaint.ticketNumber && (
              <Badge variant="default" className="text-xs px-2 py-1">
                Ticket Number: {complaint.ticketNumber}
              </Badge>
            )}
            {status}
            <ProtectedComponent
              permissionKeys={[PERMISSION_KEYS.CONTRACTS.VIEW]}
            >
              <Button
                variant="outline"
                asChild
                size="sm"
                className="flex items-center gap-1 px-2 py-1 h-8"
              >
                <Link to={`/dashboard/contracts/${complaint.contract}`}>
                  <Paperclip className="w-4 h-4 mr-1" /> View Contract
                </Link>
              </Button>
            </ProtectedComponent>
          </div>
        </CardHeader>
        <CardContent className="w-full h-full py-6 px-4 flex flex-col gap-4">
          {/* Attachments */}
          {hasAttachments && (
            <div className="mb-2">
              <div className="font-semibold mb-1 flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> Attachments
              </div>
              <div className="flex flex-wrap gap-2">
                {complaint.attachments.map((att, idx) => (
                  <MediaPreview
                    key={att + idx}
                    src={att}
                    alt={`Attachment ${idx + 1}`}
                    className="w-16 h-16 border-2 border-primary rounded-md p-4"
                    preview
                  />
                ))}
              </div>
            </div>
          )}

          {/* Feedback Thread */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <MessageCircle className="w-5 h-5" /> Feedback Thread
            </h3>
            <ScrollArea className="max-h-[50vh] overflow-y-auto mb-4 pr-2">
              {feedbacks.length === 0 && (
                <div className="text-muted-foreground text-center py-8">
                  No feedback yet.
                </div>
              )}
              <div className="flex flex-col gap-4">
                {complaint.state.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage
                        src={s.addedBy?.profileImage || undefined}
                        alt={s.addedBy?.name || "User"}
                      />
                      <AvatarFallback>
                        {s.addedBy?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {s.addedBy?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {s.feedback && (
                        <div className="bg-muted rounded-xl px-4 py-2 text-sm max-w-md break-words border">
                          {s.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Add Feedback Button */}
          {!isClosed && (
            <div className="sticky bottom-0  pt-2 pb-1 z-20 flex justify-end">
              <Button
                onClick={() =>
                  onOpen("addComplaintFeedback", { id: complaint._id })
                }
                className="w-full md:w-auto"
              >
                Add Feedback
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
