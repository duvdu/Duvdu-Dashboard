export type ProjectsUploadedKPI = {
  count: number;
};

export type TopUser = {
  id: string;
  name: string;
  role: "client" | "service_provider";
  kpiValue: number;
};

export type ActiveUsersSplitKPI = {
  clients: number;
  serviceProviders: number;
};

export type LiveUsersOnlineKPI = {
  clients: number;
  serviceProviders: number;
};

export type NewUsersKPI = {
  count: number;
};

export type OpenDisputesComplaintsKPI = {
  disputes: number;
  complaints: number;
};

export type ContractsCountKPI = {
  closed: number;
  pending: number;
  cancelled: number;
};

export type DashboardKPIResponse = {
  projectsUploaded: ProjectsUploadedKPI;
  topUsers: TopUser[];
  activeUsersSplit: ActiveUsersSplitKPI;
  liveUsersOnline: LiveUsersOnlineKPI;
  newUsers: NewUsersKPI;
  openDisputesComplaints: OpenDisputesComplaintsKPI;
  contractsCount: ContractsCountKPI;
};
