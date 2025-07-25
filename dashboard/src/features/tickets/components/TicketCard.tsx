import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";

function TicketCard({ ticket }: { ticket: any }) {
  const isClosed = ticket.state?.isClosed;

  return (
    <Card
      key={ticket.id}
      className="flex flex-col h-full transition-shadow hover:shadow-lg relative"
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
        <Image
          src={ticket.userId?.profileImage || undefined}
          alt={ticket.userId?.name || ticket.name}
          className="w-12 h-12 rounded-full border"
        />
        <div className="flex-1 min-w-0">
          {ticket.userId ? (
            <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
              {ticket.userId?.name}
              <span className="text-muted-foreground font-normal ml-1 truncate">
                (@{ticket.userId?.username})
              </span>
            </CardTitle>
          ) : (
            <CardTitle className="text-base font-semibold truncate">
              {ticket.name}
            </CardTitle>
          )}
          <div className="text-xs text-muted-foreground mt-0.5">
            {new Date(ticket.createdAt).toLocaleString()}
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
            variant="secondary"
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            {ticket?.message}
          </Badge>

          {/* <div className="text-sm mt-2 break-words">{ticket.message}</div> */}
          {ticket.ticketNumber && (
            <Badge variant="default" className="text-xs px-2 py-1 mt-2">
              Ticket Number: {ticket.ticketNumber}
            </Badge>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex justify-end mt-2">
          <Link to={`/dashboard/tickets/${ticket.id}`} className="w-full">
            <Button variant="default" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketCard;
