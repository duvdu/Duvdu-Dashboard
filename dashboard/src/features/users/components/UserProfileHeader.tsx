import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { type FC } from "react";
import type { User } from "../types/user.types";

interface UserProfileHeaderProps {
  user: User;
}

const UserProfileHeader: FC<UserProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-lg shadow mb-4">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.name}
            preview
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xl font-semibold">{user.name}</span>
          <Badge
            variant={user.status === "active" ? "default" : "secondary"}
            className="text-xs"
          >
            {user.status}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 mb-1">{user.email}</div>
        <div className="text-sm text-gray-500">{user.type}</div>
        <div className="text-xs text-gray-400 mt-1">
          Created:{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
