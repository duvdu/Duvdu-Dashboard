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
    "unblock-user",
  ],
  admins: [
    "list-users",
    "create-user",
    "update-user",
    "block-user",
    "unblock-user",
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

  // bookmarks: ["list-bookmarks"],
  // ticket: [
  //   "create-ticket",
  //   "get-ticket",
  //   "list-tickets",
  //   "delete-ticket",
  //   "update-ticket",
  // ],
  // terms: ["create-term", "update-term"],
  // plans: ["create-plan", "list-plans", "delete-plan", "update-plan"],
  // portfolioPost: [
  //   "create-portfolio-project",
  //   "update-portfolio-project",
  //   "delete-portfolio-project",
  //   "list-portfolio-projects",
  //   "get-analysis-handler",
  // ],
  // copyrights: [
  //   "create-copyright-project",
  //   "update-copyright-project",
  //   "delete-copyright-project",
  //   "list-copyright-projects",
  //   "get-copyright-analysis-handler",
  // ],
  // studioBooking: [
  //   "create-studio-project",
  //   "update-studio-project",
  //   "delete-studio-project",
  //   "list-studio-projects",
  //   "get-studio-analysis-handler",
  // ],
  // booking: ["booking"],
};

export type PermissionGroup = keyof typeof PERMISSIONS;
export type Permission = string;
