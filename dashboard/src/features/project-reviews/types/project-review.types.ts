export type ProjectReview = {
  _id?: string;
  title: { ar: string; en: string };
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    rate?: {
      ratersCounter: number;
      totalRates: number;
    };
    rank?: {
      title: string;
      nextRankPercentage: number;
      nextRankTitle: string;
      color: string;
    };
    _id: string;
    name: string;
    username: string;
    profileImage: string;
    acceptedProjectsCounter: number;
    isOnline: boolean;
    projectsView: number;
  };
  project?: string;
  cycle?: string;
  rate?: number;
  comment?: string;
  __v?: number;
};
