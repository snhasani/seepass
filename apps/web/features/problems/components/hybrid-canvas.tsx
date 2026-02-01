"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Minus,
  Plus,
  RotateCcw,
  StickyNote as StickyNoteIcon,
  X,
} from "lucide-react";
import * as React from "react";
import type { Problem } from "../types";

// ============================================================================
// Types & Configuration
// ============================================================================

interface DraftStickyNote {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
}

interface HybridCanvasProps {
  className?: string;
  problems?: Problem[];
}

interface ViewState {
  scale: number;
  offset: { x: number; y: number };
}

interface StickyPosition {
  x: number;
  y: number;
}

interface DragState {
  index: number;
  type: "problem" | "draft";
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface ClusterData {
  id: string;
  label: string;
  problemIds: string[];
  position: { x: number; y: number };
}

interface ConnectionData {
  id: string;
  from: string;
  to: string;
}

// Configuration
const GRID_SIZE = 40;
const MIN_SPACING = 20;
const MAX_SPACING = 80;
const MIN_MINOR_VISIBILITY_RATIO = 0.5;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_SENSITIVITY = 0.002;
const BUTTON_ZOOM_FACTOR = 1.25;

const STICKY_WIDTH = 220;
const STICKY_MIN_HEIGHT = 140;
const STICKY_GAP = 60;
const STICKIES_PER_ROW = 3;
const STICKY_START_X = 120;
const STICKY_START_Y = 120;

// Sticky note colors
const STICKY_COLORS = [
  { bg: "#fef3c7", border: "#fbbf24", shadow: "rgba(251, 191, 36, 0.3)" },
  { bg: "#fce7f3", border: "#f472b6", shadow: "rgba(244, 114, 182, 0.3)" },
  { bg: "#dbeafe", border: "#60a5fa", shadow: "rgba(96, 165, 250, 0.3)" },
  { bg: "#dcfce7", border: "#4ade80", shadow: "rgba(74, 222, 128, 0.3)" },
  { bg: "#fef9c3", border: "#facc15", shadow: "rgba(250, 204, 21, 0.3)" },
  { bg: "#f3e8ff", border: "#c084fc", shadow: "rgba(192, 132, 252, 0.3)" },
];

const SPRING_EASING = [0.34, 1.56, 0.64, 1] as const;

// ============================================================================
// Grid Utilities
// ============================================================================

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

function setupCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  isDark: boolean
) {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);

  ctx.fillStyle = isDark ? "#0f172a" : "#fafafa";
  ctx.fillRect(0, 0, width, height);
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: ViewState,
  isDark: boolean
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

  const minorColor = isDark ? "#334155" : "#e5e7eb";
  const majorColor = isDark ? "#475569" : "#cbd5e1";

  if (minor) drawDots(minor, minorColor, 1);
  drawDots(major, majorColor, 1.5);
}

// ============================================================================
// AI Animation Hook
// ============================================================================

interface AIAnimationState {
  showScanLine: boolean;
  scanLineProgress: number;
  showConnections: boolean;
  showClusters: boolean;
  showInsight: boolean;
  isClustering: boolean;
}

function useAIAnimation(
  problemCount: number,
  trigger: boolean
): AIAnimationState {
  const [state, setState] = React.useState<AIAnimationState>({
    showScanLine: false,
    scanLineProgress: 0,
    showConnections: false,
    showClusters: false,
    showInsight: false,
    isClustering: false,
  });

  React.useEffect(() => {
    if (!trigger || problemCount < 2) {
      setState({
        showScanLine: false,
        scanLineProgress: 0,
        showConnections: false,
        showClusters: false,
        showInsight: false,
        isClustering: false,
      });
      return;
    }

    // Animation sequence
    const timers: NodeJS.Timeout[] = [];

    // Show scan line
    setState((s) => ({ ...s, showScanLine: true }));

    // Animate scan line
    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 0.02;
      if (progress >= 1) {
        clearInterval(scanInterval);
        setState((s) => ({ ...s, showScanLine: false }));
      } else {
        setState((s) => ({ ...s, scanLineProgress: progress }));
      }
    }, 30);

    // Show connections after scan
    timers.push(
      setTimeout(() => {
        setState((s) => ({ ...s, showConnections: true }));
      }, 1500)
    );

    // Show clusters
    timers.push(
      setTimeout(() => {
        setState((s) => ({ ...s, showClusters: true, isClustering: true }));
      }, 2500)
    );

    // Show insight
    timers.push(
      setTimeout(() => {
        setState((s) => ({ ...s, showInsight: true }));
      }, 3500)
    );

    return () => {
      clearInterval(scanInterval);
      timers.forEach(clearTimeout);
    };
  }, [trigger, problemCount]);

  return state;
}

// ============================================================================
// Sub-components
// ============================================================================

interface ProblemStickyNoteProps {
  problem: Problem;
  x: number;
  y: number;
  colorIndex: number;
  isDragging: boolean;
  isClustering: boolean;
  clusterTarget?: { x: number; y: number };
  onDragStart: (e: React.MouseEvent) => void;
}

function ProblemStickyNote({
  problem,
  x,
  y,
  colorIndex,
  isDragging,
  isClustering,
  clusterTarget,
  onDragStart,
}: ProblemStickyNoteProps) {
  const color = STICKY_COLORS[colorIndex % STICKY_COLORS.length];

  const targetX = isClustering && clusterTarget ? clusterTarget.x : x;
  const targetY = isClustering && clusterTarget ? clusterTarget.y : y;

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none",
        isDragging && "z-50 cursor-grabbing"
      )}
      style={{ width: STICKY_WIDTH, minHeight: STICKY_MIN_HEIGHT }}
      initial={{ left: x, top: y, opacity: 0, scale: 0.8 }}
      animate={{
        left: targetX,
        top: targetY,
        opacity: 1,
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{
        left: { duration: isClustering ? 0.8 : 0, ease: SPRING_EASING as any },
        top: { duration: isClustering ? 0.8 : 0, ease: SPRING_EASING as any },
        opacity: { duration: 0.3 },
        scale: { duration: 0.2 },
      }}
      onMouseDown={onDragStart}
    >
      <div
        className={cn(
          "relative w-full rounded-lg p-4 transition-all",
          !isDragging && "hover:scale-[1.02] hover:shadow-xl"
        )}
        style={{
          backgroundColor: color.bg,
          borderLeft: `4px solid ${color.border}`,
          boxShadow: isDragging
            ? `8px 8px 24px ${color.shadow}, 0 4px 12px rgba(0,0,0,0.15)`
            : `4px 4px 16px ${color.shadow}, 0 2px 6px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Paper texture */}
        <div
          className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Fold effect */}
        <div
          className="absolute top-0 right-0 size-6"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color.border}30 50%)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-2">
          <h4 className="font-semibold text-sm leading-snug text-slate-800">
            {problem.title ?? "Untitled Problem"}
          </h4>
          {problem.description && (
            <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
              {problem.description}
            </p>
          )}
          <div className="pt-2 flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                problem.status === "confirmed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {problem.status === "confirmed" ? "✓ Confirmed" : "In Progress"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface DraftStickyNoteComponentProps {
  note: DraftStickyNote;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<DraftStickyNote, "title" | "description">>
  ) => void;
  onDelete: (id: string) => void;
}

function DraftStickyNoteComponent({
  note,
  isDragging,
  onDragStart,
  onUpdate,
  onDelete,
}: DraftStickyNoteComponentProps) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = React.useState(note.title === "");

  React.useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
    onDragStart(e);
  };

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none",
        isDragging && "z-50 cursor-grabbing"
      )}
      style={{
        left: note.x,
        top: note.y,
        width: STICKY_WIDTH,
        minHeight: STICKY_MIN_HEIGHT,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isDragging ? 1.02 : 1 }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={cn(
          "relative w-full rounded-lg p-4 transition-all",
          !isDragging && "hover:shadow-lg"
        )}
        style={{
          backgroundColor: "#f8fafc",
          borderLeft: "4px dashed #94a3b8",
          boxShadow: isDragging
            ? "8px 8px 24px rgba(148, 163, 184, 0.4), 0 4px 12px rgba(0,0,0,0.15)"
            : "4px 4px 16px rgba(148, 163, 184, 0.3), 0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => onDelete(note.id)}
          className="absolute -top-2 -right-2 z-20 flex size-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 shadow-sm transition-colors hover:bg-red-100 hover:text-red-600"
        >
          <X className="size-3.5" />
        </button>

        <div className="relative z-10 flex flex-col gap-2">
          <textarea
            ref={titleRef}
            value={note.title}
            onChange={(e) => onUpdate(note.id, { title: e.target.value })}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            placeholder="What's the problem?"
            className="w-full resize-none border-none bg-transparent p-0 font-semibold text-sm leading-snug text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            rows={2}
          />
          <textarea
            value={note.description}
            onChange={(e) => onUpdate(note.id, { description: e.target.value })}
            placeholder="Add details..."
            className="w-full resize-none border-none bg-transparent p-0 text-xs leading-relaxed text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            rows={3}
          />
          <div className="pt-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Draft
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Connection line between problems
interface ConnectionLineProps {
  from: StickyPosition;
  to: StickyPosition;
  isVisible: boolean;
}

function ConnectionLine({ from, to, isVisible }: ConnectionLineProps) {
  const fromCenter = {
    x: from.x + STICKY_WIDTH / 2,
    y: from.y + STICKY_MIN_HEIGHT / 2,
  };
  const toCenter = {
    x: to.x + STICKY_WIDTH / 2,
    y: to.y + STICKY_MIN_HEIGHT / 2,
  };

  const dx = Math.abs(toCenter.x - fromCenter.x);
  const controlOffset = Math.min(dx * 0.4, 80);

  const path = `M ${fromCenter.x} ${fromCenter.y} C ${fromCenter.x + controlOffset} ${fromCenter.y}, ${toCenter.x - controlOffset} ${toCenter.y}, ${toCenter.x} ${toCenter.y}`;

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke="url(#connectionGradient)"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isVisible
            ? { pathLength: 1, opacity: 0.7 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {isVisible && (
        <motion.circle
          r={4}
          fill="#14b8a6"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.8,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      )}
    </g>
  );
}

// Cluster container
interface ClusterContainerProps {
  cluster: ClusterData;
  isVisible: boolean;
}

function ClusterContainer({ cluster, isVisible }: ClusterContainerProps) {
  const width = 320;
  const height = 280;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: cluster.position.x - width / 2,
        top: cluster.position.y - height / 2,
        width,
        height,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
      }
      transition={{ duration: 0.6, ease: SPRING_EASING as any }}
    >
      <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/30 dark:border-indigo-700 dark:bg-indigo-950/20" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm dark:bg-indigo-900 dark:text-indigo-300">
          <Brain className="size-3.5" />
          {cluster.label}
        </div>
      </div>
    </motion.div>
  );
}

// AI Insight badge
interface AIInsightBadgeProps {
  isVisible: boolean;
  message: string;
  position: { x: number; y: number };
}

function AIInsightBadge({ isVisible, message, position }: AIInsightBadgeProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none absolute z-30"
          style={{ left: position.x, top: position.y }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-xl dark:border-indigo-800 dark:from-indigo-950 dark:to-slate-900">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Brain className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                AI Insight
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Scan line effect
interface ScanLineProps {
  progress: number;
  height: number;
}

function ScanLine({ progress, height }: ScanLineProps) {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
      style={{ top: progress * height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.3 }}
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function HybridCanvas({ className, problems = [] }: HybridCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [viewState, setViewState] = React.useState<ViewState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });
  const [isDark, setIsDark] = React.useState(false);
  const [dragState, setDragState] = React.useState<DragState | null>(null);
  const [draftNotes, setDraftNotes] = React.useState<DraftStickyNote[]>([]);
  const [animationTrigger, setAnimationTrigger] = React.useState(false);

  // AI Animation state
  const aiAnimation = useAIAnimation(problems.length, animationTrigger);

  // Compute initial positions for problems
  const getInitialPositions = React.useCallback(
    (probs: Problem[]): StickyPosition[] =>
      probs.map((_, index) => ({
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

  const [problemPositions, setProblemPositions] = React.useState<
    StickyPosition[]
  >(() => getInitialPositions(problems));

  // Mock clusters based on problems (in real app, AI would determine this)
  const clusters = React.useMemo<ClusterData[]>(() => {
    if (problems.length < 2) return [];
    // Group first 2-3 problems into a cluster for demo
    const clusteredIds = problems
      .slice(0, Math.min(3, problems.length))
      .map((p) => p._id);
    return [
      {
        id: "cluster-1",
        label: "Related Problems",
        problemIds: clusteredIds,
        position: { x: 400, y: 300 },
      },
    ];
  }, [problems]);

  // Mock connections between related problems
  const connections = React.useMemo<ConnectionData[]>(() => {
    if (problems.length < 2) return [];
    const conns: ConnectionData[] = [];
    // Connect sequential problems for demo
    for (let i = 0; i < Math.min(problems.length - 1, 2); i++) {
      conns.push({
        id: `conn-${i}`,
        from: problems[i]._id,
        to: problems[i + 1]._id,
      });
    }
    return conns;
  }, [problems]);

  // Reset positions when problems change
  React.useEffect(() => {
    setProblemPositions(getInitialPositions(problems));
    // Trigger animation when problems load
    if (problems.length > 0) {
      setAnimationTrigger(false);
      setTimeout(() => setAnimationTrigger(true), 500);
    }
  }, [problems, getInitialPositions]);

  // Check dark mode
  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Create draft note
  const createDraftNote = React.useCallback((x: number, y: number) => {
    const newNote: DraftStickyNote = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: "",
      description: "",
      x: x - STICKY_WIDTH / 2,
      y: y - STICKY_MIN_HEIGHT / 2,
    };
    setDraftNotes((prev) => [...prev, newNote]);
  }, []);

  const updateDraftNote = React.useCallback(
    (
      id: string,
      updates: Partial<Pick<DraftStickyNote, "title" | "description">>
    ) => {
      setDraftNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
      );
    },
    []
  );

  const deleteDraftNote = React.useCallback((id: string) => {
    setDraftNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  // Double-click to create new note
  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const canvasX =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const canvasY =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;
      createDraftNote(canvasX, canvasY);
    },
    [viewState, createDraftNote]
  );

  // Drag handlers
  const handleProblemDragStart = React.useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const pos = problemPositions[index];
      if (!pos) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseXInCanvas =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const mouseYInCanvas =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;
      setDragState({
        index,
        type: "problem",
        startX: pos.x,
        startY: pos.y,
        offsetX: mouseXInCanvas - pos.x,
        offsetY: mouseYInCanvas - pos.y,
      });
    },
    [problemPositions, viewState]
  );

  const handleDraftDragStart = React.useCallback(
    (noteId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const noteIndex = draftNotes.findIndex((n) => n.id === noteId);
      const note = draftNotes[noteIndex];
      if (!note) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseXInCanvas =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const mouseYInCanvas =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;
      setDragState({
        index: noteIndex,
        type: "draft",
        startX: note.x,
        startY: note.y,
        offsetX: mouseXInCanvas - note.x,
        offsetY: mouseYInCanvas - note.y,
      });
    },
    [draftNotes, viewState]
  );

  // Drag move/end
  React.useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseXInCanvas =
        (e.clientX - rect.left - viewState.offset.x) / viewState.scale;
      const mouseYInCanvas =
        (e.clientY - rect.top - viewState.offset.y) / viewState.scale;
      const newX = mouseXInCanvas - dragState.offsetX;
      const newY = mouseYInCanvas - dragState.offsetY;

      if (dragState.type === "problem") {
        setProblemPositions((prev) => {
          const updated = [...prev];
          updated[dragState.index] = { x: newX, y: newY };
          return updated;
        });
      } else {
        setDraftNotes((prev) => {
          const updated = [...prev];
          if (updated[dragState.index]) {
            updated[dragState.index] = {
              ...updated[dragState.index],
              x: newX,
              y: newY,
            };
          }
          return updated;
        });
      }
    };

    const handleMouseUp = () => setDragState(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, viewState]);

  // Resize handling
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

  // Draw canvas grid
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setupCanvas(ctx, canvas, isDark);
    drawGrid(ctx, canvas, viewState, isDark);
  }, [viewState, dimensions, isDark]);

  // Zoom helpers
  const zoomAtPoint = React.useCallback(
    (
      newScale: number,
      pointX: number,
      pointY: number,
      currentState: ViewState
    ): ViewState => {
      const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale));
      const scaleFactor = clampedScale / currentState.scale;
      const newOffsetX =
        pointX - (pointX - currentState.offset.x) * scaleFactor;
      const newOffsetY =
        pointY - (pointY - currentState.offset.y) * scaleFactor;
      return { scale: clampedScale, offset: { x: newOffsetX, y: newOffsetY } };
    },
    []
  );

  // Wheel zoom/pan
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomDelta = -e.deltaY * ZOOM_SENSITIVITY;
        setViewState((prev) => {
          const newScale = prev.scale * Math.exp(zoomDelta);
          return zoomAtPoint(newScale, mouseX, mouseY, prev);
        });
      } else {
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
  const handleResetView = () =>
    setViewState({ scale: 1, offset: { x: 0, y: 0 } });

  const zoomPercent = Math.round(viewState.scale * 100);

  // Get cluster targets for problems
  const getClusterTarget = React.useCallback(
    (problemId: string): { x: number; y: number } | undefined => {
      if (!aiAnimation.isClustering) return undefined;
      const cluster = clusters.find((c) => c.problemIds.includes(problemId));
      if (!cluster) return undefined;
      const indexInCluster = cluster.problemIds.indexOf(problemId);
      // Arrange in a small grid within cluster
      const offsetX = (indexInCluster % 2) * (STICKY_WIDTH + 20) - STICKY_WIDTH;
      const offsetY =
        Math.floor(indexInCluster / 2) * (STICKY_MIN_HEIGHT + 20) - 40;
      return {
        x: cluster.position.x + offsetX,
        y: cluster.position.y + offsetY,
      };
    },
    [aiAnimation.isClustering, clusters]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl",
        "bg-slate-50 dark:bg-slate-900",
        "border border-slate-200 dark:border-slate-800",
        className
      )}
    >
      {/* Canvas grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
        onDoubleClick={handleDoubleClick}
      />

      {/* SVG layer for connections */}
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          transform: `translate(${viewState.offset.x}px, ${viewState.offset.y}px) scale(${viewState.scale})`,
          transformOrigin: "0 0",
        }}
      >
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {connections.map((conn) => {
          const fromIdx = problems.findIndex((p) => p._id === conn.from);
          const toIdx = problems.findIndex((p) => p._id === conn.to);
          const from = problemPositions[fromIdx];
          const to = problemPositions[toIdx];
          if (!from || !to) return null;
          return (
            <ConnectionLine
              key={conn.id}
              from={from}
              to={to}
              isVisible={aiAnimation.showConnections}
            />
          );
        })}
      </svg>

      {/* AI Scan line */}
      {aiAnimation.showScanLine && (
        <ScanLine
          progress={aiAnimation.scanLineProgress}
          height={dimensions.height}
        />
      )}

      {/* Content layer with transform */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${viewState.offset.x}px, ${viewState.offset.y}px) scale(${viewState.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Cluster containers */}
        {clusters.map((cluster) => (
          <ClusterContainer
            key={cluster.id}
            cluster={cluster}
            isVisible={aiAnimation.showClusters}
          />
        ))}

        {/* Problem sticky notes */}
        {problems.map((problem, index) => {
          const pos = problemPositions[index];
          if (!pos) return null;
          return (
            <ProblemStickyNote
              key={problem._id}
              problem={problem}
              x={pos.x}
              y={pos.y}
              colorIndex={index}
              isDragging={
                dragState?.type === "problem" && dragState?.index === index
              }
              isClustering={aiAnimation.isClustering}
              clusterTarget={getClusterTarget(problem._id)}
              onDragStart={(e) => handleProblemDragStart(index, e)}
            />
          );
        })}

        {/* Draft sticky notes */}
        {draftNotes.map((note, index) => (
          <DraftStickyNoteComponent
            key={note.id}
            note={note}
            isDragging={
              dragState?.type === "draft" && dragState?.index === index
            }
            onDragStart={(e) => handleDraftDragStart(note.id, e)}
            onUpdate={updateDraftNote}
            onDelete={deleteDraftNote}
          />
        ))}
      </div>

      {/* AI Insight badge */}
      <AIInsightBadge
        isVisible={aiAnimation.showInsight && problems.length >= 2}
        message={`${Math.min(problems.length, 3)} problems may share a common root cause`}
        position={{ x: 400, y: 420 }}
      />

      {/* Empty state */}
      {problems.length === 0 && draftNotes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 pointer-events-auto">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <StickyNoteIcon className="size-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Workshop Canvas
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Double-click anywhere to add a note, or use the Discover tab to
                identify problems with AI
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Button
          onClick={() => {
            const centerX =
              (dimensions.width / 2 - viewState.offset.x) / viewState.scale;
            const centerY =
              (dimensions.height / 2 - viewState.offset.y) / viewState.scale;
            createDraftNote(centerX, centerY);
          }}
          size="sm"
          variant="secondary"
          className="gap-2 shadow-md"
        >
          <StickyNoteIcon className="size-4" />
          Add Note
        </Button>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-md backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={handleZoomOut}
          disabled={viewState.scale <= MIN_ZOOM}
        >
          <Minus className="size-4" />
        </Button>
        <button
          onClick={handleResetView}
          className="min-w-[3.5rem] px-2 py-1 text-xs font-medium hover:bg-accent rounded transition-colors"
        >
          {zoomPercent}%
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={handleZoomIn}
          disabled={viewState.scale >= MAX_ZOOM}
        >
          <Plus className="size-4" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={handleResetView}
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>

      {/* Canvas info */}
      <div className="absolute bottom-4 right-4 rounded-lg border bg-background/95 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm">
        <span className="font-medium">{problems.length}</span> problems •{" "}
        <span className="font-medium">{draftNotes.length}</span> drafts
      </div>
    </div>
  );
}
