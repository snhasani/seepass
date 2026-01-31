"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Minus, Plus, RotateCcw } from "lucide-react";
import * as React from "react";

interface ProblemCanvasProps {
  className?: string;
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

export function ProblemCanvas({ className }: ProblemCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [viewState, setViewState] = React.useState<ViewState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });

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
        {/* Placeholder - will be replaced with actual nodes */}
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
