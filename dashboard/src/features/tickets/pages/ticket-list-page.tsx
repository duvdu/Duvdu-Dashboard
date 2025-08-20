import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import ComplaintsFilters from "@/features/complaints/components/ComplaintsFilters";
import { useInfiniteQuery } from "@/hooks/useInfiniteQuery";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getTickets } from "../api/ticket.api";
import TicketCard from "../components/TicketCard";
import type { Ticket } from "../types/ticket.types";

export default function TicketListPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("tickets_search") || "";
  const isClosed = searchParams.get("tickets_isClosed") || "";
  const startDate = searchParams.get("tickets_startDate") || "";
  const endDate = searchParams.get("tickets_endDate") || "";
  const reporter = searchParams.get("tickets_reporter") || "";

  // For UserSearchSelect
  const {
    data: tickets,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    observerRef: infiniteObserverRef,
  } = useInfiniteQuery<Ticket>({
    queryFn: ({ page, limit }) =>
      getTickets({
        page,
        limit,
        search: search || undefined,
        isClosed:
          isClosed === "true" ? true : isClosed === "false" ? false : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        reporter: reporter || undefined,
      }),
    queryParams: { search, isClosed, startDate, endDate, reporter },
    pageSize: 10,
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
      </div>

      <ComplaintsFilters id="tickets" />
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {tickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <TicketCard ticket={ticket} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-10 h-10" />
        </div>
      )}
      {isLoadingMore && !isLoading && (
        <div className="flex justify-center py-4">
          <Loader className="w-8 h-8" />
        </div>
      )}
      {!isLoading && !isLoadingMore && tickets.length === 0 && (
        <Alert>
          <AlertTitle>No tickets found</AlertTitle>
        </Alert>
      )}
      {/* Infinite scroll observer */}
      <div ref={infiniteObserverRef} />
      {!hasMore && tickets.length > 0 && (
        <div className="text-center text-muted-foreground py-4">
          No more tickets
        </div>
      )}
    </DashboardLayout>
  );
}
