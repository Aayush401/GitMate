import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Calendar, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const mockUser = {
  name: "Developer",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
  username: "developer",
};

const mockProjects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with microservices architecture, real-time inventory, and AI-powered recommendations.",
    status: "in_progress",
    skills: ["React", "Node.js", "PostgreSQL", "Redis"],
    members: [
      { name: "You", avatar: mockUser.avatar },
      { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
    ],
    lookingFor: ["Backend Developer", "DevOps Engineer"],
    createdAt: "2 weeks ago",
  },
  {
    id: "2",
    title: "ML Pipeline Framework",
    description: "Open-source framework for building and deploying machine learning pipelines with automated testing and monitoring.",
    status: "idea",
    skills: ["Python", "PyTorch", "Docker", "Kubernetes"],
    members: [
      { name: "You", avatar: mockUser.avatar },
    ],
    lookingFor: ["ML Engineer", "Data Engineer"],
    createdAt: "3 days ago",
  },
  {
    id: "3",
    title: "Developer Portfolio Generator",
    description: "CLI tool that generates beautiful developer portfolios from Github data with customizable themes.",
    status: "launched",
    skills: ["TypeScript", "Go", "GraphQL"],
    members: [
      { name: "You", avatar: mockUser.avatar },
      { name: "Alex Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
      { name: "Jordan Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" },
    ],
    lookingFor: [],
    createdAt: "1 month ago",
  },
];

const statusConfig = {
  idea: { label: "Idea", color: "bg-info/10 text-info border-info/30" },
  in_progress: { label: "In Progress", color: "bg-warning/10 text-warning border-warning/30" },
  launched: { label: "Launched", color: "bg-success/10 text-success border-success/30" },
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <AppLayout user={mockUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your projects and find collaborators</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new project and find collaborators
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" placeholder="My Awesome Project" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input id="skills" placeholder="React, Node.js, PostgreSQL" className="mt-1.5" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border/50"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", statusConfig[project.status as keyof typeof statusConfig].color)}
                    >
                      {statusConfig[project.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Created {project.createdAt}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="font-mono text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Team */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.map((member, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-card">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.members.length} member{project.members.length > 1 ? "s" : ""}
                  </span>
                </div>

                {project.lookingFor.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Users className="w-3 h-3" />
                    Looking for {project.lookingFor.length} more
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
