// Design System for SeePass - AI-native Product Management
// ==========================================================

// Utilities
export { cn } from "./utils/cn";

// Primitives
export {
  Badge,
  badgeVariants,
  type BadgeProps,
} from "./primitives/badge";

export {
  Progress,
  type ProgressProps,
} from "./primitives/progress";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./primitives/tabs";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./primitives/select";

export {
  Textarea,
  textareaVariants,
  type TextareaProps,
} from "./primitives/textarea";

export {
  Switch,
  type SwitchProps,
} from "./primitives/switch";

// Problem Management Components
export {
  SignalSource,
  sourceConfig,
  type SignalSourceType,
  type SignalSourceProps,
} from "./components/signal-source";

export {
  SeverityBadge,
  SeverityBar,
  severityConfig,
  type SeverityLevel,
  type SeverityBadgeProps,
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
  ConfidenceIndicator,
  ConfidenceBar,
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
  type InsightType,
  type AIInsightProps,
} from "./components/ai-insight";

// Prioritization Components
export {
  PriorityIndicator,
  PrioritySelector,
  priorityLevels,
  type PriorityLevel,
  type PriorityIndicatorProps,
} from "./components/priority-indicator";

export {
  VoteButton,
  VotePair,
  AgreementToggle,
  voteButtonVariants,
  type VoteButtonProps,
} from "./components/vote-button";

export {
  DecisionTrail,
  DecisionItem,
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
  ConnectionLine,
  ConnectionLayer,
  type ConnectionPoint,
  type ConnectionLineProps,
} from "./components/connection-line";

// Solution Components
export {
  EffortEstimate,
  EffortSelector,
  EstimateComparison,
  effortLevels,
  type EffortLevel,
  type EffortEstimateProps,
} from "./components/effort-estimate";

export {
  SolutionCard,
  solutionCardVariants,
  statusConfig,
  type Solution,
  type SolutionStatus,
  type SolutionCardProps,
} from "./components/solution-card";

// Summary/Dashboard Components
export {
  MetricCard,
  metricCardVariants,
  type MetricCardProps,
} from "./components/metric-card";

export {
  TrendIndicator,
  TrendList,
  trendIndicatorVariants,
  trendConfig,
  type TrendType,
  type TrendIndicatorProps,
} from "./components/trend-indicator";

export {
  SummaryPanel,
  summaryPanelVariants,
  type PriorityItem,
  type SummaryPanelProps,
} from "./components/summary-panel";
