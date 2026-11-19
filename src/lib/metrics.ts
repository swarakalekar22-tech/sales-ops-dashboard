import type { OperationsStatusPoint, PipelineStage } from "@/types";

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** % change from prev to curr. Returns 0 when prev is 0. */
export function pctChange(curr: number, prev: number): number {
  return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
}

/** Win rate = won / (won + lost), as a percentage. */
export function winRate(won: number, lost: number): number {
  const closed = won + lost;
  return closed === 0 ? 0 : (won / closed) * 100;
}

/** Open pipeline excludes closed stages (e.g. Closed won). */
export function openPipelineValue(stages: PipelineStage[]): number {
  return sum(stages.filter((s) => s.isOpen).map((s) => s.value));
}

export function openDealCount(stages: PipelineStage[]): number {
  return sum(stages.filter((s) => s.isOpen).map((s) => s.deals));
}

/** On-time % weighted by order volume (a busy day counts for more). */
export function weightedOnTimeRate(points: OperationsStatusPoint[]): number {
  const orders = sum(points.map((p) => p.orders));
  if (orders === 0) return 0;
  return sum(points.map((p) => p.orders * p.onTime)) / orders;
}

/**
 * Stage-to-stage advance rate: deals in the next stage / deals in this one.
 * Note: this treats a snapshot as if it were a cohort, which is a
 * simplification. A real funnel analysis tracks the same deals over time.
 */
export function stageConversion(stages: PipelineStage[]) {
  return stages.slice(0, -1).map((stage, i) => ({
    from: stage.stage,
    to: stages[i + 1].stage,
    rate: stage.deals === 0 ? 0 : (stages[i + 1].deals / stage.deals) * 100,
  }));
}

export function shareOfTotal(part: number, total: number): number {
  return total === 0 ? 0 : (part / total) * 100;
}