"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { ShowcaseNode } from "./showcase-node";
import { ShowcaseConnection } from "./showcase-connection";
import { ShowcaseCluster, ShowcaseInsight } from "./showcase-cluster";
import {
  type ShowcaseNodeData,
  type ShowcaseConnectionData,
  type ShowcaseClusterData,
  ANIMATION_TIMING,
} from "./animation-config";

interface CanvasViewportProps {
  nodes: ShowcaseNodeData[];
  connections: ShowcaseConnectionData[];
  clusters: ShowcaseClusterData[];
  visibleNodes: string[];
  visibleConnections: string[];
  showCluster: boolean;
  showInsight: boolean;
  isClustering: boolean;
  phase: string;
  width: number;
  height: number;
  className?: string;
}

export function CanvasViewport({
  nodes,
  connections,
  clusters,
  visibleNodes,
  visibleConnections,
  showCluster,
  showInsight,
  isClustering,
  phase,
  width,
  height,
  className,
}: CanvasViewportProps) {
  const showScanLine = phase === "scanning";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-slate-50",
        "border border-slate-200",
        className,
      )}
      style={{ width, height }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-50"
        style={{ backgroundSize: "20px 20px" }}
      />

      {/* SVG layer for connections */}
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={width}
        height={height}
      >
        <defs>
          {/* Glow filter */}
          <filter
            id="showcase-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn) => (
          <ShowcaseConnection
            key={conn.id}
            connection={conn}
            nodes={nodes}
            isVisible={visibleConnections.includes(conn.id)}
            isClustering={isClustering}
            viewportWidth={width}
            viewportHeight={height}
          />
        ))}
      </svg>

      {/* AI Scan line */}
      {showScanLine && (
        <motion.div
          className="absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: height, opacity: [0, 1, 1, 0] }}
          transition={{
            duration:
              ANIMATION_TIMING.SCANNING_END - ANIMATION_TIMING.SCANNING_START,
            ease: "linear",
          }}
        />
      )}

      {/* Cluster container (rendered behind nodes) */}
      {clusters.map((cluster) => (
        <ShowcaseCluster
          key={cluster.id}
          cluster={cluster}
          isVisible={showCluster}
          viewportWidth={width}
          viewportHeight={height}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <ShowcaseNode
          key={node.id}
          node={node}
          isVisible={visibleNodes.includes(node.id)}
          isClustering={isClustering}
          viewportWidth={width}
          viewportHeight={height}
        />
      ))}

      {/* AI Insight badge */}
      <ShowcaseInsight
        isVisible={showInsight}
        viewportWidth={width}
        viewportHeight={height}
      />

      {/* Fade overlay for reset phase */}
      {phase === "reset" && (
        <motion.div
          className="absolute inset-0 bg-slate-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
}
