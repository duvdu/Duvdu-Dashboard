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
import { DocumentUploader } from "@/components/ui/document-uploader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  type ProjectFormSchema,
  projectFormSchema,
} from "../schemas/project.schema";

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

  const categoryMedia = form.watch("categoryMedia");
  const mediaAccept =
    categoryMedia === "image"
      ? "image/*"
      : categoryMedia === "video"
      ? "video/*"
      : categoryMedia === "audio"
      ? "audio/*"
      : undefined;

  const unitOptions =
    categoryMedia === "image"
      ? ["image"]
      : ["seconds", "minutes", "hours", "episodes"];

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

        {/* Attachments, Cover, Audio Cover */}
        <div>
          {categoryMedia && (
            <div className="my-2">
              <Badge variant="default" className="px-2 py-0.5 ">
                Media Type: {categoryMedia}
              </Badge>
            </div>
          )}
          <FormLabel className="mb-2">Attachments</FormLabel>
          <div className="flex flex-wrap w-full gap-4">
            {attachments &&
              attachments.length > 0 &&
              attachments.map((file, idx) => (
                <DocumentUploader
                  key={idx}
                  value={file}
                  label={""}
                  accept={mediaAccept}
                  onChange={(val) => {
                    if (val === null) {
                      handleRemoveAttachment(idx);
                      return;
                    }
                    setAttachments((prev) => {
                      const updated = [...prev];
                      updated[idx] = val;
                      form.setValue("attachments", updated);
                      return updated;
                    });
                  }}
                />
              ))}
            <DocumentUploader
              value={undefined}
              className="w-full"
              label={""}
              accept={mediaAccept}
              onChange={(val) => {
                if (val) handleAddAttachment(val);
              }}
            />
          </div>
          {form.formState.errors.attachments?.message && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.attachments.message as string}
            </p>
          )}
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
        {categoryMedia === "audio" && (
          <FormField
            name="audioCover"
            control={form.control}
            render={() => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    label="Audio Cover"
                    value={(form.watch("audioCover") || [])[0]}
                    onChange={(val) => {
                      if (val === null) {
                        form.setValue("audioCover", [] as any);
                      } else {
                        form.setValue("audioCover", [val] as any);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
                      {unitOptions.map((unit) => (
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
