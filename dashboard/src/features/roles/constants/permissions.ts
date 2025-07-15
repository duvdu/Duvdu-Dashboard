export const PERMISSIONS = {
  category: [
    "create-category",
    "update-category",
    "remove-category",
    "list-categories",
  ],
  users: [
    "list-users",
    "create-user",
    "update-user",
    "block-user",
    "un-block-user",
    "send-notification-to-users",
    "remove-user",
  ],

  roles: [
    "list-roles",
    "create-role",
    "update-role",
    "remove-role",
    "get-all-permissions",
  ],
  messages: ["list-messages-from-to"],
  projects: [
    "list-projects",
    "update-project",
    "remove-project",
    "get-project-analysis",
  ],
  withdraw: ["list-withdraw-methods", "update-withdraw-method"],
};

export type PermissionGroup = keyof typeof PERMISSIONS;
export type Permission = string;
