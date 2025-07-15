import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Briefcase,
  FileText,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import type { DashboardKPIResponse, TopUser } from "../types/kpi.types";

interface KPIGroupProps {
  data: DashboardKPIResponse;
}

export const KPIGroup: React.FC<KPIGroupProps> = ({ data }) => {
  const [userTab, setUserTab] = useState<"client" | "service_provider">(
    "client"
  );
  const topUsers = data.topUsers.filter((u) => u.role === userTab);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Projects Uploaded */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} /> Projects Uploaded
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">
            {data.projectsUploaded.count}
          </span>
        </CardContent>
      </Card>
      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} /> Top Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={userTab}
            onValueChange={(v: "client" | "service_provider") => setUserTab(v)}
            className="mb-2"
          >
            <TabsList>
              <TabsTrigger value="client">Clients</TabsTrigger>
              <TabsTrigger value="service_provider">
                Service Providers
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ul className="space-y-1">
            {topUsers.length === 0 && (
              <li className="text-muted-foreground">No users</li>
            )}
            {topUsers.slice(0, 5).map((u: TopUser) => (
              <li key={u.id} className="flex justify-between">
                <span>{u.name}</span>
                <span className="font-mono">{u.kpiValue}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Active Users Split */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck size={20} /> Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>Clients</span>
            <span className="font-bold">{data.activeUsersSplit.clients}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Providers</span>
            <span className="font-bold">
              {data.activeUsersSplit.serviceProviders}
            </span>
          </div>
        </CardContent>
      </Card>
      {/* Live Users Online */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus size={20} /> Live Online
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>Clients</span>
            <span className="font-bold">{data.liveUsersOnline.clients}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Providers</span>
            <span className="font-bold">
              {data.liveUsersOnline.serviceProviders}
            </span>
          </div>
        </CardContent>
      </Card>
      {/* New Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus size={20} /> New Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{data.newUsers.count}</span>
        </CardContent>
      </Card>
      {/* Open Disputes & Complaints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} /> Disputes & Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>Disputes</span>
            <span className="font-bold">
              {data.openDisputesComplaints.disputes}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Complaints</span>
            <span className="font-bold">
              {data.openDisputesComplaints.complaints}
            </span>
          </div>
        </CardContent>
      </Card>
      {/* Contracts Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={20} /> Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>Closed</span>
            <span className="font-bold">{data.contractsCount.closed}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="font-bold">{data.contractsCount.pending}</span>
          </div>
          <div className="flex justify-between">
            <span>Cancelled</span>
            <span className="font-bold">{data.contractsCount.cancelled}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
