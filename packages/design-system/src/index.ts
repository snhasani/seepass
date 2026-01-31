// Design System for SeePass - AI-native Product Management
// ==========================================================

// Utilities
export { cn } from "./utils/cn";

// Primitives
export { Badge, badgeVariants, type BadgeProps } from "./primitives/badge";

export { Progress, type ProgressProps } from "./primitives/progress";

export { Tabs, TabsContent, TabsList, TabsTrigger } from "./primitives/tabs";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./primitives/select";

export {
  Textarea,
  textareaVariants,
  type TextareaProps,
} from "./primitives/textarea";

export { Switch, type SwitchProps } from "./primitives/switch";

// Problem Management Components
export {
  SignalSource,
  sourceConfig,
  type SignalSourceProps,
  type SignalSourceType,
} from "./components/signal-source";

export {
  SeverityBadge,
  SeverityBar,
  severityConfig,
  type SeverityBadgeProps,
  type SeverityLevel,
} from "./components/severity-badge";

export {
  FrequencyIndicator,
  FrequencySparkline,
  type FrequencyIndicatorProps,
} from "./components/frequency-indicator";

export {
  ProblemCard,
  problemCardVariants,
  type Problem,
  type ProblemCardProps,
} from "./components/problem-card";

// AI Insight Components
export {
  ConfidenceBar,
  ConfidenceIndicator,
  getConfidenceLevel,
  type ConfidenceIndicatorProps,
} from "./components/confidence-indicator";

export {
  ClusterBadge,
  clusterBadgeVariants,
  type ClusterBadgeProps,
} from "./components/cluster-badge";

export {
  AIInsight,
  aiInsightVariants,
  type AIInsightProps,
  type InsightType,
} from "./components/ai-insight";

// Prioritization Components
export {
  PriorityIndicator,
  PrioritySelector,
  priorityLevels,
  type PriorityIndicatorProps,
  type PriorityLevel,
} from "./components/priority-indicator";

export {
  AgreementToggle,
  VoteButton,
  VotePair,
  voteButtonVariants,
  type VoteButtonProps,
} from "./components/vote-button";

export {
  DecisionItem,
  DecisionTrail,
  type Decision,
  type DecisionType,
} from "./components/decision-trail";

// Canvas Components
export {
  CanvasNode,
  canvasNodeVariants,
  type CanvasNodeData,
  type CanvasNodeProps,
} from "./components/canvas-node";

export {
  GroupContainer,
  groupContainerVariants,
  type GroupContainerProps,
} from "./components/group-container";

export {
  ConnectionLayer,
  ConnectionLine,
  type ConnectionLineProps,
  type ConnectionPoint,
} from "./components/connection-line";

// Solution Components
export {
  EffortEstimate,
  EffortSelector,
  EstimateComparison,
  effortLevels,
  type EffortEstimateProps,
  type EffortLevel,
} from "./components/effort-estimate";

export {
  SolutionCard,
  solutionCardVariants,
  statusConfig,
  type Solution,
  type SolutionCardProps,
  type SolutionStatus,
} from "./components/solution-card";

// Summary/Dashboard Components
export {
  MetricCard,
  metricCardVariants,
  type MetricCardProps,
} from "./components/metric-card";

export {
  StatPill,
  statPillVariants,
  type StatPillProps,
} from "./components/stat-pill";

export {
  TrendIndicator,
  TrendList,
  trendConfig,
  trendIndicatorVariants,
  type TrendIndicatorProps,
  type TrendType,
} from "./components/trend-indicator";

export {
  SummaryPanel,
  summaryPanelVariants,
  type PriorityItem,
  type SummaryPanelProps,
} from "./components/summary-panel";
