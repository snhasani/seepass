import type { Surface } from "./config";

export interface BaselineRanges {
  error_rate: [number, number];
  dropoff_rate: [number, number];
  ticket_rate: [number, number];
}

export const BASELINE_RANGES: Record<Surface, BaselineRanges> = {
  "/checkout": {
    error_rate: [0.003, 0.015],
    dropoff_rate: [0.65, 0.80],
    ticket_rate: [0.0008, 0.004],
  },
  "/pdp": {
    error_rate: [0.002, 0.012],
    dropoff_rate: [0.35, 0.60],
    ticket_rate: [0.0002, 0.0012],
  },
  "/cart": {
    error_rate: [0.002, 0.010],
    dropoff_rate: [0.45, 0.70],
    ticket_rate: [0.0003, 0.0015],
  },
  "/payment": {
    error_rate: [0.003, 0.012],
    dropoff_rate: [0.65, 0.80],
    ticket_rate: [0.001, 0.004],
  },
  "/shipping": {
    error_rate: [0.002, 0.010],
    dropoff_rate: [0.65, 0.80],
    ticket_rate: [0.001, 0.004],
  },
  "/order-confirm": {
    error_rate: [0.002, 0.010],
    dropoff_rate: [0.65, 0.80],
    ticket_rate: [0.001, 0.004],
  },
  "/search": {
    error_rate: [0.001, 0.006],
    dropoff_rate: [0.40, 0.65],
    ticket_rate: [0.0001, 0.0008],
  },
};

export function getSigma(baseline: number, signalType: "error_rate" | "dropoff_rate" | "ticket_rate"): number {
  switch (signalType) {
    case "error_rate":
      return baseline * 0.25;
    case "dropoff_rate":
      return baseline * 0.10;
    case "ticket_rate":
      return baseline * 0.30;
  }
}

export function calculateZ(current: number, baseline: number, sigma: number): number {
  return (current - baseline) / sigma;
}

export function calculateDeltaPct(current: number, baseline: number): number {
  return ((current - baseline) / baseline) * 100;
}
