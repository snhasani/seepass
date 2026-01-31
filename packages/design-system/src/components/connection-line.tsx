"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export interface ConnectionPoint {
  x: number;
  y: number;
}

export interface ConnectionLineProps
  extends React.SVGAttributes<SVGPathElement> {
  from: ConnectionPoint;
  to: ConnectionPoint;
  variant?: "default" | "strong" | "weak" | "ai";
  animated?: boolean;
  label?: string;
  bidirectional?: boolean;
  ref?: React.Ref<SVGPathElement>;
}

function ConnectionLine({
  className,
  from,
  to,
  variant = "default",
  animated = false,
  label,
  bidirectional = false,
  ref,
  ...props
}: ConnectionLineProps) {
    // Calculate control points for a smooth bezier curve
    const midX = (from.x + to.x) / 2;
    const dx = Math.abs(to.x - from.x);
    const controlOffset = Math.min(dx * 0.5, 100);

    const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

    const variantStyles = {
      default: {
        stroke: "var(--ds-teal-400)",
        strokeWidth: 2,
        opacity: 0.6,
      },
      strong: {
        stroke: "var(--ds-teal-500)",
        strokeWidth: 3,
        opacity: 0.8,
      },
      weak: {
        stroke: "var(--border)",
        strokeWidth: 1,
        opacity: 0.4,
        strokeDasharray: "4 4",
      },
      ai: {
        stroke: "var(--ds-violet-400)",
        strokeWidth: 2,
        opacity: 0.7,
      },
    };

    const style = variantStyles[variant];

    // Calculate label position (midpoint of the curve)
    const labelX = midX;
    const labelY = (from.y + to.y) / 2 - 10;

    return (
      <g data-slot="connection-line" className={cn(className)}>
        {/* Connection path */}
        <motion.path
          ref={ref}
          d={path}
          fill="none"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={style.strokeDasharray}
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={{ pathLength: 1, opacity: style.opacity }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          {...props}
        />

        {/* Animated flow indicator */}
        {animated && (
          <motion.circle
            r={4}
            fill={style.stroke}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: `path('${path}')`,
            }}
          />
        )}

        {/* Arrow at end */}
        <motion.polygon
          points="-6,-4 0,0 -6,4"
          fill={style.stroke}
          opacity={style.opacity}
          initial={animated ? { opacity: 0 } : undefined}
          animate={{ opacity: style.opacity }}
          transition={{ delay: 0.4 }}
          style={{
            transform: `translate(${to.x}px, ${to.y}px) rotate(${Math.atan2(to.y - from.y, to.x - from.x)}rad)`,
          }}
        />

        {/* Arrow at start if bidirectional */}
        {bidirectional && (
          <motion.polygon
            points="6,-4 0,0 6,4"
            fill={style.stroke}
            opacity={style.opacity}
            initial={animated ? { opacity: 0 } : undefined}
            animate={{ opacity: style.opacity }}
            transition={{ delay: 0.4 }}
            style={{
              transform: `translate(${from.x}px, ${from.y}px) rotate(${Math.atan2(from.y - to.y, from.x - to.x)}rad)`,
            }}
          />
        )}

        {/* Label */}
        {label && (
          <g transform={`translate(${labelX}, ${labelY})`}>
            <rect
              x={-label.length * 4 - 8}
              y={-10}
              width={label.length * 8 + 16}
              height={20}
              rx={4}
              fill="var(--background)"
              stroke={style.stroke}
              strokeWidth={1}
              opacity={0.9}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="var(--muted-foreground)"
              fontWeight={500}
            >
              {label}
            </text>
          </g>
        )}
      </g>
    );
}

// SVG container for connection lines
interface ConnectionLayerProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactNode;
  ref?: React.Ref<SVGSVGElement>;
}

function ConnectionLayer({
  className,
  children,
  ref,
  ...props
}: ConnectionLayerProps) {
    return (
      <svg
        ref={ref}
        data-slot="connection-layer"
        className={cn(
          "absolute inset-0 pointer-events-none overflow-visible",
          className
        )}
        {...props}
      >
        <defs>
          {/* Glow filter for highlighted connections */}
          <filter id="connection-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {children}
      </svg>
    );
}

export { ConnectionLine, ConnectionLayer };
