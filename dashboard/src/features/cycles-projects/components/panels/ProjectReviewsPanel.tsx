import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { getProjectReviews } from "@/features/project-reviews/api/project-review.api";
import { useProjectReviewColumns } from "@/features/project-reviews/columns/project-review-columns";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function ProjectReviewsPanel({ id }: { id: string }) {
  const [reviewSearchParams, setReviewSearchParams] = useSearchParams();
  const reviewPage = +reviewSearchParams.get("reviewPage") || 1;
  const reviewLimit = +reviewSearchParams.get("reviewLimit") || 10;
  const user = reviewSearchParams.get("user") || "";
  const cycle = reviewSearchParams.get("cycle") || "";
  const rate = reviewSearchParams.get("rate") || "";
  const startDate = reviewSearchParams.get("startDate") || "";
  const endDate = reviewSearchParams.get("endDate") || "";

  const reviewFilters = {
    page: reviewPage,
    limit: reviewLimit,
    user: user || undefined,
    cycle: cycle || undefined,
    rate: rate || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    project: id,
  };

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["project-reviews", reviewFilters],
    queryFn: () => getProjectReviews(reviewFilters),
    enabled: !!id,
  });

  const reviewColumns = useProjectReviewColumns(refetchReviews);
  const reviewPagesCount = reviewsData?.pagination.totalPages || 0;
  const reviewTotalCount = reviewsData?.pagination.resultCount || 0;

  // Only user, project, and search filters
  const reviewsFilterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          onSelectUser={(user) => {
            setReviewSearchParams({ user: user._id });
          }}
        />
      ),
    },
  ];
  const reviewFilterValues = {
    user: reviewFilters.user,
    project: reviewFilters.project,
    cycle: reviewFilters.cycle,
    rate: reviewFilters.rate,
    startDate: reviewFilters.startDate,
    endDate: reviewFilters.endDate,
  };

  const handleReviewFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(reviewSearchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(key, value as string);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set("reviewPage", "1");
    setReviewSearchParams(newParams);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Reviews</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total: {reviewTotalCount} reviews
        </div>
      </CardHeader>
      <CardContent>
        {reviewsError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{reviewsError.message}</AlertDescription>
          </Alert>
        )}
        <DataTable
          columns={reviewColumns}
          data={reviewsData?.data || []}
          loading={reviewsLoading}
          pagesCount={reviewPagesCount}
          page={reviewPage}
          limit={reviewLimit}
          filters={reviewsFilterDefinitions}
          filterValues={reviewFilterValues}
          onFiltersChange={handleReviewFiltersChange}
        />
      </CardContent>
    </Card>
  );
}

export default ProjectReviewsPanel;
