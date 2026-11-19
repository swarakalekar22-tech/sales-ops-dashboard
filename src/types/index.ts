export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  deltaPct: number;
  /** Unit shown after the delta. Defaults to "%". Use " pts" for rate metrics. */
  deltaUnit?: "%" | " pts";
  trend: "up" | "down" | "flat";
  /** Short contextual insight, e.g. "Highest value this quarter" */
  insight: string;
  /** Compare-to period shown alongside the delta, e.g. "vs. last month" */
  comparedTo: string;
  /** Recent trend series powering the inline sparkline */
  sparkline: number[];
  icon: "IndianRupee" | "Target" | "Percent" | "PackageCheck";
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
}

export interface PipelineStage {
  stage: string;
  deals: number;
  value: number;
  /** false for closed stages, which must not count toward open pipeline */
  isOpen: boolean;
}

export interface OperationsStatusPoint {
  day: string;
  orders: number;
  onTime: number;
  delayed: number;
  atRisk: number;
}

export interface DealOutcomePoint {
  month: string;
  won: number;
  lost: number;
}

export interface Insight {
  id: string;
  title: string;
  detail: string;
}

export type OrderStatus = "fulfilled" | "processing" | "delayed" | "at_risk";

export interface RecentOrder {
  id: string;
  account: string;
  owner: string;
  amount: number;
  status: OrderStatus;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  to: string;
  icon: string;
}