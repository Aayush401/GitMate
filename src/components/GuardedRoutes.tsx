import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

function GuardedRoutes() {
    const { isProfiled } = useAuth();

    if (isProfiled === null) return null; // or loading UI
    if (!isProfiled) {
        toast.info("Please create your profile first");
        return <Navigate to="/details" replace />
    };

    return <Outlet />;
}

export default GuardedRoutes;   