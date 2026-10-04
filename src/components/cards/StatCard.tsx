import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading = false,
  className,
}: StatCardProps) => {
  return (
    <motion.div
      className={cn("stat-card group cursor-default", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isLoading ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-4 w-24" />

            {/* Value + trend skeleton */}
            <div className="flex items-end gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>

            {/* Subtitle skeleton */}
            <Skeleton className="h-3 w-32" />
          </div>

          {/* Icon skeleton */}
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">
                {value}
              </span>

              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {trend.positive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>

            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
};