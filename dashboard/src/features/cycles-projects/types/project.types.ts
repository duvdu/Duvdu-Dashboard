export type User = {
  _id: string;
  profileImage: string;
  isOnline: boolean;
  username: string;
  name: string;
  rank: {
    title: string;
    nextRankTitle: string;
    color: string;
    nextRankPercentage: number;
  };
  projectsView: number;
  coverImage: string;
  acceptedProjectsCounter: number;
  rate: {
    ratersCounter: number;
    totalRates: number;
  };
  profileViews: number;
  about: string | null;
  isAvaliableToInstantProjects: boolean;
  pricePerHour: number;
  hasVerificationBadge: boolean;
  likes: number;
  followCount: {
    followers: number;
    following: number;
  };
  address: string | null;
};

export type Category = {
  _id: string;
  title: string;
};

export type SubCategory = {
  _id?: string;
  title: string | null;
};

export type Tool = {
  _id: string;
  name: string;
  unitPrice: number;
};

export type Function = {
  _id: string;
  name: string;
  unitPrice: number;
};

export type Location = {
  type: string;
  coordinates: number[];
};

export type ProjectScale = {
  unit: string;
  minimum: number;
  maximum: number;
  current: number;
  pricerPerUnit: number;
};

export type Tag = {
  _id: string;
  title: string;
};

export type Project = {
  _id: string;
  user: User;
  category: Category;
  subCategory: SubCategory;
  name: string;
  description: string;
  tools: Tool[];
  functions: Function[];
  location: Location | Record<string, never>;
  address: string;
  searchKeyWords: string[];
  showOnHome: boolean;
  projectScale: ProjectScale;
  duration: number;
  createdAt: string;
  updatedAt: string;
  favouriteCount: number;
  tags: Tag[];
  cover: string;
  audioCover: string | null;
  attachments: string[];
  creatives: unknown[];
  // Additional fields for project status management
  status?: "pending" | "approved" | "rejected" | "paused" | "deleted";
  views?: number;
  bookings?: number;
};

export type ProjectsResponse = {
  message: string;
  pagination: {
    currentPage: number;
    resultCount: number;
    totalPages: number;
  };
  data: Project[];
};

export type ProjectFilters = {
  search?: string;
  keyword?: string;
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
