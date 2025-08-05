import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 256; // max-h-64 = 16rem = 256px

      // Check if there's enough space below
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + 4; // Default: show below

      // If not enough space below and more space above, show above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4;
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen, searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both the container and the dropdown
      const isOutsideContainer =
        containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target);

      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle window resize to reposition dropdown
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

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
    setSelectedUser(user);
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
    handleUserSelect(null);
    setSelectedUser(null);
    setSearchQuery("");
    setIsOpen(false);
  };

  const renderDropdown = () => {
    if (!isOpen || disabled) return null;

    const dropdownContent = (
      <Card
        ref={dropdownRef}
        className="fixed py-0 overflow-hidden shadow-lg border border-border"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 9999,
        }}
      >
        <CardContent className="p-0">
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
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {user.isOnline && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate flex-1 min-w-0 max-w-[90%]">
                        {user.name}
                      </h4>

                      {user.phoneNumber && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {user.phoneNumber.number}
                        </div>
                      )}

                      {user.username && (
                        <div className="text-xs text-muted-foreground truncate max-w-[70%]">
                          @{user.username}
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
    );

    // Use portal to render outside the container
    return createPortal(dropdownContent, document.body);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={selectedUser ? selectedUser.name : placeholder}
          className="pl-10 pr-10"
          disabled={disabled}
        />
        {(searchQuery || selectedUserId) && !disabled && (
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

      {renderDropdown()}
    </div>
  );
}
