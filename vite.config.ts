import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  preview: {
    host: true,
    allowedHosts: [
        "http://frontend-alb-1076806020.ap-south-1.elb.amazonaws.com",
        "frontend-alb-1076806020.ap-south-1.elb.amazonaws.com",
        "http://frontend-alb-703617275.ap-south-1.elb.amazonaws.com",
        "frontend-alb-703617275.ap-south-1.elb.amazonaws.com",
        "https://gitmate.net",
        "gitmate.net",
        "https://gitmate.org",
        "https://www.gitmate.org",
        "gitmate.org",

    ]
  }
}));
