import type { Insight } from "@/types";
import { shareOfTotal, stageConversion, sum } from "@/lib/metrics";
import { WIN_RATE_TARGET, kpiMetrics } from "@/data/kpis";
import { operationsStatus, pipelineStages, regionRevenue } from "@/data/mockData";

const pct = (n: number) => `${Math.round(n)}%`;

// 1. Regional concentration
const byRegion = [...regionRevenue].sort((a, b) => b.revenue - a.revenue);
const totalRegional = sum(regionRevenue.map((r) => r.revenue));
const topTwo = byRegion.slice(0, 2);
const topTwoShare = shareOfTotal(sum(topTwo.map((r) => r.revenue)), totalRegional);

// 2. Weakest fulfillment day
const worstDay = operationsStatus.reduce((min, d) => (d.onTime < min.onTime ? d : min));

// 3. Biggest funnel drop-off
const conversions = stageConversion(pipelineStages);
const worstStep = conversions.reduce((min, c) => (c.rate < min.rate ? c : min));

// 4. Win rate vs target
const winRateKpi = kpiMetrics.find((m) => m.id === "win-rate")!;

export const insights: Insight[] = [
  {
    id: "region",
    title: `${topTwo[0].region} and ${topTwo[1].region} drive ${pct(topTwoShare)} of revenue`,
    detail:
      "Revenue is concentrated in two regions. Growth in the other three is the main diversification lever.",
  },
  {
    id: "ops",
    title: `${worstDay.day} has the lowest on-time rate (${worstDay.onTime}%)`,
    detail: `${worstDay.delayed}% of orders were delayed and ${worstDay.atRisk}% at risk. Check mid-week capacity.`,
  },
  {
    id: "funnel",
    title: `Biggest funnel drop: ${worstStep.from} → ${worstStep.to} (${pct(worstStep.rate)} advance)`,
    detail:
      "Tightening qualification criteria at this step could improve downstream conversion.",
  },
  {
    id: "win-rate",
    title: `Win rate is ${winRateKpi.value} against a ${WIN_RATE_TARGET}% target`,
    detail: winRateKpi.insight,
  },
];