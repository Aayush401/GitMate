import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GitBranch,
  Users,
  MessageSquare,
  FolderKanban,
  Settings,
  LogOut,
  LayoutDashboard,
  Rss,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Themer from "../Themer";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  profile: {
    id: string;
    userId: string;
    bio: string | null;
    experience: string;
    skills: string;
    goals: string;
    availability: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Feed",
    href: "/feed",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "Matches",
    href: "/matches",
    icon: <GitBranch className="h-4 w-4" />,
  },
//   {
//     label: "Chat",
//     href: "/chat",
//     icon: <MessageSquare className="h-4 w-4" />,
//   },
//   {
//     label: "Projects",
//     href: "/projects",
//     icon: <FolderKanban className="h-4 w-4" />,
//   },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
  } = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/profile");
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = data?.user;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const { isAuthenticated, refreshAuth } = useAuth();
  const queryClient = useQueryClient();

  

  const logout = async () => {
        return await api.get("/auth/logout", {
            withCredentials: true,
        });
    };

    const toastId = useRef<string | number | undefined>(undefined);

    const {mutate: logoutUser, isPending: loggingOut, isSuccess, } = useMutation({
        mutationFn: logout,

        onMutate: () => { 
            toastId.current = toast.loading("Logging out user..")
        },


        onSuccess: async () => {    
            await refreshAuth();

            queryClient.removeQueries({
                queryKey: ["profile"],
            });
            
            toast.success("Logged out successfully", {id: toastId.current})

            navigate("/", {
                replace: true
            })
        },

        onError: (e) => {
            console.log("ERROR: ", e.message)
            console.log("ERROR: ", e)
            toast.error("An unexpected error", {id: toastId.current})
        }
    });

    console.log("user: ", user)

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 transition-shadow duration-300 group-hover:shadow-glow">
              <GitBranch className="h-4 w-4 text-primary" />
            </div>

            <span className="text-lg font-semibold text-foreground">
              Gitmate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Profile Loading */}
          {isLoading && (
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          )}

          {/* User Menu */}
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />

                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 border-border bg-card"
              >
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />

                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                  <Link
                    to="/profile"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                  <Link
                    to="/settings"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                    <Link
                        to="/dashboard"
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                    <Link
                        to="/feed"
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Rss className="h-4 w-4" />
                        Feed
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                    <Link
                        to="/matches"
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Users className="h-4 w-4" />
                        Matches
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="border-2 border-transparent hover:border-accent">
                    <Themer className="w-full cursor-pointer"/>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 border-red-600 bg-red-500/30 text-white border-2 hover:bg-red-600 hover:text-red-100 w-full"
                  onClick={() => {
                    // Add your logout mutation here
                    logoutUser()
                  }}
                >                    {
                    loggingOut? 
                    "logging out..."
                    :
                    <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                    </>
                }
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Not authenticated / profile request failed */}
          {!isLoading && (isError || !user) && (
            <Button variant="github" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};