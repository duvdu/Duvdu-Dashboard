import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import React from "react";

interface ChartCardProps {
  title: string;
  value?: string | number;
  children: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  legend?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  children,
  description,
  actions,
  legend,
  className,
}) => {
  return (
    <Card
      className={
        "bg-background/80 border border-border rounded-xl shadow-sm flex flex-col min-h-[320px] " +
        (className || "")
      }
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 px-4 pt-4">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center px-4 pb-2 pt-0">
        {value && <div className="text-2xl font-bold mb-2">{value}</div>}
        <div className="w-full flex-1 flex items-center justify-center">
          {children}
        </div>
      </CardContent>
      {legend && <CardFooter className="pt-0 pb-2 px-4">{legend}</CardFooter>}
    </Card>
  );
};
