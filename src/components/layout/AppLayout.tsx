import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  user?: {
    name: string;
    avatar: string;
    username: string;
  };
}

export const AppLayout = ({ children, showNavbar = true }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : ""}>
        {children}
      </main>
    </div>
  );
};
