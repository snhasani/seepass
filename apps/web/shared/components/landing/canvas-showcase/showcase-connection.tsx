"use client";

import { motion } from "framer-motion";
import {
  type ShowcaseConnectionData,
  type ShowcaseNodeData,
} from "./animation-config";

interface ShowcaseConnectionProps {
  connection: ShowcaseConnectionData;
  nodes: ShowcaseNodeData[];
  isVisible: boolean;
  isClustering: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function ShowcaseConnection({
  connection,
  nodes,
  isVisible,
  isClustering,
  viewportWidth,
  viewportHeight,
}: ShowcaseConnectionProps) {
  const fromNode = nodes.find((n) => n.id === connection.from);
  const toNode = nodes.find((n) => n.id === connection.to);

  if (!fromNode || !toNode) return null;

  // Get positions based on clustering state
  const getPosition = (node: ShowcaseNodeData) => {
    const pos =
      isClustering && node.clusteredPosition
        ? node.clusteredPosition
        : node.initialPosition;
    return {
      x: pos.x * viewportWidth,
      y: pos.y * viewportHeight,
    };
  };

  const from = getPosition(fromNode);
  const to = getPosition(toNode);

  // Calculate bezier curve (from connection-line.tsx)
  const dx = Math.abs(to.x - from.x);
  const controlOffset = Math.min(dx * 0.5, 100);

  const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

  return (
    <g>
      {/* Main connection path */}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--ds-teal-400)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isVisible
            ? { pathLength: 1, opacity: 0.6 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Animated flowing particle */}
      {isVisible && (
        <motion.circle
          r={4}
          fill="var(--ds-teal-400)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.6,
          }}
          style={{
            offsetPath: `path('${path}')`,
          }}
        />
      )}
    </g>
  );
}
