import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Role } from "@/features/roles/types/role.types";
import { Key, Settings, Shield, Users } from "lucide-react";
import { type FC } from "react";
import { type User } from "../../users/types/user.types";

interface AdminRolePermissionsPanelProps {
  admin: User;
}

const AdminRolePermissionsPanel: FC<AdminRolePermissionsPanelProps> = ({
  admin,
}) => {
  const role = admin.role as Role;

  const getPermissionsByCategory = (permissions: string[]) => {
    const categories = {
      users: [] as string[],
      admins: [] as string[],
      projects: [] as string[],
      categories: [] as string[],
      roles: [] as string[],
      contracts: [] as string[],
      complaints: [] as string[],
      tickets: [] as string[],
      reports: [] as string[],
      messages: [] as string[],
      notifications: [] as string[],
      withdrawMethods: [] as string[],
      customPages: [] as string[],
      settings: [] as string[],
      ranks: [] as string[],
      fundTransactions: [] as string[],
      transactions: [] as string[],
      others: [] as string[],
    };

    permissions.forEach((permission) => {
      if (permission.includes("user")) {
        categories.users.push(permission);
      } else if (permission.includes("admin")) {
        categories.admins.push(permission);
      } else if (permission.includes("project")) {
        categories.projects.push(permission);
      } else if (
        permission.includes("category") ||
        permission.includes("categories")
      ) {
        categories.categories.push(permission);
      } else if (permission.includes("role")) {
        categories.roles.push(permission);
      } else if (permission.includes("contract")) {
        categories.contracts.push(permission);
      } else if (permission.includes("complaint")) {
        categories.complaints.push(permission);
      } else if (permission.includes("ticket")) {
        categories.tickets.push(permission);
      } else if (permission.includes("report")) {
        categories.reports.push(permission);
      } else if (permission.includes("message")) {
        categories.messages.push(permission);
      } else if (permission.includes("notification")) {
        categories.notifications.push(permission);
      } else if (permission.includes("withdraw")) {
        categories.withdrawMethods.push(permission);
      } else if (permission.includes("page")) {
        categories.customPages.push(permission);
      } else if (permission.includes("setting")) {
        categories.settings.push(permission);
      } else if (permission.includes("rank")) {
        categories.ranks.push(permission);
      } else if (permission.includes("fund-transaction")) {
        categories.fundTransactions.push(permission);
      } else if (permission.includes("transaction")) {
        categories.transactions.push(permission);
      } else {
        categories.others.push(permission);
      }
    });

    return categories;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "users":
      case "admins":
        return <Users className="w-4 h-4" />;
      case "roles":
        return <Shield className="w-4 h-4" />;
      case "settings":
        return <Settings className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  const formatPermissionName = (permission: string) => {
    return permission
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCategoryName = (category: string) => {
    return (
      category.charAt(0).toUpperCase() +
      category.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  if (!role) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Failed to load role information
          </p>
        </CardContent>
      </Card>
    );
  }

  const permissionsByCategory = getPermissionsByCategory(
    role.permissions || []
  );
  const categoriesWithPermissions = Object.entries(
    permissionsByCategory
  ).filter(([, permissions]) => permissions.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Role Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role Key
            </label>
            <div className="mt-1">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {role.key}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              System Role
            </label>
            <div className="mt-1">
              <Badge
                variant={role.system ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {role.system ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Total Permissions
            </label>
            <div className="mt-1">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {role.permissions?.length || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesWithPermissions.length === 0 ? (
            <p className="text-muted-foreground">No permissions assigned</p>
          ) : (
            <div className="space-y-6">
              {categoriesWithPermissions.map(([category, permissions]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryIcon(category)}
                    <h4 className="font-semibold text-sm">
                      {formatCategoryName(category)}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {permissions.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs px-2 py-1"
                      >
                        {formatPermissionName(permission)}
                      </Badge>
                    ))}
                  </div>
                  {category !==
                    categoriesWithPermissions[
                      categoriesWithPermissions.length - 1
                    ][0] && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolePermissionsPanel;
