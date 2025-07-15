export type User = {
  _id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  username: string;
  email: string;
  phoneNumber: {
    number: string;
  };
  type: string;
  status: string;
  createdAt?: string;
  isBlocked: {
    value: boolean;
  };
  role: string;
  isOnline: boolean;
  isAvaliableToInstantProjects: boolean;
  pricePerHour: number;
  isVerified: boolean;
  isDeleted: boolean;
  isFollow: boolean;
  followCount: {
    followers: number;
    following: number;
  };
  address: {
    type: string;
    coordinates: number[];
  };
  categories: string[];
  acceptedProjectsCounter: number;
  profileViews: number;
  about: string;
  rate: {
    ratersCounter: number;
    totalRates: number;
  };
};
