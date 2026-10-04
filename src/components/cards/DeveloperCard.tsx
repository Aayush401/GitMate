import { motion } from "framer-motion";
import {
  Clock,
  Globe,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Developer {
  userId: string;
  name: string;
  image: string;
  bio?: string;
  similarity: string;
  timezone: string;
  experience: string;
  goals: string;
  availability: string;
}

interface DeveloperCardProps {
  developer?: Developer;
  isLoading?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
}

const experienceColor: Record<string, string> = {
  BEGINNER: "bg-green-500/15 text-green-400 border-green-500/30",
  INTERMEDIATE: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ADVANCED: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  EXPERT: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export function DeveloperCard({
  developer,
  isLoading,
  error,
  className,
  style,
}: DeveloperCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-3xl border bg-card shadow-xl",
          className
        )}
        style={style}
      >
        {/* Banner */}
        <Skeleton className="h-24 w-full rounded-none" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          </div>

          {/* Name */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          {/* Bio */}
          <div className="mt-6 space-y-2">
            <Skeleton className="mx-auto h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-5/6" />
            <Skeleton className="mx-auto h-4 w-3/4" />
          </div>

          {/* Info Rows */}
          <div className="mt-8 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between"
              >
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex h-[500px] w-full max-w-sm flex-col items-center justify-center rounded-3xl border bg-card p-8 text-center shadow-xl",
          className
        )}
        style={style}
      >
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />

        <h2 className="text-lg font-semibold">
          Unable to load profile
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  if (!developer) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, duration: 500 }}
      style={style}
      className={cn(
        "w-[400px] max-md:w-full overflow-hidden rounded-3xl border bg-card shadow-xl",
        className
      )}
    >
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-primary via-primary/70 to-primary/20" />

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="-mt-12 flex justify-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={developer.image}
              alt={developer.name}
            />
            <AvatarFallback>
              {developer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">
            {developer.name}
          </h2>

          <Badge className="mt-3 bg-primary text-primary-foreground">
          {(parseFloat(developer.similarity) * 100).toFixed(2)}% Similarity          </Badge>
        </div>

        {/* Bio */}
        {developer.bio && (
          <p className="mt-5 text-center text-sm leading-6 text-muted-foreground">
            {developer.bio}
          </p>
        )}

        {/* Details */}
        <div className="mt-8 space-y-4 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between max-sm:text-sm gap-4">
            <div className="flex items-center gap-2 font-medium">
              <TrendingUp size={16} />
              Experience
            </div>

            <Badge
              variant="outline"
              className={
                experienceColor[developer.experience] ??
                "border-muted bg-muted text-muted-foreground max-sm:text-xs p-0"
              }
            >
              {developer.experience}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium max-sm:text-sm">
              <Clock size={16} />
              Availability
            </div>

            <span className="text-sm text-muted-foreground max-sm:text-sm">
              {developer.availability}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium max-sm:text-sm">
              <Globe size={16} />
              Timezone
            </div>

            <span className="text-sm capitalize text-muted-foreground max-sm:text-sm">
              {developer.timezone.replace("/", " / ")}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 max-sm:text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Target size={16} />
              Goal
            </div>

            <span className="max-w-[160px] text-right text-sm text-muted-foreground">
              {developer.goals}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}