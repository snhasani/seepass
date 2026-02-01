"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { type ShowcaseClusterData, SPRING_EASING } from "./animation-config";

interface ShowcaseClusterProps {
  cluster: ShowcaseClusterData;
  isVisible: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function ShowcaseCluster({
  cluster,
  isVisible,
  viewportWidth,
  viewportHeight,
}: ShowcaseClusterProps) {
  const x = cluster.position.x * viewportWidth;
  const y = cluster.position.y * viewportHeight;

  // Cluster container dimensions
  const width = 280;
  const height = 180;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
      }
      transition={{
        duration: 0.5,
        ease: SPRING_EASING as unknown as [number, number, number, number],
      }}
    >
      {/* Cluster background */}
      <div className="absolute inset-0 rounded-2xl border-2 border-indigo-300 border-dashed bg-indigo-50/50" />

      {/* Cluster label */}
      <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700 text-xs">
          <Brain className="size-3" />
          {cluster.label}
        </div>
      </div>
    </motion.div>
  );
}

interface ShowcaseInsightProps {
  isVisible: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function ShowcaseInsight({
  isVisible,
  viewportWidth,
  viewportHeight,
}: ShowcaseInsightProps) {
  const x = viewportWidth * 0.45;
  const y = viewportHeight * 0.35;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: x - 100,
        top: y + 80,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-3 shadow-lg">
        <div className="mb-2 flex items-center gap-1.5">
          <Brain className="size-3.5 text-indigo-600" />
          <span className="font-semibold text-[10px] text-indigo-600 uppercase tracking-wide">
            AI Insight
          </span>
        </div>
        <p className="font-medium text-slate-800 text-xs">
          3 problems share a common root cause
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">
            Navigation
          </span>
          <span>cluster detected</span>
        </div>
      </div>
    </motion.div>
  );
}
