import React from "react";
import { TableCard } from "./ui/TableCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

// Types for each user metric
interface TopUsers {
  byProjects: Array<{
    _id: string;
    name: string;
    username: string;
    acceptedProjectsCounter: number;
    rank: { title: string; nextRankTitle: string; color: string };
    profileImage: string;
  }>;
  byRating: Array<{
    _id: string;
    name: string;
    username: string;
    averageRating: number;
    totalRaters: number;
    rank: { title: string; nextRankTitle: string; color: string };
    profileImage: string;
  }>;
  byLikes: Array<{
    _id: string;
    name: string;
    username: string;
    likes: number;
    rank: { title: string; nextRankTitle: string; color: string };
    profileImage: string;
  }>;
  byFollowers: Array<{
    _id: string;
    name: string;
    username: string;
    followers: number;
    rank: { title: string; nextRankTitle: string; color: string };
    profileImage: string;
  }>;
  byContracts: Array<{
    _id: string;
    name: string;
    username: string;
    contractsCount: number;
    rank: { title: string; nextRankTitle: string; color: string };
    profileImage: string;
  }>;
}

export const TopUsersSection: React.FC<{
  topUsers: TopUsers;
  className?: string;
}> = ({ topUsers, className }) => {
  const rankColorMap: Record<string, string> = {
    Gold: "var(--chart-1)",
    Silver: "var(--chart-2)",
    Bronze: "var(--chart-3)",
    // Add more mappings as needed
  };

  return (
    <section className={cn("mb-10", className)}>
      <TableCard
        title="Top Users"
        description="Explore the top users by different metrics: projects, rating, likes, followers, and contracts."
        footer={
          <Button asChild>
            <Link to="/dashboard/users">See All</Link>
          </Button>
        }
      >
        <Tabs defaultValue="byProjects" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="byProjects">By Projects</TabsTrigger>
            <TabsTrigger value="byRating">By Rating</TabsTrigger>
            <TabsTrigger value="byLikes">By Likes</TabsTrigger>
            <TabsTrigger value="byFollowers">By Followers</TabsTrigger>
            <TabsTrigger value="byContracts">By Contracts</TabsTrigger>
          </TabsList>
          <TabsContent value="byProjects">
            <UserTable
              users={topUsers.byProjects}
              columns={[
                "Profile",
                "Name",
                "Username",
                "Rank",
                "Accepted Projects",
              ]}
              getRow={(u) => [
                <Avatar>
                  <AvatarImage src={u.profileImage} alt={u.name} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>,
                u.name,
                u.username,
                <span
                  style={{
                    color: rankColorMap[u.rank.title] || "var(--primary)",
                  }}
                >
                  {u.rank.title}
                </span>,
                u.acceptedProjectsCounter,
              ]}
            />
          </TabsContent>
          <TabsContent value="byRating">
            <UserTable
              users={topUsers.byRating}
              columns={[
                "Profile",
                "Name",
                "Username",
                "Rank",
                "Avg. Rating",
                "Raters",
              ]}
              getRow={(u) => [
                <Avatar>
                  <AvatarImage src={u.profileImage} alt={u.name} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>,
                u.name,
                u.username,
                <span
                  style={{
                    color: rankColorMap[u.rank.title] || "var(--primary)",
                  }}
                >
                  {u.rank.title}
                </span>,
                u.averageRating?.toFixed(2),
                u.totalRaters,
              ]}
            />
          </TabsContent>
          <TabsContent value="byLikes">
            <UserTable
              users={topUsers.byLikes}
              columns={["Profile", "Name", "Username", "Rank", "Likes"]}
              getRow={(u) => [
                <Avatar>
                  <AvatarImage src={u.profileImage} alt={u.name} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>,
                u.name,
                u.username,
                <span
                  style={{
                    color: rankColorMap[u.rank.title] || "var(--primary)",
                  }}
                >
                  {u.rank.title}
                </span>,
                u.likes,
              ]}
            />
          </TabsContent>
          <TabsContent value="byFollowers">
            <UserTable
              users={topUsers.byFollowers}
              columns={["Profile", "Name", "Username", "Rank", "Followers"]}
              getRow={(u) => [
                <Avatar>
                  <AvatarImage src={u.profileImage} alt={u.name} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>,
                u.name,
                u.username,
                <span
                  style={{
                    color: rankColorMap[u.rank.title] || "var(--primary)",
                  }}
                >
                  {u.rank.title}
                </span>,
                u.followers,
              ]}
            />
          </TabsContent>
          <TabsContent value="byContracts">
            <UserTable
              users={topUsers.byContracts}
              columns={["Profile", "Name", "Username", "Rank", "Contracts"]}
              getRow={(u) => [
                <Avatar>
                  <AvatarImage src={u.profileImage} alt={u.name} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>,
                u.name,
                u.username,
                <span
                  style={{
                    color: rankColorMap[u.rank.title] || "var(--primary)",
                  }}
                >
                  {u.rank.title}
                </span>,
                u.contractsCount,
              ]}
            />
          </TabsContent>
        </Tabs>
      </TableCard>
    </section>
  );
};

// Generic table for user lists
function UserTable<T extends { _id: string }>(props: {
  users: T[];
  columns: string[];
  getRow: (user: T) => React.ReactNode[];
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {props.columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {props.users.map((user) => (
            <TableRow key={user._id}>
              {props.getRow(user).map((cell, idx) => (
                <TableCell key={idx}>{cell}</TableCell>
              ))}
              <TableCell>
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/users/${user._id}`}>
                    View
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
