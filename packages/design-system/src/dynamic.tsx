"use client";

/**
 * Dynamic imports for heavy components.
 * Use these in Next.js apps to lazy-load canvas and animation-heavy components.
 *
 * @example
 * // In your Next.js app:
 * import dynamic from 'next/dynamic';
 *
 * const CanvasNode = dynamic(
 *   () => import('@repo/design-system').then(m => m.CanvasNode),
 *   { ssr: false }
 * );
 *
 * // Or use the pre-configured lazy loaders:
 * import { lazyCanvasNode, lazyConnectionLine } from '@repo/design-system/dynamic';
 */

import * as React from "react";
import type { ComponentType } from "react";

// Lazy component factory for use with React.lazy()
export const lazyCanvasNode = React.lazy(
  () => import("./components/canvas-node").then((m) => ({ default: m.CanvasNode }))
);

export const lazyConnectionLine = React.lazy(
  () => import("./components/connection-line").then((m) => ({ default: m.ConnectionLine }))
);

export const lazyGroupContainer = React.lazy(
  () => import("./components/group-container").then((m) => ({ default: m.GroupContainer }))
);

// Helper function to create dynamic imports for Next.js
// Use with: const Component = dynamic(() => getDynamicImport('CanvasNode'), { ssr: false })
type DynamicComponentKey =
  | "CanvasNode"
  | "ConnectionLine"
  | "ConnectionLayer"
  | "GroupContainer"
  | "AIInsight"
  | "DecisionTrail"
  | "SummaryPanel";

export async function getDynamicImport(
  componentName: DynamicComponentKey
): Promise<{ default: ComponentType<unknown> }> {
  switch (componentName) {
    case "CanvasNode":
      return import("./components/canvas-node").then((m) => ({ default: m.CanvasNode as ComponentType<unknown> }));
    case "ConnectionLine":
      return import("./components/connection-line").then((m) => ({ default: m.ConnectionLine as ComponentType<unknown> }));
    case "ConnectionLayer":
      return import("./components/connection-line").then((m) => ({ default: m.ConnectionLayer as ComponentType<unknown> }));
    case "GroupContainer":
      return import("./components/group-container").then((m) => ({ default: m.GroupContainer as ComponentType<unknown> }));
    case "AIInsight":
      return import("./components/ai-insight").then((m) => ({ default: m.AIInsight as ComponentType<unknown> }));
    case "DecisionTrail":
      return import("./components/decision-trail").then((m) => ({ default: m.DecisionTrail as ComponentType<unknown> }));
    case "SummaryPanel":
      return import("./components/summary-panel").then((m) => ({ default: m.SummaryPanel as ComponentType<unknown> }));
    default:
      throw new Error(`Unknown component: ${componentName}`);
  }
}
