import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { Loader } from "@/components/ui/loader";
import { MediaPreview } from "@/components/ui/media-preview";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserSearchSelect } from "@/features/chat";
import { getProjectReviews } from "@/features/project-reviews/api/project-review.api";
import { useProjectReviewColumns } from "@/features/project-reviews/columns/project-review-columns";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  DollarSignIcon,
  Download,
  GaugeIcon,
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  Maximize2Icon,
  Minimize2Icon,
  PauseIcon,
  PlayIcon,
  RulerIcon,
  TagIcon,
  TrashIcon,
  TrendingUpIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  getProjectById,
  getProjectHistory,
  getProjectPublicUrl,
} from "../api/project.api";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onOpen } = useModal();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
  });

  const { data: projectHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["project-history", id],
    queryFn: () => getProjectHistory(id!),
    enabled: !!id,
  });

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
    user,
    cycle,
    rate,
    startDate,
    endDate,
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

  if (isLoading) {
    return <DashboardLoader />;
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

  if (!project) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Project not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className="space-y-6 ">
      {/* Status Ribbon */}
      <div className={`w-full h-2 rounded-t-lg mb-4 `} />
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* back button */}
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
              <span className="break-words">{project.name}</span>
            </h1>
          </div>

          <p className="text-muted-foreground mt-2 text-base lg:text-lg max-w-4xl leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(getProjectPublicUrl(project._id));
              toast.success("Project link copied!");
            }}
            aria-label="Copy project link"
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={getProjectPublicUrl(project._id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Public
              <GlobeIcon className="h-4 w-4 " />
            </a>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() =>
                    onOpen("deleteProject", { id: project._id }, () =>
                      navigate("/dashboard/projects")
                    )
                  }
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="history">History Log</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUpIcon className="h-4 w-4" /> Show on Home
                  </span>
                  <Badge variant={project.showOnHome ? "default" : "outline"}>
                    {project.showOnHome ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GaugeIcon className="h-4 w-4" /> Duration
                  </span>
                  <span className="text-sm font-medium">
                    {project.duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HeartIcon className="h-4 w-4 text-red-500" /> Favorites
                  </span>
                  <span className="text-sm font-medium">
                    {project.favouriteCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" /> Created
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">
                      {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                {project.address && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" /> Location
                    </span>
                    <span className="text-sm font-medium">
                      {project.address}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Information */}
            <Card>
              <CardHeader>
                <CardTitle>Project Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 shadow-lg border-2 border-primary">
                    <AvatarImage src={project.user.profileImage} />
                    <AvatarFallback>
                      {project.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
                      <span className="break-words">{project.user.name}</span>
                      <Badge
                        variant="outline"
                        className="ml-2 px-2 py-1 text-xs"
                      >
                        {project.user.rank.title}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      @{project.user.username}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/users/${project.user._id}`)
                        }
                        className="flex items-center gap-1"
                      >
                        <UserIcon className="h-4 w-4" /> View Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Projects Views
                    </span>
                    <p className="font-medium">{project.user.projectsView}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completed</span>
                    <p className="font-medium flex items-center gap-1">
                      {project.user.acceptedProjectsCounter}
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating</span>
                    <p className="font-medium">
                      {project.user.rate.totalRates}/5
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Followers</span>
                    <p className="font-medium">
                      {project.user.followCount.followers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Information */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TagIcon className="h-4 w-4 text-primary" /> Category
                  </span>
                  <p className="font-medium mt-1">
                    <Badge
                      variant="default"
                      className="text-xs px-2 py-1 bg-primary/90 text-white"
                    >
                      {project.category.title as unknown as string}
                    </Badge>
                  </p>
                </div>
                {project.subCategory?.title && (
                  <div>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TagIcon className="h-4 w-4 text-secondary" /> Subcategory
                    </span>
                    <p className="font-medium mt-1">
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {project.subCategory.title as unknown as string}
                      </Badge>
                    </p>
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TagIcon className="h-4 w-4 text-blue-500" /> Tags
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag._id}
                          variant="outline"
                          className="text-xs border-blue-400 text-blue-700 bg-blue-50 flex items-center gap-1 px-2 py-1"
                        >
                          <TagIcon className="h-3 w-3 text-blue-400" />
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Scale */}
            <Card>
              <CardHeader>
                <CardTitle>Project Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <RulerIcon className="h-4 w-4" /> Unit
                    </span>
                    <p className="font-medium">{project.projectScale.unit}</p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSignIcon className="h-4 w-4" /> Price per Unit
                    </span>
                    <p className="font-medium">
                      ${project.projectScale.pricerPerUnit}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Minimize2Icon className="h-4 w-4" /> Minimum
                    </span>
                    <p className="font-medium">
                      {project.projectScale.minimum}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Maximize2Icon className="h-4 w-4" /> Maximum
                    </span>
                    <p className="font-medium">
                      {project.projectScale.maximum}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <GaugeIcon className="h-4 w-4" /> Current
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          ((project.projectScale.current -
                            project.projectScale.minimum) /
                            (project.projectScale.maximum -
                              project.projectScale.minimum)) *
                          100
                        }
                        className="w-full max-w-xs"
                      />
                      <span className="font-medium">
                        {project.projectScale.current}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools and Functions */}
          {(project.tools.length > 0 || project.functions.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.tools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TagIcon className="h-5 w-5 text-blue-500" />
                      Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.tools.map((tool) => (
                        <div
                          key={tool._id}
                          className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {tool.name}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {tool.unitPrice}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.functions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TagIcon className="h-5 w-5 text-purple-500" />
                      Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.functions.map((func) => (
                        <div
                          key={func._id}
                          className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {func.name}
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {func.unitPrice}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cover Image/Video */}
                <div>
                  <h3 className="font-medium mb-2">Cover</h3>
                  <MediaPreview
                    src={project.cover}
                    alt={project.name}
                    className="w-full max-w-md rounded-md"
                    preview
                  />
                </div>

                {/* Attachments Carousel */}
                {project.attachments.length > 0 && (
                  <div className="w-full  relaative">
                    <h3 className="font-medium mb-2">Attachments</h3>
                    <Carousel className="w-full ">
                      <CarouselContent>
                        {project.attachments.map((attachment, index) => (
                          <CarouselItem
                            key={index}
                            className="flex flex-col items-center gap-2"
                          >
                            <MediaPreview
                              src={attachment}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-64 rounded-md object-cover"
                              preview
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = attachment;
                                link.download = `attachment-${index + 1}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </CarouselItem>
                        ))}
                        <CarouselPrevious />
                        <CarouselNext />
                      </CarouselContent>
                    </Carousel>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <Loader className="w-6 h-6 mx-auto" />
              ) : (
                <div className="space-y-4">
                  {projectHistory && projectHistory.length > 0 ? (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

                      {projectHistory.map((entry: any, index: number) => {
                        const isLatest = index === 0;
                        const getActionIcon = (action: string) => {
                          switch (action.toLowerCase()) {
                            case "approved":
                              return (
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              );
                            case "rejected":
                              return (
                                <XCircleIcon className="h-4 w-4 text-red-500" />
                              );
                            case "paused":
                              return (
                                <PauseIcon className="h-4 w-4 text-yellow-500" />
                              );
                            case "resumed":
                              return (
                                <PlayIcon className="h-4 w-4 text-green-500" />
                              );
                            case "deleted":
                              return (
                                <TrashIcon className="h-4 w-4 text-red-500" />
                              );
                            default:
                              return (
                                <ClockIcon className="h-4 w-4 text-blue-500" />
                              );
                          }
                        };

                        return (
                          <div
                            key={index}
                            className={`relative flex gap-4 p-4 rounded-lg transition-all ${
                              isLatest
                                ? "bg-primary/5 border border-primary/20 shadow-sm"
                                : "bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            {/* Timeline dot */}
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                isLatest
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-muted-foreground"
                              }`}
                            >
                              {getActionIcon(entry.action)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4
                                    className={`font-medium ${
                                      isLatest ? "text-primary" : ""
                                    }`}
                                  >
                                    {entry.action}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {entry.description}
                                  </p>
                                  {entry.reason && (
                                    <p className="text-sm text-muted-foreground mt-2 italic">
                                      Reason: {entry.reason}
                                    </p>
                                  )}
                                </div>
                                <time
                                  className={`text-xs text-muted-foreground flex items-center gap-1 ${
                                    isLatest ? "text-primary" : ""
                                  }`}
                                >
                                  <ClockIcon className="h-3 w-3" />
                                  {format(
                                    new Date(entry.timestamp),
                                    "MMM dd, yyyy HH:mm"
                                  )}
                                </time>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No history available.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProjectDetailsPage;
