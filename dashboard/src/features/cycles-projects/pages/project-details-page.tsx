import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  ExternalLinkIcon,
  HeartIcon,
  MapPinIcon,
  PauseIcon,
  PlayIcon,
  TagIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
    refetch,
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader className="w-8 h-8 mx-auto mt-10" />
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

  const status = project.status || "pending";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "deleted":
        return (
          <Badge variant="outline" className="text-red-500">
            Deleted
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          <Button variant="outline" size="sm" asChild>
            <a
              href={getProjectPublicUrl(project._id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View Public
            </a>
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {status === "pending" && (
          <>
            <Button
              onClick={() =>
                onOpen("approveProject", { id: project._id }, refetch)
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                onOpen("rejectProject", { id: project._id }, refetch)
              }
            >
              <XIcon className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        )}
        {status === "approved" && (
          <Button
            variant="secondary"
            onClick={() => onOpen("pauseProject", { id: project._id }, refetch)}
          >
            <PauseIcon className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        {status === "paused" && (
          <Button
            onClick={() =>
              onOpen("approveProject", { id: project._id }, refetch)
            }
            className="bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Resume
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() =>
            onOpen("deleteProject", { id: project._id }, () =>
              navigate("/dashboard/projects")
            )
          }
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="history">History Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Show on Home
                  </span>
                  <Badge variant={project.showOnHome ? "default" : "outline"}>
                    {project.showOnHome ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-medium">
                    {project.duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Favorites
                  </span>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">
                      {project.favouriteCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                {project.address && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {project.address}
                      </span>
                    </div>
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
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={project.user.profileImage} />
                    <AvatarFallback>
                      {project.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{project.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{project.user.username}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {project.user.rank.title}
                    </Badge>
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
                    <p className="font-medium">
                      {project.user.acceptedProjectsCounter}
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
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <p className="font-medium">{project.category.title}</p>
                </div>
                {project.subCategory?.title && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Subcategory
                    </span>
                    <p className="font-medium">{project.subCategory.title}</p>
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag._id}
                          variant="secondary"
                          className="text-xs"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
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
                    <span className="text-muted-foreground">Unit</span>
                    <p className="font-medium">{project.projectScale.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Price per Unit
                    </span>
                    <p className="font-medium">
                      ${project.projectScale.pricerPerUnit}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Minimum</span>
                    <p className="font-medium">
                      {project.projectScale.minimum}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Maximum</span>
                    <p className="font-medium">
                      {project.projectScale.maximum}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current</span>
                    <p className="font-medium">
                      {project.projectScale.current}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools and Functions */}
          {(project.tools.length > 0 || project.functions.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.tools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.tools.map((tool) => (
                        <div
                          key={tool._id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{tool.name}</span>
                          <span className="text-sm font-medium">
                            ${tool.unitPrice}
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
                    <CardTitle>Functions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.functions.map((func) => (
                        <div
                          key={func._id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{func.name}</span>
                          <span className="text-sm font-medium">
                            ${func.unitPrice}
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
                  <Image
                    src={project.cover}
                    alt={project.name}
                    className="w-full max-w-md rounded-md"
                    preview
                  />
                </div>

                {/* Attachments */}
                {project.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Attachments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.attachments.map((attachment, index) => (
                        <Image
                          key={index}
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-48 rounded-md object-cover"
                          preview
                        />
                      ))}
                    </div>
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
                    projectHistory.map((entry: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{entry.action}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {entry.description}
                              </p>
                            </div>
                            <time className="text-xs text-muted-foreground">
                              {format(
                                new Date(entry.timestamp),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </time>
                          </div>
                          {entry.reason && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Reason: {entry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No history available.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProjectDetailsPage;
