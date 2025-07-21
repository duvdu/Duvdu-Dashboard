import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCustomPageById } from "../api/custom-page.api";

export default function CustomPageDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["custom-page", id],
    queryFn: () => getCustomPageById(id),
  });

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader className="w-10 h-10 mb-4" />
          <span className="text-muted-foreground">Loading page details...</span>
        </div>
      </DashboardLayout>
    );

  if (!data)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>Custom page not found.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/custom-pages">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-center">
            Custom Page Details
          </h1>
        </div>
      </div>

      <div className=" mx-auto w-full py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold break-words">
              {data.title}
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/dashboard/custom-pages/update/${id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <PencilIcon className="w-4 h-4" /> Edit
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Edit this page</TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="prose max-w-none min-h-[120px] bg-muted/40 rounded-lg p-4 mt-2">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  data.content ||
                  "<p class='text-muted-foreground'>No content.</p>",
              }}
            />
          </CardContent>
          <div className="flex flex-wrap gap-3 px-6 py-2 text-xs text-muted-foreground border-t mt-4">
            {data.createdAt && (
              <Badge variant="outline">
                Created: {new Date(data.createdAt).toLocaleString()}
              </Badge>
            )}
            {data.updatedAt && (
              <Badge variant="outline">
                Updated: {new Date(data.updatedAt).toLocaleString()}
              </Badge>
            )}
            {id && <Badge variant="secondary">ID: {id}</Badge>}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
