// Animation timing constants (in seconds)
export const ANIMATION_TIMING = {
  // Total duration of the animation loop
  TOTAL_DURATION: 14,

  // Phase timings
  IDLE_START: 0,
  IDLE_END: 0.5,

  PROBLEMS_START: 0.5,
  PROBLEMS_STAGGER: 0.5, // Time between each node appearing
  PROBLEMS_END: 4,

  SCANNING_START: 4,
  SCANNING_END: 5,

  CONNECTIONS_START: 5,
  CONNECTIONS_STAGGER: 0.4,
  CONNECTIONS_END: 7.5,

  CLUSTERING_START: 7.5,
  CLUSTERING_END: 9.5,

  INSIGHT_START: 9.5,
  INSIGHT_END: 11,

  HOLD_START: 11,
  HOLD_END: 13,

  RESET_START: 13,
  RESET_END: 14,
} as const;

// Animation phases
export type AnimationPhase =
  | "idle"
  | "problems"
  | "scanning"
  | "connections"
  | "clustering"
  | "insight"
  | "hold"
  | "reset";

// Node source types (matches design system)
export type NodeSource = "support" | "slack" | "email" | "interview";

// Sample node data for the showcase
export interface ShowcaseNodeData {
  id: string;
  title: string;
  source: NodeSource;
  cluster?: string;
  // Initial position (relative to viewport, 0-1)
  initialPosition: { x: number; y: number };
  // Entry direction for animation
  entryFrom: "left" | "right" | "top" | "bottom";
  // Clustered position (for clustering phase)
  clusteredPosition?: { x: number; y: number };
}

export const SHOWCASE_NODES: ShowcaseNodeData[] = [
  {
    id: "1",
    title: "Users can't find settings",
    source: "support",
    cluster: "nav",
    initialPosition: { x: 0.15, y: 0.3 },
    entryFrom: "left",
    clusteredPosition: { x: 0.35, y: 0.35 },
  },
  {
    id: "2",
    title: "Menu is confusing",
    source: "slack",
    cluster: "nav",
    initialPosition: { x: 0.75, y: 0.2 },
    entryFrom: "right",
    clusteredPosition: { x: 0.55, y: 0.25 },
  },
  {
    id: "3",
    title: "Export fails for large files",
    source: "email",
    initialPosition: { x: 0.8, y: 0.7 },
    entryFrom: "right",
  },
  {
    id: "4",
    title: "Need better dashboard",
    source: "interview",
    initialPosition: { x: 0.2, y: 0.75 },
    entryFrom: "bottom",
  },
  {
    id: "5",
    title: "Search results unclear",
    source: "support",
    cluster: "nav",
    initialPosition: { x: 0.5, y: 0.55 },
    entryFrom: "bottom",
    clusteredPosition: { x: 0.45, y: 0.45 },
  },
];

// Mobile-optimized subset (3-4 nodes)
export const SHOWCASE_NODES_MOBILE: ShowcaseNodeData[] = [
  {
    id: "1",
    title: "Users can't find settings",
    source: "support",
    cluster: "nav",
    initialPosition: { x: 0.2, y: 0.2 },
    entryFrom: "left",
    clusteredPosition: { x: 0.4, y: 0.3 },
  },
  {
    id: "2",
    title: "Menu is confusing",
    source: "slack",
    cluster: "nav",
    initialPosition: { x: 0.7, y: 0.35 },
    entryFrom: "right",
    clusteredPosition: { x: 0.55, y: 0.3 },
  },
  {
    id: "3",
    title: "Export fails for large files",
    source: "email",
    initialPosition: { x: 0.5, y: 0.7 },
    entryFrom: "bottom",
  },
];

// Connection data
export interface ShowcaseConnectionData {
  id: string;
  from: string;
  to: string;
}

export const SHOWCASE_CONNECTIONS: ShowcaseConnectionData[] = [
  { id: "c1", from: "1", to: "2" },
  { id: "c2", from: "2", to: "5" },
  { id: "c3", from: "1", to: "5" },
];

export const SHOWCASE_CONNECTIONS_MOBILE: ShowcaseConnectionData[] = [
  { id: "c1", from: "1", to: "2" },
];

// Cluster data
export interface ShowcaseClusterData {
  id: string;
  label: string;
  nodeIds: string[];
  // Position of cluster center (relative to viewport, 0-1)
  position: { x: number; y: number };
}

export const SHOWCASE_CLUSTERS: ShowcaseClusterData[] = [
  {
    id: "nav",
    label: "Navigation Issues",
    nodeIds: ["1", "2", "5"],
    position: { x: 0.45, y: 0.35 },
  },
];

// Spring easing from design system
export const SPRING_EASING = [0.34, 1.56, 0.64, 1] as const;

// Source colors (from signal-source.tsx)
export const SOURCE_COLORS: Record<NodeSource, { bg: string; text: string }> = {
  support: { bg: "bg-[var(--ds-amber-500)]", text: "text-white" },
  slack: { bg: "bg-[#4A154B]", text: "text-white" },
  email: { bg: "bg-[var(--ds-teal-500)]", text: "text-white" },
  interview: { bg: "bg-[var(--ds-violet-500)]", text: "text-white" },
};

// Viewport dimensions for different breakpoints
export const VIEWPORT_DIMENSIONS = {
  desktop: { width: 800, height: 500 },
  tablet: { width: 600, height: 400 },
  mobile: { width: 350, height: 350 },
} as const;
