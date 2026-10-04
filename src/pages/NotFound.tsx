
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  SearchX,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

            <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

            <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
                backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "32px 32px",
            }}
            />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl text-center"
            >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                duration: 0.5,
                delay: 0.1,
                type: "spring",
                stiffness: 180,
                }}
                className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-card/80 shadow-xl backdrop-blur"
            >
                <SearchX className="h-9 w-9 text-primary" />
            </motion.div>

            {/* 404 */}
            <div className="relative mb-4">
                <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="select-none text-[clamp(7rem,22vw,13rem)] font-black leading-none tracking-[-0.08em]"
                >
                <span className="gradient-text">404</span>
                </motion.h1>

                <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "80px", opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mx-auto h-1 rounded-full bg-primary"
                />
            </div>

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
                Looks like you took a wrong turn.
            </motion.h2>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base"
            >
                The page you're looking for doesn't exist or may have
                been moved. Let's get you back to where the action is.
            </motion.p>

            {/* Requested path */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mx-auto mt-6 max-w-md overflow-hidden rounded-xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur"
            >
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Compass className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate font-mono">
                    {location.pathname}
                </span>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
                <button
                onClick={() => navigate(-1)}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-secondary sm:w-auto"
                >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Go Back
                </button>

                <button
                onClick={() => navigate("/")}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl sm:w-auto"
                >
                <Home className="h-4 w-4" />
                Back to Home
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </motion.div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-10 text-xs text-muted-foreground/60"
            >
                Gitmate · Find developers. Build together.
            </motion.p>
            </motion.div>
        </div>
        </div>
    </AppLayout>
  );
};

export default NotFound;
