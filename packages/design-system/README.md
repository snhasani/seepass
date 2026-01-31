# @repo/design-system

A comprehensive design system for SeePass - an AI-native product management platform.

## Overview

This design system provides all the UI components needed to build a problem-first product management experience. It includes components for:

- **Problem capture and visualization** - Display customer problems, signals, and severity levels
- **AI insights and clustering** - Show AI-generated insights with confidence indicators
- **Prioritization and voting** - Enable team alignment with voting and decision trails
- **Canvas collaboration** - Build visual workspaces for problem mapping
- **Solution exploration** - Link problems to solutions with effort estimation
- **Summary dashboards** - Surface "what matters right now" with metrics and trends

## Installation

```bash
pnpm add @repo/design-system
```

## Usage

```tsx
import {
  ProblemCard,
  AIInsight,
  SummaryPanel,
  // ... other components
} from "@repo/design-system";
import "@repo/design-system/styles.css";
```

## Components

### Primitives

Core building blocks that follow the design tokens:

- `Badge` - Status indicators with semantic variants
- `Progress` - Progress bars with multiple visual styles
- `Tabs` - Tab navigation component
- `Select` - Dropdown selection
- `Textarea` - Multi-line text input with character counts
- `Switch` - Toggle switches with labels

### Problem Management

- `ProblemCard` - Display customer problems with metadata
- `SignalSource` - Show where a problem signal came from (Slack, email, support, etc.)
- `SeverityBadge` - Visual severity indicators (critical, high, medium, low)
- `FrequencyIndicator` - Show how often a problem occurs with trends

### AI Insights

- `AIInsight` - Display AI-generated recommendations with explainability
- `ConfidenceIndicator` - Circular or bar visualization of AI confidence
- `ClusterBadge` - Show problem clusters identified by AI

### Prioritization

- `PriorityIndicator` - Visual priority levels
- `PrioritySelector` - User input for setting priorities
- `VoteButton` / `VotePair` - Team agreement/disagreement buttons
- `AgreementToggle` - Simple agree/disagree toggle
- `DecisionTrail` - Timeline of decisions with reasoning

### Canvas

- `CanvasNode` - Draggable items for visual workspaces
- `GroupContainer` - Collapsible containers for grouping
- `ConnectionLine` - SVG lines connecting related items

### Solutions

- `SolutionCard` - Display proposed solutions with status
- `EffortEstimate` - Show effort estimates (AI vs human)
- `EffortSelector` - User input for effort estimation
- `EstimateComparison` - Side-by-side AI/human estimates with discrepancy detection

### Dashboard

- `MetricCard` - Key metrics with trends
- `TrendIndicator` - Show emerging/rising/declining trends
- `TrendList` - List of trending topics
- `SummaryPanel` - "What Matters Right Now" dashboard widget

## Design Tokens

The design system uses CSS custom properties for consistent theming:

### Colors

- `--ds-teal-*` - Primary brand colors (signal, solutions)
- `--ds-amber-*` - Problem indicators, warnings
- `--ds-violet-*` - AI-related elements

### Semantic Colors

- `--ds-problem` / `--ds-problem-bg` - Problem-related styling
- `--ds-ai` / `--ds-ai-bg` - AI insight styling
- `--ds-signal` / `--ds-signal-bg` - Signal source styling
- `--ds-severity-*` - Critical/High/Medium/Low severity
- `--ds-status-*` - Active/Pending/Resolved status
- `--ds-confidence-*` - High/Medium/Low confidence levels

### Effects

- `--ds-glass` / `--ds-glass-border` - Glassmorphism effect
- `--ds-shadow-*` - Shadow scales
- `--ds-shadow-glow` - Accent glow effect

### Animation

- `ds-animate-pulse-soft` - Subtle pulsing
- `ds-animate-float` - Floating effect
- `ds-animate-scale-in` - Scale entrance
- `ds-animate-slide-up` - Slide entrance

## Building

```bash
pnpm build
```

## Development

```bash
pnpm dev
```

## Principles

1. **Problem-First** - UI emphasizes understanding problems before solutions
2. **AI-Native** - Components designed to surface AI insights transparently
3. **Explainable** - Every AI recommendation includes reasoning
4. **Collaborative** - Built for team alignment and shared understanding
5. **Flexible** - Works across different workflows and integrations
