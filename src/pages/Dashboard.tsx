import { motion } from "framer-motion";
import { Users, MessageSquare, FolderKanban, Zap, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/cards/StatCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
    const {data: profile, isLoading: profileLoading, error: profileError} = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                const resData = await api.get("/profile", {
                withCredentials: true,
            });
            return resData.data ?? null;
    
            } catch (err) {
                return null;
            }
        }
    })
    
    const {data: matches, isLoading: matchesLoading, error: matchesError} = useQuery({
        queryKey: ["matches"],
        queryFn: async () => {
            try {
                const resData = await api.get("/matches", {
                withCredentials: true,
            });
            return resData.data ?? null;
    
            } catch (err) {
                return null;
            }
        }
    })
    
    const {data: recentMatches, isLoading: recentMatchesLoading, error: recentMatchesError} = useQuery({
        queryKey: ["recent-matches"],
        queryFn: async () => {
            try {
                const resData = await api.get("/matches/recent", {
                withCredentials: true,
            });
            return resData.data ?? null;
    
            } catch (err) {
                return null;
            }
        }
    })
    
    const {data: similarProfiles, isLoading: similarProfilesLoading, error: similarProfilesError} = useQuery({
        queryKey: ["similar-profiles"],
        queryFn: async () => {
            try {
                const resData = await api.get("/profile/similar", {
                withCredentials: true,
            });
            return resData.data ?? null;
    
            } catch (err) {
                return null;
            }
        }
    })
    console.log("Profile", profile)
    console.log("matches", matches)
    console.log("recentMatches", recentMatches)
    console.log("similarProfiles", similarProfiles)
    
    return (
        <AppLayout >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            > 
            {
                profileLoading ? 
                <Skeleton className="w-full sm:w-1/2 h-12"/>
                :
                profileError ? 
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, <span className="gradient-text">User</span>
                </h1>
                :
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, <span className="gradient-text">{profile?.user?.name ?? "User"}</span>
                </h1>

            }
            <p className="text-muted-foreground mt-1">Ready to find your next collaborator?</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Total Matches"
                value={matches?.data?.length}
                icon={Users}
                isLoading = {matchesLoading}
            />

            <StatCard
                title="Recent Matches"
                value={recentMatches?.data?.length}
                icon={MessageSquare}
                isLoading = {recentMatchesLoading}
            />
            <StatCard
                title="Similar Profiles"
                value={similarProfiles?.length}
                icon={FolderKanban}
                isLoading = {similarProfilesLoading}
            />
           <StatCard
                title="New Opportunities"
                value="∞"
                subtitle="Keep exploring profiles"
                icon={Zap}
            />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Find Collaborators CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
            >
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 rounded-2xl p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Find Collaborators</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                    Swipe through developers with verified Github profiles. Match based on real code, not claims.
                    </p>
                    <Button size="lg" asChild>
                    <Link to="/feed">
                        Start Swiping <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    </Button>
                </div>
                </div>
            </motion.div>

            {/* Recent Matches */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            >
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Matches</h3>

                <Link
                    to="/matches"
                    className="text-sm text-primary hover:underline"
                >
                    View all
                </Link>
                </div>

                <div className="space-y-4">
                {/* Loading */}
                {recentMatchesLoading &&
                    Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-3"
                    >
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />

                        <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-full max-w-40" />
                        </div>

                        <Skeleton className="w-9 h-9 rounded-md" />
                    </div>
                    ))}

                {/* Error */}
                {!recentMatchesLoading && recentMatchesError && (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-center">
                    <p className="text-sm font-medium text-destructive">
                        Failed to load recent matches
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Please try refreshing the page.
                    </p>
                    </div>
                )}

                {/* Empty */}
                {!recentMatchesLoading &&
                    !recentMatchesError &&
                    (!recentMatches?.data ||
                    recentMatches.data.length === 0) && (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border px-4 text-center">
                        <Users className="w-8 h-8 text-muted-foreground/50" />

                        <p className="mt-3 text-sm font-medium text-foreground">
                        No Recent Matches
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                        Your recent matches will appear here.
                        </p>
                    </div>
                    )}

                {/* Data */}
                {!recentMatchesLoading &&
                    !recentMatchesError &&
                    recentMatches?.data?.length > 0 &&
                    recentMatches.data.map((match) => (
                    <div
                        key={match?.user?.userId}
                        className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/50"
                    >
                        <img
                        src={match?.user?.image}
                        alt={match?.user?.name ?? "Matched user"}
                        className="w-10 h-10 rounded-full border border-border object-cover"
                        />

                        <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {match?.user?.name ?? "Unknown User"}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                            {match?.user?.profile?.bio ??
                            "No bio available"}
                        </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => window.location.href = `/chat/${match?.user?.id}`}
                        >
                        <MessageSquare className="w-4 h-4" />
                        </Button>
                    </div>
                    ))}
                </div>
            </div>
            </motion.div>
        </div>

            {/* Quick Actions */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
            {/* <Link to="/projects" className="group">
                <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow">
                <FolderKanban className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-foreground">Create Project</h4>
                <p className="text-sm text-muted-foreground">Start a new project and find collaborators</p>
                </div>
            </Link> */}
            <Link to="/profile" className="group">
                <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow">
                <Users className="w-6 h-6 text-accent mb-3" />
                <h4 className="font-medium text-foreground">View Profile</h4>
                <p className="text-sm text-muted-foreground">Sync your latest Github activity</p>
                </div>
            </Link>
            <Link to="/why-gitmate" className="group">
                <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow">
                <Zap className="w-6 h-6 text-warning mb-3" />
                <h4 className="font-medium text-foreground">Why Gitmate?</h4>
                <p className="text-sm text-muted-foreground">Learn about our matching algorithm</p>
                </div>
            </Link>
            <Link to="/settings" className="group">
                <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow">
                    <Settings className="w-6 h-6 text-muted-foreground mb-3" />
                    <h4 className="font-medium text-foreground">Settings</h4>
                    <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                </div>
            </Link>
            </motion.div>
        </div>
        </AppLayout>
    );
};

export default Dashboard;
