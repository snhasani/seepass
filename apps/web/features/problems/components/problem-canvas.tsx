"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Minus, Plus, RotateCcw } from "lucide-react";
import * as React from "react";
import type { Problem } from "../types";

interface ProblemCanvasProps {
  className?: string;
  scheduledProblems?: Problem[];
}

// Grid configuration
const GRID_SIZE = 40;
const MIN_SPACING = 20;
const MAX_SPACING = 80;
const MIN_MINOR_VISIBILITY_RATIO = 0.5;

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_SENSITIVITY = 0.002;
const BUTTON_ZOOM_FACTOR = 1.25;

interface ViewState {
  scale: number;
  offset: { x: number; y: number };
}

interface Grid {
  major: number;
  minor: number | null;
}

const wrapOffset = (offset: number, step: number) =>
  ((-offset % step) + step) % step;

function computeStep(scale: number): Grid {
  let step = GRID_SIZE * scale;
  while (step < MIN_SPACING) step *= 2;
  while (step > MAX_SPACING) step /= 2;
  const minor = step / 2;
  return {
    major: step,
    minor: minor >= MIN_SPACING * MIN_MINOR_VISIBILITY_RATIO ? minor : null,
  };
}

function setupCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: ViewState
) {
  const { width, height } = canvas.getBoundingClientRect();
  const { major, minor } = computeStep(state.scale);

  const drawDots = (step: number, color: string, size: number) => {
    const startX = wrapOffset(-state.offset.x, step);
    const startY = wrapOffset(-state.offset.y, step);
    ctx.fillStyle = color;
    for (let x = startX; x <= width; x += step) {
      for (let y = startY; y <= height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  if (minor) drawDots(minor, "#e5e7eb", 1);
  drawDots(major, "#cbd5e1", 1.5);
}

// Sticky note colors - warm, pastel palette
const STICKY_COLORS = [
  { bg: "#fef3c7", border: "#fbbf24", shadow: "rgba(251, 191, 36, 0.3)" }, // amber
  { bg: "#fce7f3", border: "#f472b6", shadow: "rgba(244, 114, 182, 0.3)" }, // pink
  { bg: "#dbeafe", border: "#60a5fa", shadow: "rgba(96, 165, 250, 0.3)" }, // blue
  { bg: "#dcfce7", border: "#4ade80", shadow: "rgba(74, 222, 128, 0.3)" }, // green
  { bg: "#fef9c3", border: "#facc15", shadow: "rgba(250, 204, 21, 0.3)" }, // yellow
  { bg: "#f3e8ff", border: "#c084fc", shadow: "rgba(192, 132, 252, 0.3)" }, // purple
];

const STICKY_WIDTH = 200;
const STICKY_MIN_HEIGHT = 160;
const STICKY_GAP = 40;
const STICKIES_PER_ROW = 4;
const STICKY_START_X = 100;
const STICKY_START_Y = 100;

interface StickyNoteProps {
  problem: Problem;
  x: number;
  y: number;
  colorIndex: number;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
}

function StickyNote({
  problem,
  x,
  y,
  colorIndex,
  isDragging,
  onDragStart,
}: StickyNoteProps) {
  const color = STICKY_COLORS[colorIndex % STICKY_COLORS.length];

  return (
    <div
      className={cn(
        "absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none",
        isDragging && "z-50 cursor-grabbing"
      )}
      style={{
        left: x,
        top: y,
        width: STICKY_WIDTH,
        minHeight: STICKY_MIN_HEIGHT,
      }}
      onMouseDown={onDragStart}
    >
      <div
        className={cn(
          "relative w-full rounded-sm p-4 transition-all",
          !isDragging && "hover:scale-105 hover:shadow-lg"
        )}
        style={{
          backgroundColor: color.bg,
          borderLeft: `4px solid ${color.border}`,
          boxShadow: isDragging
            ? `8px 8px 20px ${color.shadow}, 0 4px 8px rgba(0,0,0,0.15)`
            : `4px 4px 12px ${color.shadow}, 0 2px 4px rgba(0,0,0,0.08)`,
          transform: isDragging ? "scale(1.02)" : undefined,
        }}
      >
        {/* Paper texture effect */}
        <div
          className="absolute inset-0 rounded-sm opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Fold effect in corner */}
        <div
          className="absolute top-0 right-0 size-5"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color.border}30 50%)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-2">
          <h4
            className="font-medium text-sm leading-snug"
            style={{ color: "#1f2937" }}
          >
            {problem.title ?? "Untitled"}
          </h4>
          {problem.description && (
            <p
              className="text-xs leading-relaxed opacity-80"
              style={{ color: "#374151" }}
            >
              {problem.description}
            </p>
          )}
          <div className="pt-1">
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${color.border}30`,
                color: "#374151",
              }}
            >
              {problem.status === "confirmed" ? "✓ Confirmed" : "In progress"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StickyPosition {
  x: number;
  y: number;
}

interface DragState {
  index: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export function ProblemCanvas({
  className,
  scheduledProblems = [],
}: ProblemCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [viewState, setViewState] = React.useState<ViewState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });

  // Sticky note positions (initialized from grid layout, then user can drag)
  const [dragState, setDragState] = React.useState<DragState | null>(null);

  // Compute initial positions for sticky notes
  const getInitialPositions = React.useCallback(
    (problems: Problem[]): StickyPosition[] =>
      problems.map((_, index) => ({
        x:
          STICKY_START_X +
          (index % STICKIES_PER_ROW) * (STICKY_WIDTH + STICKY_GAP),
        y:
          STICKY_START_Y +
          Math.floor(index / STICKIES_PER_ROW) *
            (STICKY_MIN_HEIGHT + STICKY_GAP + 40),
      })),
    []
  );

  const [stickyPositions, setStickyPositions] = React.useState<
    StickyPosition[]
  >(() => getInitialPositions(scheduledProblems));

  // Reset positions when problems change
  React.useEffect(() => {
    setStickyPositions(getInitialPositions(scheduledProblems));
  }, [scheduledProblems, getInitialPositions]);

  // Handle drag start
  const handleDragStart = React.useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const pos = stickyPositions[index];
      if (!pos) return;

      // Calculate offset from the sticky note's top-left corner
      // Account for canvas transform (scale and offset)
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseXInCanvas =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const mouseYInCanvas =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;

      setDragState({
        index,
        startX: pos.x,
        startY: pos.y,
        offsetX: mouseXInCanvas - pos.x,
        offsetY: mouseYInCanvas - pos.y,
      });
    },
    [stickyPositions, viewState]
  );

  // Handle drag move and end
  React.useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Convert mouse position to canvas coordinates
      const mouseXInCanvas =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const mouseYInCanvas =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;

      const newX = mouseXInCanvas - dragState.offsetX;
      const newY = mouseYInCanvas - dragState.offsetY;

      setStickyPositions((prev) => {
        const updated = [...prev];
        updated[dragState.index] = { x: newX, y: newY };
        return updated;
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, viewState]);

  // Update dimensions on resize
  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Draw canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setupCanvas(ctx, canvas);
    drawGrid(ctx, canvas, viewState);
  }, [viewState, dimensions]);

  // Zoom from center helper
  const zoomAtPoint = React.useCallback(
    (
      newScale: number,
      pointX: number,
      pointY: number,
      currentState: ViewState
    ): ViewState => {
      const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale));
      const scaleFactor = clampedScale / currentState.scale;

      // Adjust offset to zoom toward the point
      const newOffsetX =
        pointX - (pointX - currentState.offset.x) * scaleFactor;
      const newOffsetY =
        pointY - (pointY - currentState.offset.y) * scaleFactor;

      return {
        scale: clampedScale,
        offset: { x: newOffsetX, y: newOffsetY },
      };
    },
    []
  );

  // Handle mouse wheel zoom (zoom toward cursor) and panning
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom toward cursor with smooth scaling
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Use exponential scaling for smooth zoom feel
        const zoomDelta = -e.deltaY * ZOOM_SENSITIVITY;
        setViewState((prev) => {
          const newScale = prev.scale * Math.exp(zoomDelta);
          return zoomAtPoint(newScale, mouseX, mouseY, prev);
        });
      } else {
        // Smooth pan with scroll
        setViewState((prev) => ({
          ...prev,
          offset: {
            x: prev.offset.x - e.deltaX,
            y: prev.offset.y - e.deltaY,
          },
        }));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomAtPoint]);

  // Zoom from center (for button controls)
  const zoomFromCenter = React.useCallback(
    (factor: number) => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      setViewState((prev) =>
        zoomAtPoint(prev.scale * factor, centerX, centerY, prev)
      );
    },
    [dimensions, zoomAtPoint]
  );

  const handleZoomIn = () => zoomFromCenter(BUTTON_ZOOM_FACTOR);
  const handleZoomOut = () => zoomFromCenter(1 / BUTTON_ZOOM_FACTOR);

  const handleResetView = () => {
    setViewState({ scale: 1, offset: { x: 0, y: 0 } });
  };

  const zoomPercent = Math.round(viewState.scale * 100);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl",
        "bg-white dark:bg-slate-900",
        "border border-slate-200 dark:border-slate-800",
        className
      )}
    >
      {/* Canvas for grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Content layer with transform */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${viewState.offset.x}px, ${viewState.offset.y}px) scale(${viewState.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Sticky notes for scheduled problems */}
        {scheduledProblems.map((problem, index) => {
          const pos = stickyPositions[index];
          if (!pos) return null;
          return (
            <StickyNote
              key={problem._id}
              problem={problem}
              x={pos.x}
              y={pos.y}
              colorIndex={index}
              isDragging={dragState?.index === index}
              onDragStart={(e) => handleDragStart(index, e)}
            />
          );
        })}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomOut}
          disabled={viewState.scale <= MIN_ZOOM}
          title="Zoom out"
        >
          <Minus className="size-4" />
        </Button>
        <button
          onClick={handleResetView}
          className="min-w-[3.5rem] px-2 py-1 text-xs font-medium hover:bg-accent rounded transition-colors"
          title="Reset view (100%)"
        >
          {zoomPercent}%
        </button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomIn}
          disabled={viewState.scale >= MAX_ZOOM}
          title="Zoom in"
        >
          <Plus className="size-4" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleResetView}
          title="Reset view"
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>

      {/* Canvas info */}
      <div className="absolute bottom-3 right-3 rounded-lg border bg-background/95 px-2 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
        {dimensions.width} × {dimensions.height}
      </div>
    </div>
  );
}
