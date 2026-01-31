"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ANIMATION_TIMING,
  type AnimationPhase,
  type ShowcaseNodeData,
  type ShowcaseConnectionData,
} from "./animation-config";

interface AnimationState {
  phase: AnimationPhase;
  elapsedTime: number;
  visibleNodes: string[];
  visibleConnections: string[];
  showCluster: boolean;
  showInsight: boolean;
  isClustering: boolean;
}

interface UseShowcaseAnimationOptions {
  nodes: ShowcaseNodeData[];
  connections: ShowcaseConnectionData[];
  isVisible: boolean;
  reducedMotion: boolean;
}

export function useShowcaseAnimation({
  nodes,
  connections,
  isVisible,
  reducedMotion,
}: UseShowcaseAnimationOptions): AnimationState {
  const [state, setState] = useState<AnimationState>({
    phase: "idle",
    elapsedTime: 0,
    visibleNodes: [],
    visibleConnections: [],
    showCluster: false,
    showInsight: false,
    isClustering: false,
  });

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  // If reduced motion, show final static state
  const getReducedMotionState = useCallback((): AnimationState => {
    return {
      phase: "hold",
      elapsedTime: ANIMATION_TIMING.HOLD_START,
      visibleNodes: nodes.map((n) => n.id),
      visibleConnections: connections.map((c) => c.id),
      showCluster: true,
      showInsight: true,
      isClustering: true,
    };
  }, [nodes, connections]);

  // Calculate animation state based on elapsed time
  const calculateState = useCallback(
    (elapsed: number): AnimationState => {
      const t = elapsed % ANIMATION_TIMING.TOTAL_DURATION;

      // Determine phase
      let phase: AnimationPhase = "idle";
      if (t >= ANIMATION_TIMING.RESET_START) {
        phase = "reset";
      } else if (t >= ANIMATION_TIMING.HOLD_START) {
        phase = "hold";
      } else if (t >= ANIMATION_TIMING.INSIGHT_START) {
        phase = "insight";
      } else if (t >= ANIMATION_TIMING.CLUSTERING_START) {
        phase = "clustering";
      } else if (t >= ANIMATION_TIMING.CONNECTIONS_START) {
        phase = "connections";
      } else if (t >= ANIMATION_TIMING.SCANNING_START) {
        phase = "scanning";
      } else if (t >= ANIMATION_TIMING.PROBLEMS_START) {
        phase = "problems";
      }

      // Calculate visible nodes (staggered appearance)
      const visibleNodes: string[] = [];
      if (t >= ANIMATION_TIMING.PROBLEMS_START) {
        nodes.forEach((node, index) => {
          const nodeAppearTime =
            ANIMATION_TIMING.PROBLEMS_START +
            index * ANIMATION_TIMING.PROBLEMS_STAGGER;
          if (t >= nodeAppearTime) {
            visibleNodes.push(node.id);
          }
        });
      }

      // Calculate visible connections (staggered appearance)
      const visibleConnections: string[] = [];
      if (t >= ANIMATION_TIMING.CONNECTIONS_START) {
        connections.forEach((conn, index) => {
          const connAppearTime =
            ANIMATION_TIMING.CONNECTIONS_START +
            index * ANIMATION_TIMING.CONNECTIONS_STAGGER;
          if (t >= connAppearTime) {
            visibleConnections.push(conn.id);
          }
        });
      }

      // Cluster and insight visibility
      const showCluster = t >= ANIMATION_TIMING.CLUSTERING_START;
      const isClustering =
        t >= ANIMATION_TIMING.CLUSTERING_START &&
        t < ANIMATION_TIMING.INSIGHT_END;
      const showInsight = t >= ANIMATION_TIMING.INSIGHT_START;

      // Handle reset phase - fade out
      if (phase === "reset") {
        const resetProgress =
          (t - ANIMATION_TIMING.RESET_START) /
          (ANIMATION_TIMING.RESET_END - ANIMATION_TIMING.RESET_START);
        if (resetProgress > 0.5) {
          return {
            phase: "reset",
            elapsedTime: t,
            visibleNodes: [],
            visibleConnections: [],
            showCluster: false,
            showInsight: false,
            isClustering: false,
          };
        }
      }

      return {
        phase,
        elapsedTime: t,
        visibleNodes,
        visibleConnections,
        showCluster,
        showInsight,
        isClustering,
      };
    },
    [nodes, connections]
  );

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000; // Convert to seconds
      setState(calculateState(elapsed));

      animationRef.current = requestAnimationFrame(animate);
    },
    [calculateState]
  );

  // Start/stop animation based on visibility
  useEffect(() => {
    if (reducedMotion) {
      setState(getReducedMotionState());
      return;
    }

    if (isVisible) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setState({
        phase: "idle",
        elapsedTime: 0,
        visibleNodes: [],
        visibleConnections: [],
        showCluster: false,
        showInsight: false,
        isClustering: false,
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, reducedMotion, animate, getReducedMotionState]);

  return state;
}
