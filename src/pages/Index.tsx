import { AnimatePresence, motion } from "framer-motion";
import {GitBranch, ArrowRight, Code2, Users, Zap, Shield, LayoutDashboard, Settings, BookOpen, Sparkles, Home, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Themer from "@/components/Themer";
import { useTheme } from "next-themes";
import { X } from "@/components/animate-ui/icons/x";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ChartNoAxesColumnDecreasing } from "@/components/animate-ui/icons/chart-no-axes-column-decreasing";
import clsx from "clsx";
import { SiGithub } from "react-icons/si";

const Index = () => {
const queryClient = useQueryClient();

const { isAuthenticated, refreshAuth } = useAuth();

const messages = [
    "Finding developers who match your energy...",
    "Analyzing skills, interests, and experience...",
    "Matching you through real code...",
    "Your next great collaboration waiting...",
];

const [currentMessage, setCurrentMessage] = useState(0);

useEffect(() => {
    const interval = setInterval(() => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
}, 3000);


return () => clearInterval(interval);


}, []);

const fetchUser = async () => {
    try {
        const resData = await api.get("auth/me", {
        withCredentials: true,
    });
    return resData.data.user ?? null;

    } catch (err) {
        return null;
    }

};

const logout = async () => {
    return await api.get("/auth/logout", {
        withCredentials: true,
    });
};

const {data: user, isLoading: userLoading} = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0,
});

const {mutate: logoutUser, isPending: loggingOut} = useMutation({
    mutationFn: logout,

    onSuccess: async () => {    
        await refreshAuth();

        queryClient.invalidateQueries({
            queryKey: ["user"],
        });
    }
});

const {data: profile} = useQuery({
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

let count = 0

// useEffect(() => {
//     setInterval(()=>{
//         count++
//         toast.info("Count is increased")
//     }, 4000)
// })

const {resolvedTheme} = useTheme()
console.log("Theme: ", resolvedTheme)

if (userLoading) console.log("loading...");
else if (loggingOut) console.log("logging out");
else if (!user) console.log("not logged in");
else console.log("logged in");
console.log("Profile: ", profile)

const [open, setOpen] = useState<boolean>(false)

return ( 
<div className="min-h-screen bg-background">
  {/* Navbar */}
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-primary" />
          </div>

          <span className="text-lg font-semibold text-foreground">
            Gitmate
          </span>
        </Link>

        {/* Dekstop devices */}
        <div className="max-md:hidden flex items-center gap-4">

          {isAuthenticated ? (
            
            <Button
              variant="github"
              size="sm"
              onClick={() => logoutUser()}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <>
                <Link
                    to="/why-gitmate"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Why Gitmate?
                </Link>
                <Button variant="github" size="sm" asChild>
                <Link to="/login">
                    Sign in
                </Link>
                </Button>
            </>
          )}

            <Themer />
        </div>

        {/* Mobile devices */}
<div className="md:hidden px-4">
    <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm"
        aria-label="Toggle menu"
    >
        <X
            animateOnHover
            className={clsx(open ? "visible" : "hidden")}
            size={20}
        />

        <ChartNoAxesColumnDecreasing
            animateOnHover
            className={clsx(open ? "hidden" : "visible")}
            size={20}
        />
    </button>

    <div
        className={clsx(
            open
                ? "fixed top-16 left-0 right-0 bottom-0 h-screen z-50 bg-background flex flex-col px-6 py-8"
                : "hidden"
        )}
    >
        {/* Menu Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-lg font-semibold">
                    {isAuthenticated ? "Welcome back 👋" : "Welcome to GitMate"}
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    {isAuthenticated
                        ? "Manage your repositories and workflow."
                        : "Your intelligent GitHub companion."}
                </p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
            <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
                <Home size={18} />
                Home
            </Link>

            <Link
                to="/why-gitmate"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
                <Sparkles size={18} />
                Why GitMate?
            </Link>

            {isAuthenticated && (
                <>
                    <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link
                        to="/repositories"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                        <GitBranch size={18} />
                        Repositories
                    </Link>
                </>
            )}
        </nav>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Useful Links */}
        <div className="flex flex-col gap-2">
            <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
                <SiGithub size={18} />
                GitHub
            </a>

            <Link
                to="/docs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
                <BookOpen size={18} />
                Documentation
            </Link>

            <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
                <Settings size={18} />
                Settings
            </Link>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-4">
            <Themer className="w-full py-5" />

            {isAuthenticated ? (
                <Button
                    variant="github"
                    size="sm"
                    onClick={() => {
                        setOpen(false);
                        logoutUser();
                    }}
                    disabled={loggingOut}
                    className="w-full py-5"
                >
                    {loggingOut ? "Logging out..." : "Logout"}
                </Button>
            ) : (
                <Button
                    variant="github"
                    asChild
                    className="w-full py-6"
                >
                    <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                    >
                        Sign in
                    </Link>
                </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
                Built for developers who ship faster.
            </p>
        </div>
    </div>
</div>

      </div>
    </div>
  </nav>


  {/* Hero */}
  <section className="pt-40 max-sm:pt-24 pb-20 px-4 min-h-screen flex items-center">

    <div className="max-w-5xl mx-auto text-center w-full">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">

          <Code2 className="w-4 h-4 text-primary" />

          <span className="text-sm max-sm:text-xs text-primary">
            Developer Collaboration Platform
          </span>

        </div>


        {/* Heading */}
        <h1 className="text-4xl sm:text-7xl font-bold text-foreground leading-tight mb-6">

          Find Your
          <br />

          <span className="gradient-text">
            Coding Soulmate
          </span>

        </h1>


        {/* Description */}
        <p className="text-sm xl:text-[17px] text-muted-foreground max-w-2xl mx-auto mb-10 max-sm:mb-8 max-sm:text-[16px]">

          Connect with developers using verified Github data.
          Match based on real code, not resumes.
          Build together, grow together.

        </p>


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Button size="xl" asChild className="max-sm:text-sm text-[17px] px-10">

            {user ? (

              <Link to="/dashboard">

                <LayoutDashboard />

                Dashboard

              </Link>

            ) : (

              <Link to="/login" className="max-sm:py-2 ">

                Get Started

              </Link>

            )}

          </Button>


          <Button variant="outline" size="xl" asChild className="text-sm sm:text-[17px">

            <Link to="/why-gitmate">

              Learn More

              <ArrowRight className="w-4 h-4 ml-2" />

            </Link>

          </Button>

        </div>


        {/* Animated Status Message */}
        <div className="mt-16 max-sm:mt-6 flex justify-center">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.5,
            }}
            className="flex items-center gap-3 px-5 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm"
          >

            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />

            </span>


            {/* Changing text */}
            <AnimatePresence mode="wait">

              <motion.span
                key={messages[currentMessage]}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="text-sm text-muted-foreground truncate "
              >

                {messages[currentMessage]}

              </motion.span>

            </AnimatePresence>

          </motion.div>

        </div>

      </motion.div>

    </div>

  </section>


  {/* Features */}
  <section className="py-20 px-4 bg-card/50 min-h-screen">

    <div className="max-w-6xl mx-auto">

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="text-center mb-16"
      >

        <h2 className="text-3xl font-bold text-foreground mb-4">
          Why Developers Choose Gitmate
        </h2>

        <p className="text-muted-foreground max-w-xl mx-auto">
          Built by engineers, for engineers.
          No fake profiles, no empty claims.
        </p>

      </motion.div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {[
          {
            icon: Shield,
            title: "Verified Skills",
            desc: "Every skill backed by real commits and contributions",
          },
          {
            icon: Users,
            title: "Smart Matching",
            desc: "Algorithm matches based on code patterns and interests",
          },
          {
            icon: Zap,
            title: "Zero Friction",
            desc: "Swipe to connect, built-in chat and project tools",
          },
        ].map((feature, i) => (

          <motion.div
            key={feature.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: i * 0.1,
            }}
            className="bg-card border border-border/50 rounded-2xl p-8 text-center hover:border-primary/30 transition-all"
          >

            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-6">

              <feature.icon className="w-7 h-7 text-primary" />

            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3">
              {feature.title}
            </h3>

            <p className="text-muted-foreground">
              {feature.desc}
            </p>

          </motion.div>

        ))}

      </div>

    </div>

  </section>


  {/* CTA */}
  <section className="py-32 px-4 relative overflow-hidden">

    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />

    </div>


    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.7,
      }}
      className="relative max-w-5xl mx-auto"
    >

      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-xl p-8 sm:p-12 lg:p-16 text-center">

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />


        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-primary/10" />

        <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full border border-primary/10" />


        <div className="relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">

            <Zap className="w-4 h-4 text-primary" />

            <span className="text-xs sm:text-sm text-primary">
              Your next collaboration starts here
            </span>

          </div>


          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">

            Stop coding alone.

            <br />

            <span className="gradient-text">
              Build something together.
            </span>

          </h2>


          {/* Description */}
          <p className="text-[16px] sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">

            Find developers who share your interests,
            complement your skills,
            and are ready to build something meaningful with you.

          </p>


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Button
              size="xl"
              className="group max-sm:text-[15px] w-fit"
              asChild
            >

              {user ? (

                <Link to="/dashboard">

                  <LayoutDashboard className="mr-2" />

                  Go to Dashboard

                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />

                </Link>

              ) : (

                <Link to="/login">

                  Find Your Coding Soulmate

                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />

                </Link>

              )}

            </Button>


            {!user && (

              <Button
                variant="outline"
                size="lg"
                asChild
                className="max-sm:text-[15px]"
              >

                <Link to="/why-gitmate">

                  See How It Works

                </Link>

              </Button>

            )}

          </div>


          {/* Trust points */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">

            <div className="flex items-center gap-2">

              <Shield className="w-4 h-4 text-primary" />

              Verified GitHub data

            </div>


            <div className="flex items-center gap-2">

              <Code2 className="w-4 h-4 text-primary" />

              Match through real code

            </div>


            <div className="flex items-center gap-2">

              <Users className="w-4 h-4 text-primary" />

              Built for developers

            </div>

          </div>

        </div>

      </div>

    </motion.div>

  </section>


  {/* Footer */}
  <footer className="py-8 px-4 border-t border-border/50">

    <div className="max-w-6xl mx-auto flex items-center justify-between">

      <div className="flex items-center gap-2">

        <GitBranch className="w-4 h-4 text-primary" />

        <span className="text-sm text-muted-foreground">
          Gitmate
        </span>

      </div>

      <p className="text-xs text-muted-foreground">
        Built for developers, by developers.
      </p>

    </div>

  </footer>

</div>


);
};

export default Index;
