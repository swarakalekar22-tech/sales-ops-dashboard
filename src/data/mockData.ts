import type {
  DealOutcomePoint,
  OperationsStatusPoint,
  PipelineStage,
  RecentOrder,
  RegionRevenue,
  RevenueTrendPoint,
} from "@/types";

// Mock data for PulseGrid, a fictional consumer goods
// distribution company operating across India.
// KPIs are NOT stored here. They are computed in src/data/kpis.ts.

// Raw rupee values, formatted with Lakh/Crore suffixes at render time.
export const revenueTrend: RevenueTrendPoint[] = [
  { month: "Feb", revenue: 112000000, target: 120000000 },
  { month: "Mar", revenue: 126500000, target: 125000000 },
  { month: "Apr", revenue: 118500000, target: 130000000 },
  { month: "May", revenue: 139000000, target: 135000000 },
  { month: "Jun", revenue: 151500000, target: 140000000 },
  { month: "Jul", revenue: 184500000, target: 160000000 },
];

// Regional split of the LATEST month's revenue, so it reconciles with the
// revenue KPI. Shares sum to 1.
const REGION_SHARES = [
  ["West India", 0.31],
  ["North India", 0.28],
  ["South India", 0.21],
  ["East India", 0.12],
  ["Central India", 0.08],
] as const;

const latestRevenue = revenueTrend[revenueTrend.length - 1].revenue;

export const regionRevenue: RegionRevenue[] = REGION_SHARES.map(
  ([region, share]) => ({ region, revenue: Math.round(latestRevenue * share) })
);

export const pipelineStages: PipelineStage[] = [
  { stage: "Discovery", deals: 64, value: 214000000, isOpen: true },
  { stage: "Qualified", deals: 41, value: 178000000, isOpen: true },
  { stage: "Proposal", deals: 22, value: 136000000, isOpen: true },
  { stage: "Negotiation", deals: 13, value: 78000000, isOpen: true },
  { stage: "Closed won", deals: 9, value: 36000000, isOpen: false },
];

// Open pipeline value (₹) at the end of each of the previous 5 months.
// The current month is computed from pipelineStages.
export const openPipelineHistory: number[] = [
  520000000, 548000000, 561000000, 574000000, 582000000,
];

// Closed deals per month. Latest month's "won" matches the Closed won stage.
export const dealOutcomes: DealOutcomePoint[] = [
  { month: "Feb", won: 8, lost: 20 },
  { month: "Mar", won: 10, lost: 22 },
  { month: "Apr", won: 9, lost: 23 },
  { month: "May", won: 11, lost: 26 },
  { month: "Jun", won: 10, lost: 24 },
  { month: "Jul", won: 9, lost: 24 },
];

// Last 7 days. `orders` lets us compute a volume-weighted on-time rate.
export const operationsStatus: OperationsStatusPoint[] = [
  { day: "Mon", orders: 420, onTime: 86, delayed: 10, atRisk: 4 },
  { day: "Tue", orders: 435, onTime: 88, delayed: 8, atRisk: 4 },
  { day: "Wed", orders: 410, onTime: 82, delayed: 12, atRisk: 6 },
  { day: "Thu", orders: 440, onTime: 91, delayed: 6, atRisk: 3 },
  { day: "Fri", orders: 460, onTime: 94, delayed: 4, atRisk: 2 },
  { day: "Sat", orders: 300, onTime: 96, delayed: 3, atRisk: 1 },
  { day: "Sun", orders: 260, onTime: 95, delayed: 3, atRisk: 2 },
];

// Weekly on-time % for the 11 weeks before the current one.
export const fulfillmentHistory: number[] = [
  88.1, 88.9, 87.6, 89.0, 88.4, 89.2, 88.7, 89.5, 89.1, 88.6, 89.3,
];

// Sales & ops team, PulseGrid
const owners = ["A. Sharma", "R. Mehta", "P. Nair", "V. Singh", "A. Reddy"];

// Enterprise customers: national retail, quick-commerce, and pharmacy chains
const accounts = [
  "Reliance Retail",
  "DMart",
  "BigBasket",
  "Blinkit",
  "Zepto",
  "Apollo Pharmacy",
  "Metro Wholesale",
  "Star Bazaar",
  "Nature's Basket",
  "Spencer's Retail",
  "More Retail",
  "Vishal Mega Mart",
  "JioMart",
  "Health & Glow",
  "Easyday Club",
  "Nilgiris Supermarket",
  "Ratnadeep Supermarket",
  "Heritage Fresh",
  "Modern Bazaar",
  "Le Marche",
  "Namdhari's Fresh",
  "Foodhall",
  "Trent Westside",
  "V-Mart Retail",
];

const statusCycle: RecentOrder["status"][] = [
  "fulfilled",
  "fulfilled",
  "processing",
  "fulfilled",
  "delayed",
  "fulfilled",
  "at_risk",
  "processing",
];

export const recentOrders: RecentOrder[] = accounts.map((account, index) => {
  const day = 24 - Math.floor(index / 2);
  // Order values roughly ₹3.5L – ₹22L, typical for a distribution SKU order
  const amount = 350000 + ((index * 87370) % 1850000);
  return {
    id: `SO-2026-${10490 - index}`,
    account,
    owner: owners[index % owners.length],
    amount,
    status: statusCycle[index % statusCycle.length],
    updatedAt: `2026-07-${String(Math.max(day, 1)).padStart(2, "0")}`,
  };
});


