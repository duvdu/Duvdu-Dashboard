import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChatSearchForm, chatSearchSchema } from "../schemas/chat.schema";

interface ChatSearchBarProps {
  onSearch: (query: string, searchType?: string) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatSearchBar({
  onSearch,
  onClear,
  placeholder = "Search by Name, Phone, Email, or @Username...",
  disabled = false,
}: ChatSearchBarProps) {
  const [searchType, setSearchType] = useState<string>("all");
  
  const form = useForm<ChatSearchForm>({
    resolver: zodResolver(chatSearchSchema),
    defaultValues: {
      query: "",
      searchType: "users",
    },
  });

  const handleSubmit = (data: ChatSearchForm) => {
    onSearch(data.query, searchType);
  };

  const handleClear = () => {
    form.reset();
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = form.getValues("query");
      if (query.trim()) {
        onSearch(query, searchType);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          {...form.register("query")}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        {form.watch("query") && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Select value={searchType} onValueChange={setSearchType}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="users">Users</SelectItem>
          <SelectItem value="messages">Messages</SelectItem>
          <SelectItem value="content">Content</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        type="button"
        onClick={() => {
          const query = form.getValues("query");
          if (query.trim()) {
            onSearch(query, searchType);
          }
        }}
        disabled={disabled || !form.watch("query")?.trim()}
      >
        Search
      </Button>
    </div>
  );
} 