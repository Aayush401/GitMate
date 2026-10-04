
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

import {
  X,
  Heart,
  Star,
  RotateCcw,
  Loader2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeveloperCard } from "@/components/cards/DeveloperCard";

import { useNavigate } from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/lib/axios";

type SwipeDirection = "left" | "right";

const Feed = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [direction, setDirection] =
    useState<SwipeDirection | null>(null);

  const [showMatch, setShowMatch] =
    useState(false);

  const [matchError, setMatchError] =
    useState<string | null>(null);

  /*
   * =========================
   * MOTION
   * =========================
   */

  const x = useMotionValue(0);

  const rotate = useTransform(
    x,
    [-200, 200],
    [-18, 18],
  );

  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.6, 1, 1, 1, 0.6],
  );

  /*
   * =========================
   * LOAD DEVELOPERS
   * =========================
   */

  const {
    data: developers = [],
    isLoading: developersLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["similar-profiles"],

    queryFn: async () => {
      const { data } =
        await api.get("/recommendations");

      return data;
    },
  });

  const currentDeveloper =
    developers[currentIndex];

  const nextDeveloper =
    developers[currentIndex + 1];

  /*
   * =========================
   * CREATE MATCH
   * =========================
   */

  const createMatchMutation =
    useMutation({
      mutationFn: async (
        developerId: string,
      ) => {
        const { data } =
          await api.post(
            "/matches",
            {
              userId: developerId,
            },
          );

        return data;
      },

      onSuccess: () => {
        setDirection("right");

        setTimeout(() => {
          setShowMatch(true);
        }, 300);
      },

      onError: (error: unknown) => {
        const axiosError =
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

        setMatchError(
          axiosError.response?.data
            ?.message ??
            "Unable to create the match. Please try again.",
        );
      },
    });

  /*
   * =========================
   * MOVE TO NEXT
   * =========================
   */

  const moveToNextDeveloper = () => {
    setCurrentIndex(
      (previous) => previous + 1,
    );

    setDirection(null);

    x.set(0);
  };

  /*
   * =========================
   * SWIPE LEFT
   * =========================
   */

  const handleSwipeLeft = () => {
    if (
      createMatchMutation.isPending ||
      !currentDeveloper
    ) {
      return;
    }

    setDirection("left");

    setTimeout(() => {
      moveToNextDeveloper();
    }, 300);
  };

  /*
   * =========================
   * SWIPE RIGHT
   * =========================
   */

  const handleSwipeRight = () => {
    if (
      createMatchMutation.isPending ||
      !currentDeveloper
    ) {
      return;
    }

    setMatchError(null);

    createMatchMutation.mutate(
      currentDeveloper.userId,
    );
  };
// const handleSwipeRight = () => {
//     console.log("CURRENT DEVELOPER:", currentDeveloper);
//     console.log("CURRENT DEVELOPER ID:", currentDeveloper?.id);
  
//     if (!currentDeveloper?.id) {
//       console.error("No developer ID available");
//       return;
//     }
  
//     createMatchMutation.mutate(currentDeveloper.id);
//   };

  /*
   * =========================
   * DRAG
   * =========================
   */

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: {
        x: number;
      };
    },
  ) => {
    if (
      createMatchMutation.isPending
    ) {
      return;
    }

    if (info.offset.x > 100) {
      handleSwipeRight();
    } else if (info.offset.x < -100) {
      handleSwipeLeft();
    }
  };

  /*
   * =========================
   * CLOSE MATCH
   * =========================
   */

  const handleCloseMatch = () => {
    setShowMatch(false);

    setTimeout(() => {
      moveToNextDeveloper();
    }, 200);
  };

  /*
   * =========================
   * START CHAT
   * =========================
   */

  const handleStartChat = () => {
    if (!currentDeveloper) {
      return;
    }

    navigate(
      `/chat/${currentDeveloper.id}`,
    );
  };

  /*
   * =========================
   * LOADING
   * =========================
   */

  if (developersLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Developers
            </h1>

            <p className="mt-3 text-muted-foreground max-md:text-sm">
              Finding your best collaborators...
            </p>
          </div>

          <div className="flex justify-center py-10">
            <DeveloperCard
              isLoading
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * ERROR
   * =========================
   */

  if (isError) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Developers
            </h1>
          </div>

          <div className="flex justify-center">
            <DeveloperCard
              error={
                error instanceof Error
                  ? error.message
                  : "Unable to load developers."
              }
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * NO SIMILAR PROFILES
   * =========================
   *
   * IMPORTANT:
   *
   * This is checked BEFORE
   * currentIndex >= developers.length.
   *
   * Therefore:
   *
   * developers = []
   *
   * means:
   *
   * "No similar profiles currently"
   *
   * instead of:
   *
   * "That's everyone!"
   */

  if (developers.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Developers
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground max-md:text-sm">
              Find developers whose goals,
              experience, and availability
              match yours.
            </p>
          </div>

          <div className="flex min-h-[500px] items-center justify-center">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-primary/10 p-6">
                <Heart
                  className="h-10 w-10 text-primary"
                  fill="currentColor"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No similar profiles currently
              </h2>

              <p className="mt-2 max-w-md text-muted-foreground">
                We couldn't find any developers
                who closely match your profile
                right now. Check back later as
                new developers join Gitmate.
              </p>

              <Button
                className="mt-6 p-6"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Discover Developers
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground max-md:text-sm">
            We found developers whose goals,
            experience, and availability
            closely match yours.
          </p>
        </div>

        {/* ========================= */}
        {/* SWIPE AREA */}
        {/* ========================= */}

        <div className="relative my-8 flex items-center justify-center">
          {/*
           * =========================
           * ALL DEVELOPERS SWIPED
           * =========================
           *
           * This can ONLY happen when:
           *
           * developers.length > 0
           *
           * and
           *
           * currentIndex >= developers.length
           *
           * Therefore this means:
           *
           * "The user actually went through
           * all available developers."
           */}

          {currentIndex >=
          developers.length ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex flex-col items-center space-y-5 text-center"
            >
              <div className="rounded-full bg-primary/10 p-6">
                <Heart
                  className="h-10 w-10 text-primary"
                  fill="currentColor"
                />
              </div>

              <h2 className="text-3xl font-bold">
                That's everyone!
              </h2>

              <p className="max-w-sm text-muted-foreground">
                We'll recommend more
                developers as new profiles
                become available.
              </p>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    navigate(
                      "/dashboard",
                    );
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>

                <Button
                  onClick={() => {
                    setCurrentIndex(0);
                    setDirection(null);
                    x.set(0);
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Again
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Next card */}

              {nextDeveloper && (
                <div className="absolute">
                  <DeveloperCard
                    developer={
                      nextDeveloper
                    }
                    className="scale-95 opacity-0 blur-[1px]"
                    isLoading={
                      developersLoading
                    }
                  />
                </div>
              )}

              {/* Current card */}

              <AnimatePresence mode="wait">
                {currentDeveloper && (
                  <motion.div
                    key={
                      currentDeveloper.id
                    }
                    drag={
                      createMatchMutation.isPending
                        ? false
                        : "x"
                    }
                    dragConstraints={{
                      left: 0,
                      right: 0,
                    }}
                    dragElastic={0.8}
                    onDragEnd={
                      handleDragEnd
                    }
                    style={{
                      x,
                      rotate,
                      opacity,
                    }}
                    animate={
                      direction ===
                      "left"
                        ? {
                            x: -500,
                            opacity: 0,
                            rotate: -25,
                          }
                        : direction ===
                          "right"
                        ? {
                            x: 500,
                            opacity: 0,
                            rotate: 25,
                          }
                        : {
                            x: 0,
                            opacity: 1,
                            rotate: 0,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 26,
                    }}
                    className={
                      createMatchMutation.isPending
                        ? "cursor-wait"
                        : "cursor-grab active:cursor-grabbing"
                    }
                  >
                    <DeveloperCard
                      developer={
                        currentDeveloper
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* ========================= */}
        {/* ACTION BUTTONS */}
        {/* ========================= */}

        {currentIndex <
          developers.length && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-4 flex justify-center gap-5"
          >
            {/* Reject */}

            <motion.div
              whileTap={{
                scale: 0.92,
              }}
            >
              <Button
                variant="outline"
                size="icon"
                disabled={
                  createMatchMutation.isPending
                }
                className="h-14 w-14 rounded-full border-destructive/40 bg-background shadow-lg hover:border-destructive hover:bg-destructive/10"
                onClick={
                  handleSwipeLeft
                }
              >
                <X className="h-7 w-7 text-destructive" />
              </Button>
            </motion.div>

            {/* Star */}

            <motion.div
              whileTap={{
                scale: 0.92,
              }}
            >
              <Button
                variant="outline"
                size="icon"
                disabled={
                  createMatchMutation.isPending
                }
                className="h-14 w-14 rounded-full border-yellow-500/40 bg-background shadow-lg hover:border-yellow-500 hover:bg-yellow-500/10"
              >
                <Star className="h-7 w-7 text-yellow-500" />
              </Button>
            </motion.div>

            {/* Like */}

            <motion.div
              whileTap={{
                scale: 0.92,
              }}
            >
              <Button
                variant="outline"
                size="icon"
                disabled={
                  createMatchMutation.isPending
                }
                className="h-14 w-14 rounded-full border-primary/40 bg-background shadow-lg hover:border-primary hover:bg-primary/10"
                onClick={
                  handleSwipeRight
                }
              >
                {createMatchMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <Heart
                    className="h-7 w-7 text-primary"
                    fill="currentColor"
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ========================= */}
        {/* MATCH CREATION LOADING */}
        {/* ========================= */}

        <AnimatePresence>
          {createMatchMutation.isPending && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="flex w-full max-w-sm flex-col items-center rounded-3xl border bg-card p-8 text-center shadow-2xl"
              >
                <div className="mb-5 rounded-full bg-primary/10 p-5">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>

                <h2 className="text-xl font-bold">
                  Creating your match...
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Connecting you with{" "}
                  {currentDeveloper?.name}.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================= */}
        {/* MATCH SUCCESS */}
        {/* ========================= */}

        <AnimatePresence>
          {showMatch &&
            currentDeveloper && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={{
                    scale: 0.9,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.9,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className="w-full max-w-md overflow-hidden rounded-3xl border bg-card shadow-2xl"
                >
                  <div className="bg-gradient-to-r from-primary via-primary/80 to-primary/30 p-6 text-center text-primary-foreground">
                    <motion.div
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                      }}
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur"
                    >
                      <Heart
                        className="h-8 w-8"
                        fill="currentColor"
                      />
                    </motion.div>

                    <h2 className="text-2xl font-bold">
                      You matched!
                    </h2>

                    <p className="mt-1 text-primary-foreground/80">
                      {(
                        parseFloat(
                          currentDeveloper.similarity,
                        ) * 100
                      ).toFixed(2)}
                      % compatibility
                    </p>
                  </div>

                  <div className="p-6 text-center">
                    <div className="mb-5 flex justify-center">
                      <div className="relative">
                        <img
                          src={
                            currentDeveloper.image
                          }
                          alt={
                            currentDeveloper.name
                          }
                          className="h-20 w-20 rounded-full border-4 border-background object-cover shadow-lg"
                        />

                        <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow">
                          <Heart
                            className="h-4 w-4"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold">
                      {
                        currentDeveloper.name
                      }
                    </h3>

                    {currentDeveloper.bio && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {
                          currentDeveloper.bio
                        }
                      </p>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="text-muted-foreground">
                          Experience
                        </div>

                        <div className="font-medium">
                          {
                            currentDeveloper.experience
                          }
                        </div>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="text-muted-foreground">
                          Availability
                        </div>

                        <div className="font-medium">
                          {
                            currentDeveloper.availability
                          }
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={
                          handleCloseMatch
                        }
                      >
                        Keep Browsing
                      </Button>

                      <Button
                        className="flex-1"
                        onClick={
                          handleStartChat
                        }
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* ========================= */}
        {/* MATCH ERROR */}
        {/* ========================= */}

        <AnimatePresence>
          {matchError && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
              onClick={() =>
                setMatchError(null)
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="w-full max-w-sm rounded-3xl border bg-card p-8 text-center shadow-2xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-9 w-9 text-destructive" />
                </div>

                <h2 className="text-xl font-bold">
                  Match failed
                </h2>

                <p className="mt-3 text-sm text-muted-foreground">
                  {matchError}
                </p>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setMatchError(null)
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1"
                    onClick={() => {
                      setMatchError(
                        null,
                      );

                      handleSwipeRight();
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Feed;
