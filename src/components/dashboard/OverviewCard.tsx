
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

const OverviewCard = ({ title, value, icon, description, className }: OverviewCardProps) => {
  return (
    <Card className={cn("card-hover border-app-gold-500/20 shadow-lg shadow-app-gold-500/5", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium gold-gradient-text">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-app-gold-500/10 flex items-center justify-center text-app-gold-500">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
