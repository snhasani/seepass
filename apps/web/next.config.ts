import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      // Icon library - loads 1,500+ modules without optimization
      "lucide-react",
      // Animation library
      "framer-motion",
      // Radix UI primitives
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-progress",
      "@radix-ui/react-select",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      // Assistant UI
      "@assistant-ui/react",
      "@assistant-ui/react-ai-sdk",
      "@assistant-ui/react-markdown",
      // Utility libraries
      "class-variance-authority",
      // Internal design system
      "@repo/design-system",
    ],
  },
};

export default nextConfig;
