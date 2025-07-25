import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import React from "react";

interface TableCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const TableCard: React.FC<TableCardProps> = ({
  title,
  children,
  description,
  actions,
  footer,
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
      <CardContent className="flex-1 flex flex-col px-4 pb-2 pt-0">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="pt-0 pb-2 px-4 justify-end">{footer}</CardFooter>
      )}
    </Card>
  );
};
