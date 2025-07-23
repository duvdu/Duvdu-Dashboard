import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, Layers, Plus, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/category.api";
import {
  categorySchema,
  type CategorySchema,
} from "../schemas/category.schema";

export type CategoryFormProps = {
  defaultValues?: Partial<CategorySchema> & {
    _id?: string;
    relatedCategory?: string[];
  };
  onSubmit: (values: CategorySchema, file?: File) => void;
  isLoading?: boolean;
  submitLabel?: string;
  submitting?: boolean;
};

const cycleOptions = [
  { value: "producer", label: "Producer" },
  { value: "copy-rights", label: "Copy Rights" },
  { value: "rentals", label: "Rentals" },
  { value: "project", label: "Project" },
];

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
  submitting,
}: CategoryFormProps) {
  const methods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: { ar: "", en: "" },
      jobTitles: [],
      subCategories: [],
      status: true,
      trend: false,
      isRelated: false,
      cycle: "",
      insurance: false,
      image: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
  const { handleSubmit, control, setValue, watch, getValues, formState } =
    methods;

  const navigate = useNavigate();

  // For image upload
  const image = watch("image");
  // const jobTitlesCount = watch("jobTitles")?.length || 0;
  const subCategoriesCount = watch("subCategories")?.length || 0;

  // Subcategories
  const {
    fields: subCategories,
    append: appendSubCategory,
    remove: removeSubCategory,
  } = useFieldArray<CategorySchema>({
    control,
    name: "subCategories",
  });

  // Helper to add a tag to a subcategory
  function appendTag(subIdx: number) {
    const tags: { ar: string; en: string }[] =
      getValues(`subCategories.${subIdx}.tags` as const) || [];
    setValue(`subCategories.${subIdx}.tags` as const, [
      ...tags,
      { ar: "", en: "" },
    ]);
  }

  // Helper to remove a tag from a subcategory
  function removeTag(subIdx: number, tagIdx: number) {
    const tags: { ar: string; en: string }[] =
      getValues(`subCategories.${subIdx}.tags` as const) || [];
    setValue(
      `subCategories.${subIdx}.tags` as const,
      tags.filter((_, i) => i !== tagIdx)
    );
  }

  const [activeTab, setActiveTab] = useState("details");
  const subCategoriesError = formState.errors.subCategories?.message as
    | string
    | undefined;

  const cycle = watch("cycle");
  const [projectType, setProjectType] = useState<"main" | "related">("main");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories", "all-for-multiselect"],
    queryFn: () => getCategories({ limit: 1000, isRelated: true }),
    enabled: cycle === "project",
  });
  const categoryOptions: Option[] = (categoriesData?.data || []).map(
    (cat: any) => ({
      value: cat._id,
      label: cat.title.en,
    })
  );
  // If editing, exclude current category from options
  useEffect(() => {
    if (defaultValues?._id) {
      setSelectedCategories(defaultValues.relatedCategory || []);
    }
  }, [defaultValues?.relatedCategory.length]);

  console.log(formState.errors);

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={handleSubmit((values) => {
            const file =
              typeof values.image === "object" ? (values.image as File) : null;
            // Attach selectedCategories if projectType is main and cycle is project
            if (cycle === "project" && projectType === "main") {
              (values as any).relatedCategories = selectedCategories;
            }
            // Attach insurance if cycle is rentals
            if (cycle === "rentals") {
              values.insurance = values.insurance ?? false;
            }
            onSubmit(values, file);
          })}
          className="space-y-6"
        >
          {/* Global error if subcategory error exists and not on subcategories tab */}
          {subCategoriesError && activeTab !== "subcategories" && (
            <Alert variant="destructive">
              <AlertTitle>
                {subCategoriesError} (see Subcategories tab)
              </AlertTitle>
            </Alert>
          )}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="subcategories"
                className={`flex items-center gap-2 ${
                  subCategoriesError ? "text-destructive" : ""
                }`}
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Subcategories</span>
                {subCategoriesCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {subCategoriesCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Category Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="title.ar"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Arabic)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="العنوان بالعربية"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="title.en"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Title in English" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="cycle"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cycle</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select cycle" />
                            </SelectTrigger>
                            <SelectContent>
                              {cycleOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business logic fields based on cycle */}
                  {cycle === "project" && (
                    <div className="space-y-4">
                      <FormField
                        name="media_type"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Media Type</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select media type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {["video", "image", "audio"].map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormLabel>Project Type</FormLabel>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={
                            projectType === "main" ? "default" : "outline"
                          }
                          onClick={() => {
                            setProjectType("main");
                            setValue("isRelated", false);
                          }}
                        >
                          Main Category
                        </Button>
                        <Button
                          type="button"
                          variant={
                            projectType === "related" ? "default" : "outline"
                          }
                          onClick={() => {
                            setProjectType("related");
                            setValue("isRelated", true);
                          }}
                        >
                          Related Category
                        </Button>
                      </div>
                      {projectType === "main" && (
                        <div className="mt-2 space-y-2">
                          <FormLabel>Select Related Categories</FormLabel>
                          <MultiSelect
                            options={categoryOptions.filter(
                              (opt) =>
                                !defaultValues?._id ||
                                opt.value !== defaultValues._id
                            )}
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            className="w-fit"
                            placeholder="Select categories"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {cycle === "rentals" && (
                    <div className="space-y-4">
                      <FormLabel>Insurance</FormLabel>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={watch("insurance") ? "default" : "outline"}
                          onClick={() => setValue("insurance", true)}
                        >
                          Have Insurance
                        </Button>
                        <Button
                          type="button"
                          variant={!watch("insurance") ? "default" : "outline"}
                          onClick={() => setValue("insurance", false)}
                        >
                          Not Have Insurance
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Category Settings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <FormField
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {field.value ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="trend"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Trending</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {field.value ? "Yes" : "No"}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Category Image
                    </h3>
                    <ImageUploader
                      value={image}
                      onChange={(file) => setValue("image", file as File)}
                    />
                    {formState.errors.image?.message && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTitle>
                          {formState.errors.image?.message}
                        </AlertTitle>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subcategories" className="space-y-6">
              {/* Show error inside subcategories tab */}
              {subCategoriesError && (
                <Alert variant="destructive">
                  <AlertTitle>{subCategoriesError}</AlertTitle>
                </Alert>
              )}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Subcategories
                      {subCategoriesCount > 0 && (
                        <Badge variant="secondary">{subCategoriesCount}</Badge>
                      )}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendSubCategory({
                          title: { ar: "", en: "" },
                          tags: [],
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Subcategory
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {subCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No subcategories added yet</p>
                      <p className="text-sm">
                        Click "Add Subcategory" to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {subCategories.map((sub, subIdx) => {
                        const tags: { ar: string; en: string }[] =
                          watch(`subCategories.${subIdx}.tags` as const) || [];
                        return (
                          <div
                            key={sub.id}
                            className="p-4 border rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">
                                Subcategory {subIdx + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSubCategory(subIdx)}
                                className="text-destructive hover:text-destructive h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                name={
                                  `subCategories.${subIdx}.title.ar` as const
                                }
                                control={control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Arabic Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="بالعربية"
                                        className="text-right"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                name={
                                  `subCategories.${subIdx}.title.en` as const
                                }
                                control={control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>English Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="In English"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-3">
                              {formState.errors.subCategories?.[subIdx]?.tags
                                ?.message && (
                                <Alert variant="destructive">
                                  <AlertTitle>
                                    {
                                      formState.errors.subCategories?.[subIdx]
                                        ?.tags?.message
                                    }
                                  </AlertTitle>
                                </Alert>
                              )}
                              <div className="flex items-center justify-between">
                                <FormLabel>
                                  Tags {tags.length > 0 && `(${tags.length})`}
                                </FormLabel>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => appendTag(subIdx)}
                                  className="flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add Tag
                                </Button>
                              </div>

                              {tags.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                  No tags added yet
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {tags.map((_, tagIdx) => (
                                    <div
                                      key={tagIdx}
                                      className="p-3 border rounded bg-background"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">
                                          Tag {tagIdx + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeTag(subIdx, tagIdx)
                                          }
                                          className="text-destructive hover:text-destructive h-6 w-6 p-0"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FormField
                                          name={
                                            `subCategories.${subIdx}.tags.${tagIdx}.ar` as const
                                          }
                                          control={control}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Arabic</FormLabel>
                                              <FormControl>
                                                <Input
                                                  {...field}
                                                  placeholder="بالعربية"
                                                  className="text-right"
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          name={
                                            `subCategories.${subIdx}.tags.${tagIdx}.en` as const
                                          }
                                          control={control}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>English</FormLabel>
                                              <FormControl>
                                                <Input
                                                  {...field}
                                                  placeholder="In English"
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground"></div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                className="min-w-[120px]"
                onClick={() => navigate("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading || submitting}
                // disabled={Object.keys(formState.errors).length > 0}
                className="min-w-[120px]"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
