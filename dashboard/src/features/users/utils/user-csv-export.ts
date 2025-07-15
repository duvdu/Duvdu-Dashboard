import { getUsers } from "../api/users.api";
import { type User } from "../types/user.types";

export async function fetchUsersForCSV({
  search,
  page,
  limit,
  status,
  isBlocked,
  isAdmin,
  isDeleted,
}: {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  isBlocked?: boolean;
  isAdmin?: boolean;
  isDeleted?: boolean;
}): Promise<any[]> {
  try {
    const response = await getUsers({
      search: search || "",
      page: page || 1,
      limit: limit || 999999999999999,
      status: status || "",
      isBlocked: isBlocked || undefined,
      isAdmin: isAdmin || false,
      isDeleted: isDeleted || false,
    });

    const users = response.data || [];

    // Format users for CSV export
    return users.map((user: User) => ({
      ID: user._id,
      Name: user.name,
      Username: user.username,
      Email: user.email,
      "Phone Number": user.phoneNumber?.number || "",
      Status: user.status,
      "Is Blocked": user.isBlocked?.value ? "Yes" : "No",
      Role: user.role,
      "Is Online": user.isOnline ? "Yes" : "No",
      "Available for Instant Projects": user.isAvaliableToInstantProjects
        ? "Yes"
        : "No",
      "Price Per Hour": user.pricePerHour,
      "Is Verified": user.isVerified ? "Yes" : "No",
      "Is Deleted": user.isDeleted ? "Yes" : "No",
      "Is Follow": user.isFollow ? "Yes" : "No",
      "Followers Count": user.followCount?.followers || 0,
      "Following Count": user.followCount?.following || 0,
      "Address Type": user.address?.type || "",
      "Address Coordinates": user.address?.coordinates
        ? user.address.coordinates.join(", ")
        : "",
      Categories: user.categories?.join(", ") || "",
      "Accepted Projects": user.acceptedProjectsCounter || 0,
      "Profile Views": user.profileViews || 0,
      About: user.about || "",
      "Raters Count": user.rate?.ratersCounter || 0,
      "Total Rates": user.rate?.totalRates || 0,
      "Created At": user.createdAt || "",
    }));
  } catch (error) {
    console.error("Error fetching users for CSV export:", error);
    throw error;
  }
}
