export type Settings = {
  _id?: string;
  createdAt?: string;
  expirationTime: {
    time: number;
    _id: string;
  }[];
  default_profile: string;
  default_cover: string;
  contractSubscriptionPercentage: number;
};
