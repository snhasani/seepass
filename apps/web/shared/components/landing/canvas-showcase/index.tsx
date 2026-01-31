"use client";

import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { CanvasViewport } from "./canvas-viewport";
import { useShowcaseAnimation } from "./use-showcase-animation";
import {
  SHOWCASE_NODES,
  SHOWCASE_NODES_MOBILE,
  SHOWCASE_CONNECTIONS,
  SHOWCASE_CONNECTIONS_MOBILE,
  SHOWCASE_CLUSTERS,
  VIEWPORT_DIMENSIONS,
} from "./animation-config";

export function CanvasShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle responsive viewport
  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setViewport("mobile");
    } else if (width < 1024) {
      setViewport("tablet");
    } else {
      setViewport("desktop");
    }
  }, []);

  useEffect(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateViewport]);

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Get data based on viewport
  const nodes = viewport === "mobile" ? SHOWCASE_NODES_MOBILE : SHOWCASE_NODES;
  const connections =
    viewport === "mobile" ? SHOWCASE_CONNECTIONS_MOBILE : SHOWCASE_CONNECTIONS;
  const dimensions = VIEWPORT_DIMENSIONS[viewport];

  // Animation state
  const animationState = useShowcaseAnimation({
    nodes,
    connections,
    isVisible,
    reducedMotion,
  });

  return (
    <div
      ref={containerRef}
      className="flex justify-center"
    >
      <CanvasViewport
        nodes={nodes}
        connections={connections}
        clusters={SHOWCASE_CLUSTERS}
        visibleNodes={animationState.visibleNodes}
        visibleConnections={animationState.visibleConnections}
        showCluster={animationState.showCluster}
        showInsight={animationState.showInsight}
        isClustering={animationState.isClustering}
        phase={animationState.phase}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full max-w-[800px]"
      />
    </div>
  );
}
