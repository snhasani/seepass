import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
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
      "@assistant-ui/react",
      "@assistant-ui/react-ai-sdk",
      "@assistant-ui/react-markdown",
      "class-variance-authority",
      "@repo/design-system",
    ],
  },
};

export default nextConfig;
