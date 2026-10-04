import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Code2, Rocket, Users, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const skills = [
  "Frontend", "Backend", "Full Stack", "ML / AI", "DevOps", "Blockchain", "Mobile", "Design"
];

const techStack = [
  "React", "Node.js", "Python", "TypeScript", "Go", "Rust", "Java", "C++", 
  "Vue", "Angular", "Django", "FastAPI", "PostgreSQL", "MongoDB", "AWS", "Docker"
];

const mockGitHubData = {
  username: "developer",
  topLanguages: ["TypeScript", "Python", "JavaScript", "Go"],
  repoCount: 47,
  commits: 1234,
  stars: 89,
  contributions: 856,
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  // Simulate GitHub analysis
  useEffect(() => {
    if (step === 0) {
      const timer = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep(1), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [step]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                step >= s ? "bg-primary w-8" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: GitHub Analysis */}
          {step === 0 && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
                <GitBranch className="w-10 h-10 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">Analyzing your GitHub profile</h2>
                <p className="mt-2 text-muted-foreground">Discovering your coding DNA...</p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-sm text-muted-foreground font-mono">{analysisProgress}%</p>
              </div>

              {analysisProgress > 30 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 text-sm text-muted-foreground"
                >
                  <p>Found {mockGitHubData.repoCount} repositories...</p>
                  {analysisProgress > 60 && <p>Detected {mockGitHubData.commits.toLocaleString()} commits...</p>}
                  {analysisProgress > 85 && <p>Identified top languages...</p>}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 1: Analysis Results */}
          {step === 1 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-success/10 border border-success/30 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Profile Analysis Complete</h2>
                <p className="mt-2 text-muted-foreground">Here's what we found</p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-xl">
                    <p className="text-2xl font-bold font-mono text-primary">{mockGitHubData.repoCount}</p>
                    <p className="text-xs text-muted-foreground">Repositories</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-xl">
                    <p className="text-2xl font-bold font-mono text-primary">{mockGitHubData.commits.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Commits</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-xl">
                    <p className="text-2xl font-bold font-mono text-primary">{mockGitHubData.stars}</p>
                    <p className="text-xs text-muted-foreground">Stars</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-xl">
                    <p className="text-2xl font-bold font-mono text-primary">{mockGitHubData.contributions}</p>
                    <p className="text-xs text-muted-foreground">Contributions</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Top Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {mockGitHubData.topLanguages.map((lang) => (
                      <Badge key={lang} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setStep(2)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Intent Selection */}
          {step === 2 && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">What brings you here?</h2>
                <p className="mt-2 text-muted-foreground">Help us match you with the right collaborators</p>
              </div>

              <div className="grid gap-4">
                <motion.button
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all duration-300",
                    selectedIntent === "building"
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border/50 hover:border-primary/50"
                  )}
                  onClick={() => setSelectedIntent("building")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">I'm building a project</h3>
                      <p className="text-sm text-muted-foreground">Looking for collaborators to join my team</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all duration-300",
                    selectedIntent === "joining"
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border/50 hover:border-primary/50"
                  )}
                  onClick={() => setSelectedIntent("joining")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">I want to join a project</h3>
                      <p className="text-sm text-muted-foreground">Looking for interesting projects to contribute</p>
                    </div>
                  </div>
                </motion.button>
              </div>

              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => setStep(3)}
                disabled={!selectedIntent}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Skills & Tech Stack */}
          {step === 3 && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Select your skills & interests</h2>
                <p className="mt-2 text-muted-foreground">This helps us find better matches for you</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Areas of expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className={cn(
                          "cursor-pointer transition-all duration-200 px-4 py-2",
                          selectedSkills.includes(skill)
                            ? "bg-primary/10 text-primary border-primary"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className={cn(
                          "cursor-pointer transition-all duration-200 font-mono text-xs px-3 py-1.5",
                          selectedTech.includes(tech)
                            ? "bg-primary/10 text-primary border-primary"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => toggleTech(tech)}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleComplete}
                disabled={selectedSkills.length === 0}
              >
                Complete Setup <Check className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
