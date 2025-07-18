import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/features/categories/api/category.api";
import type { Category } from "@/features/categories/types/category.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  type ProjectFormSchema,
  projectFormSchema,
} from "../schemas/project.schema";

const projectScaleUnits = ["seconds", "minutes", "hours", "episodes"];

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormSchema>;
  onSubmit: (values: ProjectFormSchema) => void;
  isLoading?: boolean;
}

export function ProjectForm({
  initialValues,
  onSubmit,
  isLoading,
}: ProjectFormProps) {
  const navigate = useNavigate();
  const form = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues as any,
    mode: "onChange",
  });

  // Tag-style state for keywords, tools, functions
  const [keywordInput, setKeywordInput] = useState("");
  const [toolName, setToolName] = useState("");
  const [toolValue, setToolValue] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [functionValue, setFunctionValue] = useState("");

  // Attachments state (multiple images)
  const [attachments, setAttachments] = useState<(File | string)[]>(
    form.watch("attachments") || []
  );

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", "all-for-project-form"],
    queryFn: () => getCategories({ limit: 1000 }),
  });
  const categories: Category[] = categoriesData?.data || [];

  // Map categories to options
  const categoryOptions: Option[] = useMemo(
    () =>
      categories.map((cat) => ({ value: cat._id || "", label: cat.title.en })),
    [categories]
  );

  // Get selected category object
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat._id === form.watch("category")),
    [categories, form.watch("category")]
  );

  // Subcategory options
  const subCategoryOptions: Option[] = useMemo(
    () =>
      selectedCategory?.subCategories?.map((sub) => ({
        value: sub._id || "",
        label: sub.title.en,
      })) || [],
    [selectedCategory]
  );

  // Tag options (from selected subcategory or all tags in category)
  const selectedSubCategory = useMemo(
    () =>
      selectedCategory?.subCategories?.find(
        (sub) => sub._id === form.watch("subCategory")
      ),
    [selectedCategory, form.watch("subCategory")]
  );
  const tagOptions: Option[] = useMemo(
    () =>
      selectedSubCategory?.tags?.map((tag) => ({
        value: tag._id,
        label: tag.en,
      })) ||
      selectedCategory?.subCategories?.flatMap((sub) =>
        sub.tags.map((tag) => ({ value: tag._id, label: tag.en }))
      ) ||
      [],
    [selectedCategory, selectedSubCategory]
  );

  // Related category options (all except current)
  const relatedCategoryOptions: Option[] = useMemo(
    () =>
      categories
        .filter((cat) => cat._id !== form.watch("category"))
        .map((cat) => ({ value: cat._id || "", label: cat.title.en })),
    [categories, form.watch("category")]
  );

  // Related subcategory and tag options (from related category)
  const selectedRelatedCategory = useMemo(
    () => categories.find((cat) => cat._id === form.watch("relatedCategory")),
    [categories, form.watch("relatedCategory")]
  );
  const relatedSubCategoryOptions: Option[] = useMemo(
    () =>
      selectedRelatedCategory?.subCategories?.map((sub) => ({
        value: sub._id || "",
        label: sub.title.en,
      })) || [],
    [selectedRelatedCategory]
  );
  const selectedRelatedSubCategory = useMemo(
    () =>
      selectedRelatedCategory?.subCategories?.find(
        (sub) => sub._id === form.watch("relatedSubCategory")
      ),
    [selectedRelatedCategory, form.watch("relatedSubCategory")]
  );
  const relatedTagOptions: Option[] = useMemo(
    () =>
      selectedRelatedSubCategory?.tags?.map((tag) => ({
        value: tag._id,
        label: tag.en,
      })) ||
      selectedRelatedCategory?.subCategories?.flatMap((sub) =>
        sub.tags.map((tag) => ({ value: tag._id, label: tag.en }))
      ) ||
      [],
    [selectedRelatedCategory, selectedRelatedSubCategory]
  );

  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim()) {
      form.setValue("searchKeyWords", [
        ...(form.getValues("searchKeyWords") || []),
        keywordInput.trim(),
      ]);
      setKeywordInput("");
    }
  };
  const removeKeyword = (idx: number) => {
    const arr = [...(form.getValues("searchKeyWords") || [])];
    arr.splice(idx, 1);
    form.setValue("searchKeyWords", arr);
  };

  // Add tool
  const addTool = () => {
    if (toolName.trim() && toolValue.trim() && !isNaN(Number(toolValue))) {
      form.setValue("tools", [
        ...(form.getValues("tools") || []),
        { name: toolName.trim(), unitPrice: Number(toolValue) },
      ]);
      setToolName("");
      setToolValue("");
    }
  };
  const removeTool = (idx: number) => {
    const arr = [...(form.getValues("tools") || [])];
    arr.splice(idx, 1);
    form.setValue("tools", arr);
  };

  // Add function
  const addFunction = () => {
    if (
      functionName.trim() &&
      functionValue.trim() &&
      !isNaN(Number(functionValue))
    ) {
      form.setValue("functions", [
        ...(form.getValues("functions") || []),
        { name: functionName.trim(), unitPrice: Number(functionValue) },
      ]);
      setFunctionName("");
      setFunctionValue("");
    }
  };
  const removeFunction = (idx: number) => {
    const arr = [...(form.getValues("functions") || [])];
    arr.splice(idx, 1);
    form.setValue("functions", arr);
  };

  // Attachments logic
  const handleAddAttachment = (file: File | string) => {
    setAttachments((prev) => {
      const updated = [...prev, file];
      form.setValue("attachments", updated);
      return updated;
    });
  };
  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      form.setValue("attachments", updated);
      return updated;
    });
  };

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues as any);
      setAttachments(initialValues.attachments || []);
    }
  }, [initialValues]);

  console.log(form.formState.errors, "errors");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Name, Description, Duration, Address */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="duration"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category, Subcategory, Tags, Related Category, Related Subcategory, Related Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
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
          <FormField
            name="subCategory"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategoryOptions.map((opt) => (
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={tagOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select tags"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="relatedCategory"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Category</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select related category" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatedCategoryOptions.map((opt) => (
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="relatedSubCategory"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Subcategory</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select related subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatedSubCategoryOptions.map((opt) => (
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
          <FormField
            name="relatedTags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={relatedTagOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select related tags"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Attachments, Cover, Audio Cover */}
        <div>
          <FormLabel>Attachments</FormLabel>
          <div className="flex flex-wrap w-full gap-4">
            {attachments && attachments.length > 0 ? (
              attachments.map((file, idx) => (
                <ImageUploader
                  value={file}
                  className="w-full"
                  onChange={() => handleRemoveAttachment(idx)}
                  label={""}
                />
              ))
            ) : (
              <ImageUploader
                value={undefined}
                className="w-full"
                onChange={handleAddAttachment}
                label={undefined}
              />
            )}
          </div>
        </div>
        <FormField
          name="cover"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  label="Cover"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Tools Used */}
        <div>
          <FormLabel>Tools Used</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Tool name"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-1/2"
            />
            <Input
              placeholder="Unit price"
              type="number"
              value={toolValue}
              onChange={(e) => setToolValue(e.target.value)}
              className="w-1/2"
            />
            <Button type="button" onClick={addTool}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch("tools") || []).map((tool, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="flex items-center gap-1 rounded-full px-3 py-1 bg-card text-foreground border border-border"
              >
                <span className="truncate max-w-[120px]">
                  {tool.name} - {tool.unitPrice}
                </span>
                <button
                  type="button"
                  onClick={() => removeTool(idx)}
                  className="ml-1 rounded-full hover:bg-destructive/20 focus:bg-destructive/30 p-0.5 transition-colors"
                  tabIndex={0}
                  aria-label="Remove tool"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Functions Used */}
        <div>
          <FormLabel>Functions Used</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Function name"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="w-1/2"
            />
            <Input
              placeholder="Unit price"
              type="number"
              value={functionValue}
              onChange={(e) => setFunctionValue(e.target.value)}
              className="w-1/2"
            />
            <Button type="button" onClick={addFunction}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch("functions") || []).map((fn, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="flex items-center gap-1 rounded-full px-3 py-1 bg-muted text-foreground border border-border"
              >
                <span className="truncate max-w-[120px]">
                  {fn.name} - {fn.unitPrice}
                </span>
                <button
                  type="button"
                  onClick={() => removeFunction(idx)}
                  className="ml-1 rounded-full hover:bg-destructive/20 focus:bg-destructive/30 p-0.5 transition-colors"
                  tabIndex={0}
                  aria-label="Remove function"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <FormLabel>Keywords</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
            <Button type="button" onClick={addKeyword}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch("searchKeyWords") || []).map((kw, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="flex items-center gap-1 rounded-full px-3 py-1 bg-muted text-foreground border border-border"
              >
                <span className="truncate max-w-[120px]">{kw}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(idx)}
                  className="ml-1 rounded-full hover:bg-destructive/20 focus:bg-destructive/30 p-0.5 transition-colors"
                  tabIndex={0}
                  aria-label="Remove keyword"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        {/* Project Scale */}
        <FormLabel>Project Scale</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="projectScale.unit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectScaleUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="projectScale.pricerPerUnit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Unit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name="projectScale.minimum"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="projectScale.current"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="projectScale.maximum"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Show on Home */}
        <FormField
          name="showOnHome"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Show on Home Feed & Profile</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="w-fit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
