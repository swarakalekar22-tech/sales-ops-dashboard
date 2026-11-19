import { describe, expect, it } from "vitest";
import {
  openDealCount,
  openPipelineValue,
  pctChange,
  shareOfTotal,
  stageConversion,
  weightedOnTimeRate,
  winRate,
} from "@/lib/metrics";
import { kpiMetrics } from "@/data/kpis";
import {
  dealOutcomes,
  operationsStatus,
  pipelineStages,
  regionRevenue,
  revenueTrend,
} from "@/data/mockData";

describe("metric formulas", () => {
  it("pctChange returns the percentage change and guards against zero", () => {
    expect(pctChange(110, 100)).toBeCloseTo(10);
    expect(pctChange(90, 100)).toBeCloseTo(-10);
    expect(pctChange(5, 0)).toBe(0);
  });

  it("winRate = won / (won + lost)", () => {
    expect(winRate(1, 3)).toBeCloseTo(25);
    expect(winRate(0, 0)).toBe(0);
  });

  it("open pipeline excludes closed stages", () => {
    const stages = [
      { stage: "Discovery", deals: 2, value: 100, isOpen: true },
      { stage: "Won", deals: 1, value: 50, isOpen: false },
    ];
    expect(openPipelineValue(stages)).toBe(100);
    expect(openDealCount(stages)).toBe(2);
  });

  it("weightedOnTimeRate weights each day by order volume", () => {
    const points = [
      { day: "Mon", orders: 100, onTime: 90, delayed: 5, atRisk: 5 },
      { day: "Tue", orders: 300, onTime: 80, delayed: 10, atRisk: 10 },
    ];
    // (100*90 + 300*80) / 400 = 82.5, a simple average would give 85
    expect(weightedOnTimeRate(points)).toBeCloseTo(82.5);
  });

  it("stageConversion = next-stage deals / this-stage deals", () => {
    const stages = [
      { stage: "A", deals: 10, value: 0, isOpen: true },
      { stage: "B", deals: 5, value: 0, isOpen: true },
      { stage: "C", deals: 4, value: 0, isOpen: true },
    ];
    const result = stageConversion(stages);
    expect(result).toHaveLength(2);
    expect(result[0].rate).toBeCloseTo(50);
    expect(result[1].rate).toBeCloseTo(80);
  });

  it("shareOfTotal handles a zero total", () => {
    expect(shareOfTotal(25, 100)).toBeCloseTo(25);
    expect(shareOfTotal(5, 0)).toBe(0);
  });
});

describe("dashboard numbers reconcile with the underlying data", () => {
  const kpi = (id: string) => kpiMetrics.find((m) => m.id === id)!;

  it("region revenue adds up to the latest month's revenue", () => {
    const regionTotal = regionRevenue.reduce((s, r) => s + r.revenue, 0);
    const latest = revenueTrend[revenueTrend.length - 1].revenue;
    expect(Math.abs(regionTotal - latest)).toBeLessThanOrEqual(5);
  });

  it("revenue KPI delta matches the chart (Jul vs Jun)", () => {
    const jul = revenueTrend[revenueTrend.length - 1].revenue;
    const jun = revenueTrend[revenueTrend.length - 2].revenue;
    expect(kpi("revenue").deltaPct).toBeCloseTo(((jul - jun) / jun) * 100);
    expect(kpi("revenue").value).toContain("18.45");
  });

  it("open pipeline KPI does not include Closed won", () => {
    expect(kpi("pipeline").value).toContain("60.60");
    expect(kpi("pipeline").insight).toContain(
      String(openDealCount(pipelineStages))
    );
  });

  it("Closed won stage matches this month's won deals", () => {
    const closedWon = pipelineStages.find((s) => s.stage === "Closed won")!;
    const latestWon = dealOutcomes[dealOutcomes.length - 1].won;
    expect(closedWon.deals).toBe(latestWon);
  });

  it("win rate and on-time KPIs show the expected values", () => {
    expect(kpi("win-rate").value).toBe("27.3%");
    expect(kpi("fulfillment").value).toBe("89.8%");
  });

  it("on-time rate sits between the best and worst day", () => {
    const rates = operationsStatus.map((d) => d.onTime);
    const overall = weightedOnTimeRate(operationsStatus);
    expect(overall).toBeGreaterThan(Math.min(...rates));
    expect(overall).toBeLessThan(Math.max(...rates));
  });

  it("each day's order-status shares add up to 100%", () => {
    for (const d of operationsStatus) {
      expect(d.onTime + d.delayed + d.atRisk).toBe(100);
    }
  });
});