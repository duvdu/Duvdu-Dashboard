import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Filters } from "@/components/ui/filters";
import { PageLoader } from "@/components/ui/page-loader";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { ArchiveIcon, MessageSquareIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { getChats } from "../api/chat.api";
import { useChatColumns } from "../columns/chat-columns";
import { ChatSearchBar } from "../components/ChatSearchBar";
import { UserSearchSelect } from "../components/UserSearchSelect";
import { type ChatFilters } from "../types/chat.types";

export default function ChatListPage() {
  const [filters, setFilters] = useState<ChatFilters>({
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showArchivedChats, setShowArchivedChats] = useState(false);

  const updateQueryParam = useUpdateQueryParam();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["chats", filters],
    queryFn: () => getChats(filters),
  });

  const columns = useChatColumns(refetch);

  const handleFilterChange = (newFilters: Partial<ChatFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateQueryParam(updatedFilters);
  };

  const handleSearch = (query: string, searchType?: string) => {
    handleFilterChange({ search: query });
  };

  const handleClearSearch = () => {
    handleFilterChange({ search: "" });
  };

  const handleNewChat = (user: any) => {
    // Navigate to chat with this user
    window.location.href = `/dashboard/chat/${user._id}`;
  };

  const toggleArchived = () => {
    setShowArchivedChats(!showArchivedChats);
    handleFilterChange({ isArchived: !showArchivedChats });
  };

  const quickFilters = [
    {
      key: "all",
      label: "All Chats",
      value: undefined,
      active: !filters.isArchived && !filters.isPinned,
    },
    {
      key: "pinned",
      label: "Pinned",
      value: true,
      active: filters.isPinned === true,
    },
    {
      key: "archived",
      label: "Archived",
      value: true,
      active: filters.isArchived === true,
    },
  ];

  const handleQuickFilter = (key: string, value?: boolean) => {
    if (key === "all") {
      handleFilterChange({ isArchived: undefined, isPinned: undefined });
    } else if (key === "pinned") {
      handleFilterChange({ isPinned: value, isArchived: undefined });
    } else if (key === "archived") {
      handleFilterChange({ isArchived: value, isPinned: undefined });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Error loading chats
          </h3>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquareIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Chat Management</h1>
          <Badge variant="outline" className="ml-2">
            {data?.pagination.resultCount || 0} chats
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowNewChatModal(!showNewChatModal)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Start New Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UserSearchSelect
                onSelectUser={handleNewChat}
                placeholder="Search users to start a conversation..."
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowNewChatModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <ChatSearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search chats by participant name, username, email, or phone..."
            />

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Quick Filters:</span>
              {quickFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={filter.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickFilter(filter.key, filter.value)}
                >
                  {filter.key === "archived" && (
                    <ArchiveIcon className="h-3 w-3 mr-1" />
                  )}
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Advanced Filters */}
            <Filters
              values={filters}
              onChange={handleFilterChange}
              filters={[
                {
                  key: "sortBy",
                  label: "Sort By",
                  type: "select",
                  placeholder: "Select Sort By",
                  options: [
                    { label: "Last Activity", value: "updatedAt" },
                    { label: "Created Date", value: "createdAt" },
                    { label: "Participant Name", value: "participants" },
                  ],
                },
                {
                  key: "sortOrder",
                  label: "Order",
                  type: "select",
                  options: [
                    { label: "Newest First", value: "desc" },
                    { label: "Oldest First", value: "asc" },
                  ],
                },
                {
                  key: "limit",
                  label: "Items per page",
                  type: "select",
                  options: [
                    { label: "10", value: "10" },
                    { label: "25", value: "25" },
                    { label: "50", value: "50" },
                    { label: "100", value: "100" },
                  ],
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chat List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5" />
            {filters.isArchived ? "Archived Chats" : "Active Chats"}
            <Badge variant="secondary" className="ml-2">
              {data?.pagination.resultCount || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data?.data || []}
            pagesCount={data?.pagination.totalPages}
            page={data?.pagination.currentPage}
            limit={data?.pagination.resultCount}
            loading={isLoading}
            // emptyState={{
            //   icon: MessageSquareIcon,
            //   title: filters.isArchived
            //     ? "No archived chats"
            //     : "No active chats",
            //   description: filters.isArchived
            //     ? "You don't have any archived conversations."
            //     : "Start a new conversation to see it here.",
            //   action: !filters.isArchived && (
            //     <Button onClick={() => setShowNewChatModal(true)}>
            //       <PlusIcon className="h-4 w-4 mr-2" />
            //       Start New Chat
            //     </Button>
            //   ),
            // }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
