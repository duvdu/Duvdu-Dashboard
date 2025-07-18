import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { getCategories } from "@/features/categories/api/category.api";
import type { Project } from "@/features/cycles-projects";
import { getProjects } from "@/features/cycles-projects/api/project.api";
import { useProjectColumns } from "@/features/cycles-projects/columns/project-columns";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

interface ProjectsPanelProps {
  userId: string;
}
//     search?: string;
//     startDate?: Date;
//     endDate?: Date;
//     category?: Types.ObjectId[];
//     subCategory?: Types.ObjectId[];
// sortOrder?: 'asc' | 'desc';

export default function ProjectsPanel({ userId }: ProjectsPanelProps) {
  const { getQueryParam } = useUpdateQueryParam("projects");
  const search = getQueryParam("keyword") || "";
  const startDate = getQueryParam("startDate") || "";
  const endDate = getQueryParam("endDate") || "";
  const category = getQueryParam("category") || "";
  const subCategory = getQueryParam("subCategory") || "";
  const sortOrder = getQueryParam("sortOrder") || "asc";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");

  const projectColumns = useProjectColumns();

  const filterValues = {
    search: search,
    startDate: startDate,
    endDate: endDate,
    category: category,
    subCategory: subCategory,
    sortOrder: sortOrder,
    page: page,
    limit: limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", userId, filterValues],
    queryFn: () =>
      getProjects({
        user: userId,
        page: page || undefined,
        limit: limit || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        category: category || undefined,
        subCategory: subCategory || undefined,
        sortOrder: (sortOrder as "asc" | "desc") || undefined,
      }),
  });

  const projects: Project[] = data?.data || [];

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 1000 }),
  });

  const subCategories = categories?.data
    ?.find((cat) => cat._id === category)
    ?.subCategories.map((subCategory) => ({
      label: subCategory.title.en,
      value: subCategory._id,
    }));

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading transactions.
      </div>
    );
  }

  // Filter definitions
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      placeholder: "Select Start Date",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      placeholder: "Select End Date",
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories?.data?.map((category) => ({
        label: category.title.en,
        value: category._id,
      })),
      placeholder: "Select Category",
    },
    {
      key: "subCategory",
      label: "Sub Category",
      type: "select",
      options: subCategories,
      placeholder: "Select Sub Category",
    },
    {
      key: "sortOrder",
      label: "Sort Order",
      type: "select",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
      placeholder: "Select Sort Order",
    },
  ];

  return (
    <DataTable
      columns={projectColumns}
      data={projects}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={page}
      limit={limit}
      tableId="projects"
      filters={filterDefinitions}
      filterValues={filterValues}
    />
  );
}
