import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CheckCircle,
  MessageSquareIcon,
  UsersIcon,
  X,
} from "lucide-react";
import { type User } from "../types/chat.types";
import { UserSearchSelect } from "./UserSearchSelect";

interface UserToUserChatSidebarProps {
  selectedUser1: User | null;
  selectedUser2: User | null;
  onUser1Select: (user: User) => void;
  onUser2Select: (user: User) => void;
  onClearUser1: () => void;
  onClearUser2: () => void;
  onClearSelection: () => void;
}

export function UserToUserChatSidebar({
  selectedUser1,
  selectedUser2,
  onUser1Select,
  onUser2Select,
  onClearUser1,
  onClearUser2,
  onClearSelection,
}: UserToUserChatSidebarProps) {
  const isUsersSelected = selectedUser1 && selectedUser2;
  const hasFirstUser = selectedUser1 && !selectedUser2;

  const handleClearUser1 = () => {
    onClearUser1();
  };

  const handleClearUser2 = () => {
    onClearUser2();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="py-4">
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          User-to-User Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">First User</label>
              {selectedUser1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearUser1}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {selectedUser1 ? (
              <div className="p-3 bg-muted/50 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <img
                    src={selectedUser1.profileImage || "/default-avatar.png"}
                    alt={selectedUser1.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser1.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{selectedUser1.username}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <UserSearchSelect
                placeholder="Search for first user..."
                selectedUserId={selectedUser1?._id}
                onSelectUser={onUser1Select}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Second User</label>
              {selectedUser2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearUser2}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {selectedUser2 ? (
              <div className="p-3 bg-muted/50 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <img
                    src={selectedUser2.profileImage || "/default-avatar.png"}
                    alt={selectedUser2.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser2.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{selectedUser2.username}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <UserSearchSelect
                placeholder={
                  hasFirstUser
                    ? "Search for second user..."
                    : "Select first user first"
                }
                selectedUserId={selectedUser2?._id}
                onSelectUser={onUser2Select}
                disabled={!selectedUser1}
              />
            )}
          </div>
        </div>

        <Separator />

        {/* First User Selected State */}
        {hasFirstUser && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                First user selected
              </p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Now select the second user to view their conversation
            </p>
          </div>
        )}

        {/* Both Users Selected State */}
        {isUsersSelected && (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                <MessageSquareIcon className="w-4 h-4" />
                Ready to View Conversation
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedUser1.profileImage || "/default-avatar.png"}
                    alt={selectedUser1.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser1.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{selectedUser1.username}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={selectedUser2.profileImage || "/default-avatar.png"}
                    alt={selectedUser2.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser2.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{selectedUser2.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onClearSelection}
                variant="outline"
                className="flex-1"
              >
                Clear Both
              </Button>
            </div>
          </div>
        )}

        {/* No Users Selected State */}
        {!selectedUser1 && !selectedUser2 && (
          <div className="text-center text-muted-foreground py-8">
            <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-1">
              Select two users to view their conversation
            </p>
            <p className="text-xs">Start by selecting the first user above</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
