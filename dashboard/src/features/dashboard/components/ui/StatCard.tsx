import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  trend?: "up" | "down";
  trendValue?: string | number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  badge,
  description,
  trend,
  trendValue,
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between bg-background/80 border border-border rounded-xl shadow-sm h-fit min-h-[120px]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 px-4 pt-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary/80">{icon}</span>}
          <CardTitle className="text-base font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        {badge && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {badge}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex items-end justify-between px-4 pb-4 pt-0">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {trendValue}
          </span>
        )}
      </CardContent>
      {description && (
        <CardDescription className="px-4 pb-2 pt-0 text-xs">
          {description}
        </CardDescription>
      )}
    </Card>
  );
};
