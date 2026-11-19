import { ChartCard } from "@/components/shared/ChartCard";
import { KpiCard } from "@/components/shared/KpiCard";
import { InsightsCard } from "@/components/shared/InsightsCard";
import { RecentOrdersTable } from "@/components/shared/RecentOrdersTable";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { RegionRevenueChart } from "@/components/charts/RegionRevenueChart";
import {
  ChartCardSkeleton,
  KpiGridSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { kpiMetrics } from "@/data/kpis";

export default function Dashboard() {
  const isLoading = useSimulatedLoading(650);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <KpiGridSkeleton />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCardSkeleton />
          </div>
          <ChartCardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric, index) => (
          <KpiCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Revenue vs. target"
          subtitle="Monthly recognized revenue against plan"
          className="lg:col-span-2"
        >
          <RevenueTrendChart />
        </ChartCard>

        <ChartCard title="Revenue by region" subtitle="Latest month">
          <RegionRevenueChart />
        </ChartCard>
      </div>

      <InsightsCard />

      <RecentOrdersTable />
    </div>
  );
}
