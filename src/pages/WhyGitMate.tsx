import { motion } from "framer-motion";
import { Check, X, GitBranch, Zap, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";

const mockUser = {
  name: "Developer",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
  username: "developer",
};

const comparisons = [
  {
    feature: "Profile Data",
    traditional: "Manual self-reported skills",
    gitmate: "Auto-generated from GitHub activity",
    traditionalBad: true,
  },
  {
    feature: "Skill Verification",
    traditional: "Trust self-claimed expertise",
    gitmate: "Commit-verified skill levels",
    traditionalBad: true,
  },
  {
    feature: "Discovery Method",
    traditional: "Cold outreach and job boards",
    gitmate: "Swipe-based intelligent matching",
    traditionalBad: true,
  },
  {
    feature: "Collaboration Tools",
    traditional: "External tools required",
    gitmate: "Built-in chat and project management",
    traditionalBad: true,
  },
  {
    feature: "Match Quality",
    traditional: "Based on keywords and titles",
    gitmate: "Based on actual code patterns",
    traditionalBad: true,
  },
];

const features = [
  {
    icon: GitBranch,
    title: "Github-First Profiles",
    description: "Your profile is automatically built from your actual contributions, repos, and commit history.",
  },
  {
    icon: Shield,
    title: "Verified Skills",
    description: "No more fake claims. Every skill is backed by real code you've written.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "Our algorithm matches you with developers who complement your skills and interests.",
  },
  {
    icon: Users,
    title: "Real Collaborations",
    description: "Built-in tools to go from match to working together on real projects.",
  },
];

const WhyGitMate = () => {
  return (
    <AppLayout user={mockUser}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Why <span className="gradient-text">Gitmate</span>?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional platforms are broken. We're building something better for developers who value real skills over empty claims.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">The Difference</h2>
          
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 border-b border-border/50">
              <div className="text-sm font-medium text-muted-foreground">Feature</div>
              <div className="text-sm font-medium text-muted-foreground">Traditional Platforms</div>
              <div className="text-sm font-medium text-primary">Gitmate</div>
            </div>
            
            {comparisons.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="grid grid-cols-3 gap-4 p-4 border-b border-border/30 last:border-b-0"
              >
                <div className="text-sm font-medium text-foreground">{item.feature}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-destructive flex-shrink-0" />
                  {item.traditional}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item.gitmate}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">How We're Different</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Low friction meets high trust.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Stop wasting time on platforms that don't understand developers. Find your coding soulmate today.
          </p>
          <Button size="lg" asChild>
            <Link to="/feed">
              Start Matching <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default WhyGitMate;
