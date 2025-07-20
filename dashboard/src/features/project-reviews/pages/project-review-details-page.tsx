import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { getProjectReviewById } from "../api/project-review.api";

export default function ProjectReviewDetailsPage() {
  const { id } = useParams();
  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project-review", id],
    queryFn: () => getProjectReviewById(id),
  });
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8" />
      </div>
    );
  if (error)
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  if (!review)
    return (
      <div className="text-center py-10 text-muted-foreground">Not found</div>
    );
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          {review.user && (
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={review.user.profileImage} />
                <AvatarFallback>
                  {review.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg flex items-center gap-2">
                  {review.user.name}
                  {review.user.rank?.title && (
                    <Badge variant="outline" className="ml-2 px-2 py-1 text-xs">
                      {review.user.rank.title}
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">
                  @{review.user.username}
                </div>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span>Projects: {review.user.acceptedProjectsCounter}</span>
                  <span>Views: {review.user.projectsView}</span>
                  <span>Online: {review.user.isOnline ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          )}
          {/* Review Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Rate:</span>
              <span>{review.rate ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cycle:</span>
              <span>{review.cycle ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Comment:</span>
              <span>{review.comment ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Created At:</span>
              <span>
                {review.createdAt
                  ? format(new Date(review.createdAt), "MMM dd, yyyy HH:mm")
                  : "-"}
              </span>
            </div>
          </div>
          {/* Project Info */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Project:</span>
            <span>{review.project ?? "-"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
