import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  valueClassName?: string;
}

export function StatCard({ title, value, icon, trend, valueClassName }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 tracking-tight">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn("text-3xl font-bold tracking-tight text-gray-900", valueClassName)}>
          {value}
        </span>
      </div>
      {trend && (
        <div className="mt-1 flex items-center gap-1 text-sm">
          <span
            className={cn(
              "font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.value}
          </span>
          <span className="text-gray-500">from last hour</span>
        </div>
      )}
    </div>
  );
}
