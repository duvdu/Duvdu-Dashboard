import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { PERMISSION_KEYS } from "@/config/permissions";
import { MessageCircle, Paperclip } from "lucide-react";
import { Link } from "react-router-dom";
import { type Complaint } from "../types/complaint.types";

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const feedbackCount = complaint.state.filter((s) => s.feedback).length;
  const hasAttachments =
    complaint.attachments && complaint.attachments.length > 0;
  const isClosed = Boolean(complaint.closedBy);

  return (
    <Card
      key={complaint._id}
      className={`flex flex-col h-full transition-shadow hover:shadow-lg relative `}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
        <Image
          src={complaint.reporter.profileImage || undefined}
          alt={complaint.reporter.name}
          className="w-12 h-12 rounded-full border"
          preview
        />
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
            {complaint.reporter.name}
            <span className="text-muted-foreground font-normal ml-1 truncate">
              (@{complaint.reporter.username})
            </span>
          </CardTitle>
          <div className="text-xs text-muted-foreground mt-0.5">
            {new Date(complaint.createdAt).toLocaleString()}
          </div>
        </div>
        <Badge
          variant={isClosed ? "destructive" : "success"}
          className="text-xs px-3 py-1 rounded-full font-bold"
        >
          {isClosed ? "Closed" : "Open"}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 justify-between px-4 py-1">
        <div className="flex flex-col gap-2">
          <Badge
            key={complaint.desc}
            variant="secondary"
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            {complaint.desc}
          </Badge>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <MessageCircle className="w-4 h-4" />
              {feedbackCount} Feedback{feedbackCount !== 1 ? "s" : ""}
            </Badge>
            <ProtectedComponent
              permissionKeys={[PERMISSION_KEYS.CONTRACTS.VIEW]}
            >
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                <Link
                  to={`/dashboard/contracts/${complaint.contract}`}
                  className="flex items-center gap-1"
                >
                  <Paperclip className="w-4 h-4" />
                  View Contract
                </Link>
              </Badge>
            </ProtectedComponent>
            {hasAttachments && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                <Paperclip className="w-4 h-4" />
                {complaint.attachments.length} Attachment
                {complaint.attachments.length !== 1 ? "s" : ""}
              </Badge>
            )}
            {complaint.ticketNumber && (
              <Badge variant="default" className="text-xs px-2 py-1">
                Ticket Number: {complaint.ticketNumber}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex justify-end mt-2">
          <Link
            to={`/dashboard/complaints/${complaint._id}`}
            className="w-full"
          >
            <Button variant="default" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplaintCard;
