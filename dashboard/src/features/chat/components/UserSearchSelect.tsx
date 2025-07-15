import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { searchUsers } from "../api/chat.api";
import { type User } from "../types/chat.types";

interface UserSearchSelectProps {
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function UserSearchSelect({
  onSelectUser,
  selectedUserId,
  placeholder = "Search users by name, username, email, or phone...",
  className,
  disabled = false,
}: UserSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery, undefined, 20),
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleUserSelect = (user: User) => {
    onSelectUser(user);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={disabled}
        />
        {searchQuery && !disabled && (
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

      {isOpen && !disabled && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0  ">
            <ScrollArea className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Searching users...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-destructive">
                  Error searching users
                </div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No users found for "{debouncedQuery}"
                </div>
              ) : (
                <div className="py-2">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors",
                        selectedUserId === user._id && "bg-muted"
                      )}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="relative">
                        <MediaPreview
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {user.isOnline && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate flex-1 min-w-0 max-w-[70%]">
                          {user.name}
                        </h4>

                        {user.phoneNumber && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {user.phoneNumber.number}
                          </div>
                        )}

                        {user.about && (
                          <div className="text-xs text-muted-foreground truncate max-w-[70%]">
                            {user.about}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
