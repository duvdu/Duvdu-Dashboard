import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { useInfiniteQuery } from "@/hooks/useInfiniteQuery";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getComplaints } from "../api/complaint.api";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintsFilters from "../components/ComplaintsFilters";
import { type Complaint } from "../types/complaint.types";

export default function ComplaintListPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const isClosed = searchParams.get("isClosed") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const reporter = searchParams.get("reporter") || "";

  // For UserSearchSelect
  const {
    data: complaints,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    observerRef: infiniteObserverRef,
  } = useInfiniteQuery<Complaint>({
    queryFn: ({ page, limit }) =>
      getComplaints({
        page,
        limit,
        search: search || undefined,
        isClosed: isClosed === "true" ? "true" : undefined,
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
        <h1 className="text-2xl font-bold">Complaints</h1>
      </div>

      <ComplaintsFilters />
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {complaints.map((complaint) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <ComplaintCard complaint={complaint} />
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
      {!isLoading && !isLoadingMore && complaints.length === 0 && (
        <Alert>
          <AlertTitle>No complaints found</AlertTitle>
        </Alert>
      )}
      {/* Infinite scroll observer */}
      <div ref={infiniteObserverRef} />
      {!hasMore && complaints.length > 0 && (
        <div className="text-center text-muted-foreground py-4">
          No more complaints
        </div>
      )}
    </DashboardLayout>
  );
}
