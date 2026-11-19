import type { KpiMetric } from "@/types";
import { formatCompactINR } from "@/lib/currency";
import {
  openDealCount,
  openPipelineValue,
  pctChange,
  weightedOnTimeRate,
  winRate,
} from "@/lib/metrics";
import {
  dealOutcomes,
  fulfillmentHistory,
  openPipelineHistory,
  operationsStatus,
  pipelineStages,
  revenueTrend,
} from "@/data/mockData";

export const WIN_RATE_TARGET = 30;

const last = (xs: number[]) => xs[xs.length - 1];
const prev = (xs: number[]) => xs[xs.length - 2];

function trendOf(delta: number): KpiMetric["trend"] {
  if (delta > 0.05) return "up";
  if (delta < -0.05) return "down";
  return "flat";
}

// Revenue
const revenues = revenueTrend.map((p) => p.revenue);
const revenueDelta = pctChange(last(revenues), prev(revenues));
const revenue: KpiMetric = {
  id: "revenue",
  label: "Revenue",
  value: formatCompactINR(last(revenues)),
  deltaPct: revenueDelta,
  trend: trendOf(revenueDelta),
  insight:
    last(revenues) === Math.max(...revenues)
      ? `Highest in the last ${revenues.length} months`
      : "Below the recent peak",
  comparedTo: "vs. last month",
  sparkline: revenues,
  icon: "IndianRupee",
};

// Open pipeline (excludes Closed won)
const openValue = openPipelineValue(pipelineStages);
const pipelineSeries = [...openPipelineHistory, openValue];
const pipelineDelta = pctChange(openValue, last(openPipelineHistory));
const pipeline: KpiMetric = {
  id: "pipeline",
  label: "Open pipeline",
  value: formatCompactINR(openValue),
  deltaPct: pipelineDelta,
  trend: trendOf(pipelineDelta),
  insight: `${openDealCount(pipelineStages)} active opportunities`,
  comparedTo: "vs. last month",
  sparkline: pipelineSeries,
  icon: "Target",
};

// Win rate = won / (won + lost)
const winRates = dealOutcomes.map((d) => winRate(d.won, d.lost));
const currentWinRate = last(winRates);
const winRateDelta = currentWinRate - prev(winRates); // percentage points
const winRateKpi: KpiMetric = {
  id: "win-rate",
  label: "Win rate",
  value: `${currentWinRate.toFixed(1)}%`,
  deltaPct: winRateDelta,
  deltaUnit: " pts",
  trend: trendOf(winRateDelta),
  insight:
    currentWinRate < WIN_RATE_TARGET
      ? `${(WIN_RATE_TARGET - currentWinRate).toFixed(1)} pts below the ${WIN_RATE_TARGET}% target`
      : `Meets the ${WIN_RATE_TARGET}% target`,
  comparedTo: "vs. last month",
  sparkline: winRates,
  icon: "Percent",
};

// On-time fulfillment (volume-weighted)
const onTime = weightedOnTimeRate(operationsStatus);
const onTimeDelta = onTime - last(fulfillmentHistory); // percentage points
const fulfillment: KpiMetric = {
  id: "fulfillment",
  label: "On-time fulfillment",
  value: `${onTime.toFixed(1)}%`,
  deltaPct: onTimeDelta,
  deltaUnit: " pts",
  trend: trendOf(onTimeDelta),
  insight:
    onTime >= Math.max(...fulfillmentHistory)
      ? `Best week in the last ${fulfillmentHistory.length + 1} weeks`
      : "Below the recent best week",
  comparedTo: "vs. last week",
  sparkline: [...fulfillmentHistory, onTime],
  icon: "PackageCheck",
};

export const kpiMetrics: KpiMetric[] = [
  revenue,
  pipeline,
  winRateKpi,
  fulfillment,
];