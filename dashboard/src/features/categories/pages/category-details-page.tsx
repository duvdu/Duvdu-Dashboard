import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Loader } from "@/components/ui/loader";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Tag as TagIcon, TrashIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "../api/category.api";

function CategoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onOpen } = useModal();
  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
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

  if (!category) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Category not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className="w-full mx-auto py-8 ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full relative">
        {category.image && (
          <Image
            src={category.image}
            alt={category.title.en}
            className="w-64 h-64 rounded-2xl border object-cover"
            imageClassName="object-cover"
            preview
          />
        )}
        <div className="flex-1 flex flex-col justify-center gap-2 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center md:text-left">
              {category.title.en}
            </h1>
            <div className="flex justify-end mb-2 w-full gap-2">
              <Button
                size="lg"
                onClick={() =>
                  navigate(`/dashboard/categories/update/${category._id}`)
                }
              >
                Edit
              </Button>
              <Button
                className="text-destructive"
                variant="outline"
                size="lg"
                onClick={() =>
                  onOpen("deleteCategory", { id: category._id }, () =>
                    navigate("/dashboard/categories")
                  )
                }
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2 justify-center md:justify-start">
            <Badge variant={category.status ? "default" : "outline"}>
              {category.status ? "Active" : "Inactive"}
            </Badge>
            {category.trend && <Badge variant="outline">Trend</Badge>}
            {category.insurance && <Badge variant="outline">Insurance</Badge>}
            {category.isRelated && <Badge variant="outline">Is Related</Badge>}
          </div>
          <div className="flex flex-wrap gap-4 text-muted-foreground text-base justify-center md:justify-start">
            <div>
              <span className="font-semibold">Cycle:</span> {category.cycle}
            </div>
            {category.createdAt && (
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(category.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Job Titles Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Job Titles</h2>
        </div>
        {category.jobTitles && category.jobTitles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {category.jobTitles.map((jt, idx) => (
              <Button
                key={jt._id || idx}
                variant="outline"
                className="justify-between cursor-default w-full rounded-full px-6 py-4 text-base font-medium flex items-center shadow-sm"
                type="button"
                tabIndex={-1}
              >
                {jt.en}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No job titles.</div>
        )}
      </div>
      {/* Subcategories Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TagIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Subcategories</h2>
        </div>
        {category.subCategories && category.subCategories.length > 0 ? (
          <div className="flex flex-col gap-4">
            {category.subCategories.map((sc, idx) => (
              <Card key={sc._id || idx} className="p-4 border rounded-xl">
                <div className="font-semibold text-lg mb-2">{sc.title.en}</div>
                <div className="flex flex-wrap gap-2">
                  {sc.tags && sc.tags.length > 0 ? (
                    sc.tags.map((tag, tIdx) => (
                      <Badge
                        key={tag._id || tIdx}
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-sm"
                      >
                        {tag.en}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No tags.</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No subcategories.</div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CategoryDetailsPage;
