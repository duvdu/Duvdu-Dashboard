import type { User } from "@/features/chat";
import type { Project } from "@/features/cycles-projects";

export type Rank = {
  title: string;
  nextRankPercentage: number;
  nextRankTitle: string;
  color: string;
};

export type ProjectReport = {
  _id?: string;
  state: {
    isClosed: boolean;
    closedBy: string | null;
    feedback: string | null;
  };
  sourceUser: User;
  user?: User;
  rank?: Rank;
  acceptedProjectsCounter: number;
  isOnline: boolean;
  projectsView: number;
  project?: { project?: Project; _id?: string };
  cycle?: string;
  rate?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type ProjectReportsResponse = {
  data: ProjectReport[];
  pagination: Pagination;
};
