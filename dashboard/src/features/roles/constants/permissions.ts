export const PERMISSIONS = {
  auth: [
    "resetPassword",
    "updatePhoneNumber",
    "changePassword",
    "updateProfile",
  ],
  bookmarks: ["bookmarks"],
  category: [
    "create-category",
    "update-category",
    "remove-category",
    "get-gategories-admin",
  ],
  ticket: [
    "create ticket",
    "get-ticket",
    "get-all-tickets",
    "remove-ticket",
    "update-ticket",
  ],
  terms: ["create-term", "update-term"],
  plans: [
    "get plan",
    "create plan",
    "get all plans",
    "remove plan",
    "update plan",
  ],
  roles: ["get role", "get roles", "create role", "update role", "remove role"],
  portfolioPost: [
    "create portfolio project",
    "update portfolio project",
    "remove portfolio project",
    "get crm portfolio projects",
    "get analysis handler",
  ],
  copyrights: [
    "create copyright project",
    "update copyright project",
    "remove copyright project",
    "get crm copyright projects",
    "get copyright analysis handler",
  ],
  studioBooking: [
    "create studio project",
    "update studio project",
    "remove studio project",
    "get crm studio projects",
    "get studio analysis handler",
  ],
  booking: ["booking"],
};

export type PermissionGroup = keyof typeof PERMISSIONS;
export type Permission = string;
