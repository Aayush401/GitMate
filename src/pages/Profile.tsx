import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Code2,
  Edit2,
  ExternalLink,
  GitBranch,
  MapPin,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface User {
  id: string;
  name: string;
  email?: string;
  image: string | null;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  id: string;
  bio: string | null;
  experience: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  skills: string;
  goals: string;
  availability: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GithubProject {
  id: string;
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  language: string | null;
}

const API_URL = import.meta.env.VITE_BASE_API_URL;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const parseItems = (
  value: string | null | undefined,
) => {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatExperience = (
  experience: string,
) =>
  experience.charAt(0) +
  experience.slice(1).toLowerCase();

const formatJoinedDate = (
  date: string,
) =>
  new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

const Profile = () => {
  const navigate = useNavigate();

  const { userId } = useParams<{
    userId: string;
  }>();

  /*
   * ==============================
   * PROFILE
   * ==============================
   */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "profile",
      userId ?? "me",
    ],

    queryFn: async () => {
      const endpoint = userId
        ? `/profile/${userId}`
        : "/profile";

      const response =
        await api.get(endpoint);

      return response.data;
    },
  });

  /*
   * ==============================
   * GITHUB
   * ==============================
   */

  const {
    data: githubData,
    isLoading: githubLoading,
  } = useQuery({
    queryKey: [
      "github-projects",
      userId ?? "me",
    ],

    queryFn: async () => {
      const endpoint = userId
        ? `/projects/github/${userId}`
        : "/projects/github";

      const response =
        await api.get(endpoint);

      return response.data;
    },
  });

  const user = data?.user;
  const profile = data?.profile;

  const githubProjects =
    githubData?.projects ?? [];

  const skills = useMemo(
    () =>
      parseItems(
        profile?.skills,
      ),
    [profile?.skills],
  );

  const goals = useMemo(
    () =>
      parseItems(
        profile?.goals,
      ),
    [profile?.goals],
  );

  const totalStars =
    githubProjects.reduce(
      (
        total: number,
        project: GithubProject,
      ) =>
        total + project.stars,
      0,
    );

  /*
   * Only relevant to the current user's profile.
   *
   * Another user's profile shouldn't show
   * the Sync GitHub button.
   */

  const isViewingOtherUser =
    Boolean(userId);

  const isGithubUser =
    user?.provider?.toUpperCase() ===
    "GITHUB";

  const isGithubSynced =
    githubData?.synced === true;

  const handleGithubSync = () => {
    window.location.href =
      `${API_URL}/auth/github`;
  };

  /*
   * ==============================
   * LOADING
   * ==============================
   */

  if (isLoading) {
    return (
      <AppLayout>
        <div className="w-full max-w-6xl mx-auto">
          {/* Profile Header Skeleton */}

          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <div className="h-32 bg-muted animate-pulse" />

            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
                <div className="w-32 h-32 rounded-full bg-muted border-4 border-card animate-pulse" />

                <div className="flex-1 space-y-3">
                  <div className="h-7 w-48 rounded bg-muted animate-pulse" />

                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                </div>
              </div>

              <div className="h-4 max-w-2xl mt-6 rounded bg-muted animate-pulse" />

              <div className="h-4 w-72 mt-3 rounded bg-muted animate-pulse" />
            </div>
          </div>

          {/* GitHub Stats Skeleton */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-xl p-4 text-center"
              >
                <div className="w-5 h-5 mx-auto mb-3 rounded bg-muted animate-pulse" />

                <div className="h-8 w-12 mx-auto rounded-md bg-muted animate-pulse" />

                <div className="h-3 w-20 mx-auto mt-2 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>

          {/* Main Content Skeleton */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left */}

            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="h-5 w-28 rounded bg-muted animate-pulse mb-6" />

                <div className="h-4 w-full rounded bg-muted animate-pulse mb-3" />

                <div className="h-2 w-full rounded bg-muted animate-pulse" />

                <div className="h-3 w-20 rounded bg-muted animate-pulse mt-6" />

                <div className="h-4 w-40 rounded bg-muted animate-pulse mt-2" />
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="h-5 w-20 rounded bg-muted animate-pulse mb-5" />

                <div className="flex flex-wrap gap-2">
                  {Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-7 w-16 rounded-full bg-muted animate-pulse"
                    />
                  ))}
                </div>

                <div className="h-5 w-16 rounded bg-muted animate-pulse mt-7 mb-4" />

                <div className="flex flex-wrap gap-2">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-7 w-20 rounded-full bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-5 w-40 rounded bg-muted animate-pulse" />

                  <div className="h-6 w-8 rounded-full bg-muted animate-pulse" />
                </div>

                <div className="space-y-3">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-lg bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="h-5 w-48 rounded bg-muted animate-pulse mb-6" />

                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 rounded-xl bg-muted animate-pulse mb-4" />

                  <div className="h-4 w-40 rounded bg-muted animate-pulse" />

                  <div className="h-3 w-52 rounded bg-muted animate-pulse mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ==============================
   * PROFILE ERROR
   * ==============================
   */

  if (
    isError ||
    !data?.success ||
    !user ||
    !profile
  ) {
    return (
      <AppLayout>
        <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Unable to load profile
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              We could not retrieve this
              profile information.
            </p>

            <Button
              className="mt-6"
              onClick={() =>
                navigate("/discover")
              }
            >
              Back to Discover
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ==============================
   * PAGE
   * ==============================
   */

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto">
        {/* ============================== */}
        {/* PROFILE HEADER */}
        {/* ============================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5" />

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
              {/* Avatar */}

              <Avatar className="w-32 h-32 border-4 border-card shadow-lg">
                <AvatarImage
                  src={
                    user.image ??
                    undefined
                  }
                  alt={user.name}
                />

                <AvatarFallback className="text-3xl">
                  {getInitials(
                    user.name,
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Name */}

                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {user.name}
                    </h1>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>
                        {formatExperience(
                          profile.experience,
                        )}{" "}
                        Developer
                      </span>

                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex gap-2">
                    {/* Sync GitHub ONLY on own profile */}

                    {!isViewingOtherUser &&
                      !isGithubUser && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={
                            handleGithubSync
                          }
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />

                          Sync GitHub
                        </Button>
                      )}

                    {/* Edit ONLY on own profile */}

                    {/* {!isViewingOtherUser && (
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() =>
                          navigate(
                            "/profile/edit",
                          )
                        }
                      >
                        <Edit2 className="w-4 h-4 mr-2" />

                        Edit
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}

            <p className="mt-4 text-muted-foreground max-w-2xl">
              {profile.bio ||
                "No biography has been added yet."}
            </p>

            {/* Meta */}

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />

                {profile.timezone}
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />

                Joined{" "}
                {formatJoinedDate(
                  user.createdAt,
                )}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ============================== */}
        {/* GITHUB STATS */}
        {/* ============================== */}

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
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
        >
          {/* Repositories */}

          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <GitBranch className="w-5 h-5 text-primary mx-auto mb-2" />

            {githubLoading ? (
              <>
                <div className="h-8 w-12 mx-auto rounded-md bg-muted animate-pulse" />

                <div className="h-3 w-20 mx-auto mt-2 rounded bg-muted animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {!isGithubSynced
                    ? "—"
                    : githubProjects.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Repositories
                </p>
              </>
            )}
          </div>

          {/* Commits */}

          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Code2 className="w-5 h-5 text-success mx-auto mb-2" />

            {githubLoading ? (
              <>
                <div className="h-8 w-12 mx-auto rounded-md bg-muted animate-pulse" />

                <div className="h-3 w-14 mx-auto mt-2 rounded bg-muted animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {!isGithubSynced
                    ? "—"
                    : githubData?.stats
                        ?.commits ?? 0}
                </p>

                <p className="text-xs text-muted-foreground">
                  Commits
                </p>
              </>
            )}
          </div>

          {/* Stars */}

          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Star className="w-5 h-5 text-warning mx-auto mb-2" />

            {githubLoading ? (
              <>
                <div className="h-8 w-12 mx-auto rounded-md bg-muted animate-pulse" />

                <div className="h-3 w-10 mx-auto mt-2 rounded bg-muted animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {!isGithubSynced
                    ? "—"
                    : totalStars}
                </p>

                <p className="text-xs text-muted-foreground">
                  Stars
                </p>
              </>
            )}
          </div>

          {/* Contributions */}

          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <GitBranch className="w-5 h-5 text-info mx-auto mb-2" />

            {githubLoading ? (
              <>
                <div className="h-8 w-12 mx-auto rounded-md bg-muted animate-pulse" />

                <div className="h-3 w-24 mx-auto mt-2 rounded bg-muted animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {!isGithubSynced
                    ? "—"
                    : githubData?.stats
                        ?.contributions ??
                      0}
                </p>

                <p className="text-xs text-muted-foreground">
                  Contributions
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* ============================== */}
        {/* MAIN CONTENT */}
        {/* ============================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* ============================== */}
          {/* LEFT COLUMN */}
          {/* ============================== */}

          <div className="space-y-6">
            {/* Experience */}

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
                delay: 0.2,
              }}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                Experience
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground">
                      Developer Level
                    </span>

                    <span className="text-muted-foreground font-mono">
                      {formatExperience(
                        profile.experience,
                      )}
                    </span>
                  </div>

                  <Progress
                    value={
                      profile.experience ===
                      "BEGINNER"
                        ? 33
                        : profile.experience ===
                            "INTERMEDIATE"
                          ? 66
                          : 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Availability
                  </p>

                  <p className="text-sm text-foreground mt-1">
                    {
                      profile.availability
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Skills & Goals */}

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
                delay: 0.3,
              }}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                Skills
              </h3>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map(
                    (skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30"
                      >
                        {skill}
                      </Badge>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills added yet.
                </p>
              )}

              <h3 className="font-semibold text-foreground mb-3 mt-6">
                Goals
              </h3>

              {goals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {goals.map(
                    (goal) => (
                      <Badge
                        key={goal}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {goal}
                      </Badge>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No goals added yet.
                </p>
              )}
            </motion.div>
          </div>

          {/* ============================== */}
          {/* RIGHT COLUMN */}
          {/* ============================== */}

          <div className="lg:col-span-2 space-y-6">
            {/* GitHub Repositories */}

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
                delay: 0.2,
              }}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  GitHub Repositories
                </h3>

                {isGithubSynced &&
                  !githubLoading &&
                  githubProjects.length >
                    0 && (
                    <Badge variant="outline">
                      {
                        githubProjects.length
                      }
                    </Badge>
                  )}
              </div>

              {/* Loading */}

              {githubLoading ? (
                <div className="space-y-3">
                  {Array.from({
                    length: 4,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="h-24 rounded-lg bg-muted animate-pulse"
                      />
                    ),
                  )}
                </div>
              ) : !isGithubSynced ? (
                /* Not synced */

                <div className="py-12 text-center">
                  <GitBranch className="w-10 h-10 text-muted-foreground mx-auto mb-4" />

                  <p className="text-sm font-medium text-foreground">
                    Not synced with GitHub
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {isViewingOtherUser
                      ? "This user has not connected their GitHub account."
                      : "Connect your GitHub account to see your repositories, commits, stars, and contributions."}
                  </p>

                  {/* Sync button only for own profile */}

                  {!isViewingOtherUser &&
                    !isGithubUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={
                          handleGithubSync
                        }
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />

                        Sync GitHub
                      </Button>
                    )}
                </div>
              ) : githubProjects.length >
                0 ? (
                /* Projects */

                <div className="space-y-3">
                  {githubProjects.map(
                    (
                      project: GithubProject,
                    ) => (
                      <div
                        key={
                          project.id
                        }
                        className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {
                                project.name
                              }
                            </h4>

                            {project.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {
                                  project.description
                                }
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-3">
                              {project.language && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {
                                    project.language
                                  }
                                </Badge>
                              )}

                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="w-3 h-3" />

                                {
                                  project.stars
                                }
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a
                              href={
                                project.htmlUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${project.name} on GitHub`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                /* Empty */

                <div className="py-10 text-center">
                  <GitBranch className="w-8 h-8 text-muted-foreground mx-auto mb-3" />

                  <p className="text-sm font-medium text-foreground">
                    No GitHub projects found
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    No GitHub repositories are available.
                  </p>
                </div>
              )}
            </motion.div>

            {/* ============================== */}
            {/* CURRENT COLLABORATIONS */}
            {/* ============================== */}

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
                delay: 0.3,
              }}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                Current Collaborations
              </h3>

              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>

                <p className="text-sm font-medium text-foreground">
                  No active collaborations
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  Active projects will
                  appear here.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
