import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTicketById } from "../api/ticket.api";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id as string),
    enabled: !!id,
  });
  const navigate = useNavigate();
  const { onOpen } = useModal();

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 p-4">{error.message}</div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-red-500 p-4">Ticket not found.</div>
      </DashboardLayout>
    );
  }

  const ticket = data;
  const isClosed = ticket.state?.isClosed;
  const hasFeedback = Boolean(ticket.state?.feedback);

  return (
    <DashboardLayout>
      <div className="flex gap-4 items-center mb-4">
        <Button variant="outline" asChild>
          <Link to="/dashboard/tickets">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Ticket Details</h2>
      </div>
      <Card className="w-full mx-auto gap-1 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-6 border-b pb-4 relative">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate flex items-center gap-2">
              {ticket?.name}
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2 min-w-fit">
            {ticket.ticketNumber && (
              <Badge variant="default" className="text-xs px-2 py-1">
                Ticket Number: {ticket.ticketNumber}
              </Badge>
            )}
            <Badge
              variant={isClosed ? "destructive" : "success"}
              className="text-xs px-3 py-1 rounded-full font-bold"
            >
              {isClosed ? "Closed" : "Open"}
            </Badge>
            <ProtectedComponent permissionKey={PERMISSION_KEYS.TICKETS.DELETE}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  onOpen(
                    "deleteTicket",
                    {
                      id: ticket.id,
                      name: ticket.name,
                      ticketNumber: ticket.ticketNumber,
                    },
                    () => navigate("/dashboard/tickets")
                  )
                }
              >
                Delete
              </Button>
            </ProtectedComponent>
          </div>
        </CardHeader>
        <CardContent className="w-full h-full py-6 px-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <MessageCircle className="w-5 h-5" /> Message
            </h3>
            <div className="bg-muted rounded-xl px-4 py-2 text-sm max-w-md break-words border">
              {ticket.message}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <MessageCircle className="w-5 h-5" /> Feedback
            </h3>
            {hasFeedback ? (
              <div className="bg-muted rounded-xl px-4 py-2 text-sm max-w-md break-words border">
                {ticket.state.feedback}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                No feedback yet.
              </div>
            )}
          </div>
          <ProtectedComponent permissionKey={PERMISSION_KEYS.TICKETS.UPDATE}>
            {!isClosed && !hasFeedback && (
              <div className="sticky bottom-0 pt-2 pb-1 z-20 flex justify-end">
                <Button
                  onClick={() => onOpen("addTicketFeedback", { id: ticket.id })}
                  className="w-full md:w-auto"
                >
                  Add Feedback
                </Button>
              </div>
            )}
          </ProtectedComponent>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
