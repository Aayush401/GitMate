import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import api from "@/lib/axios";

interface MatchProfile {
  id: string;
  bio: string | null;
  experience: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  skills: string;
  goals: string;
  availability: string;
  timezone: string;
}

interface MatchedUser {
  id: string;
  name: string;
  image: string | null;
  profile: MatchProfile | null;
}

interface Match {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: MatchedUser;
}

interface MatchesResponse {
  success: boolean;
  count: number;
  data: Match[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatMatchedDate = (date: string) => {
  const matchDate = new Date(date);
  const now = new Date();

  const differenceInMilliseconds =
    now.getTime() - matchDate.getTime();

  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60),
  );

  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60),
  );

  const differenceInDays = Math.floor(
    differenceInMilliseconds /
      (1000 * 60 * 60 * 24),
  );

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m ago`;
  }

  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  if (differenceInDays < 14) {
    return "1 week ago";
  }

  return matchDate.toLocaleDateString();
};

const getSkills = (
  skills: string | null | undefined,
) => {
  if (!skills) {
    return [];
  }

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 4);
};

const Matches = () => {
  const [search, setSearch] = useState("");

  // GET /matches
  // Backend gets the logged-in user's ID from JWT.
  const {
    data: matchesData,
    isLoading,
    isError,
  } = useQuery<MatchesResponse>({
    queryKey: ["matches"],
    queryFn: async () => {
      const response = await api.get<MatchesResponse>(
        "/matches",
      );

      console.log("MATCHES RESPONSE:", response.data);

      return response.data;
    },
  });

  const matches = matchesData?.data ?? [];

  const filteredMatches = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return matches;
    }

    return matches.filter((match) => {
      const matchedUser = match.user;

      const searchableText = [
        matchedUser.name,
        matchedUser.profile?.bio,
        matchedUser.profile?.skills,
        matchedUser.profile?.goals,
        matchedUser.profile?.experience,
        matchedUser.profile?.timezone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchValue);
    });
  }, [matches, search]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Your Matches
            </h1>

            <p className="text-muted-foreground mt-1">
              {isLoading
                ? "Loading your matches..."
                : `${matches.length} ${
                    matches.length === 1
                      ? "developer"
                      : "developers"
                  } want to collaborate with you`}
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search matches..."
              className="pl-9 bg-card border-border/50"
            />
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="bg-card border border-border/50 rounded-2xl p-6 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted" />

                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/2 rounded bg-muted" />
                      <div className="h-3 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />

                      <div className="flex gap-2">
                        <div className="h-6 w-20 rounded bg-muted" />
                        <div className="h-6 w-20 rounded bg-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-border/50">
                    <div className="h-9 rounded bg-muted" />
                    <div className="h-9 rounded bg-muted" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
            <h2 className="font-semibold text-foreground">
              Unable to load matches
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Something went wrong while fetching your
              matches. Please try again.
            </p>
          </div>
        )}

        {/* No matches */}
        {!isLoading &&
          !isError &&
          matches.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-card border border-border/50 rounded-2xl p-10 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>

              <h2 className="text-lg font-semibold text-foreground mt-5">
                No matches yet
              </h2>

              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                Explore recommended developers and
                create your first collaboration match.
              </p>

              <Button
                className="mt-6"
                asChild
              >
                <Link to="/discover">
                  Discover Developers
                </Link>
              </Button>
            </motion.div>
          )}

        {/* Search returned nothing */}
        {!isLoading &&
          !isError &&
          matches.length > 0 &&
          filteredMatches.length === 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-10 text-center">
              <h2 className="font-semibold text-foreground">
                No matches found
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                No developers match “{search}”.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </div>
          )}

        {/* Matches */}
        {!isLoading &&
          !isError &&
          filteredMatches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map(
                (match, index) => {
                  const profile =
                    match.user.profile;

                  const skills = getSkills(
                    profile?.skills,
                  );

                  return (
                    <motion.div
                      key={match.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.1 * (index + 1),
                      }}
                      className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">

                        {/* Avatar */}
                        <Avatar className="w-16 h-16 border-2 border-border">
                          <AvatarImage
                            src={
                              match.user.image ??
                              undefined
                            }
                            alt={match.user.name}
                          />

                          <AvatarFallback>
                            {getInitials(
                              match.user.name,
                            )}
                          </AvatarFallback>
                        </Avatar>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {match.user.name}
                              </h3>

                              <p className="text-sm text-muted-foreground">
                                {profile?.experience ??
                                  "Developer"}
                              </p>
                            </div>

                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatMatchedDate(
                                match.createdAt,
                              )}
                            </span>
                          </div>

                          {profile?.bio && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {profile.bio}
                            </p>
                          )}

                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {skills.map(
                                (skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs font-mono"
                                  >
                                    {skill}
                                  </Badge>
                                ),
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4">
                            {profile?.goals && (
                              <span className="text-xs text-muted-foreground">
                                <span className="text-primary">
                                  Goal:
                                </span>{" "}
                                {profile.goals}
                              </span>
                            )}

                            {profile?.availability && (
                              <span className="text-xs text-muted-foreground">
                                {profile.availability}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link
                            to={`/profile/${match.user.id}`}
                          >
                            View Profile
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link
                            to={`/chat/${match.user.id}`}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  );
                },
              )}
            </div>
          )}
      </div>
    </AppLayout>
  );
};

export default Matches;