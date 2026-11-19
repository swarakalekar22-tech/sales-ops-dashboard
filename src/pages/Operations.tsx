import { ChartCard } from "@/components/shared/ChartCard";
import { KpiCard } from "@/components/shared/KpiCard";
import { RecentOrdersTable } from "@/components/shared/RecentOrdersTable";
import { OperationsStatusChart } from "@/components/charts/OperationsStatusChart";
import { ChartCardSkeleton, KpiCardSkeleton, TableSkeleton } from "@/components/shared/Skeletons";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { kpiMetrics } from "@/data/kpis";

export default function Operations() {
  const isLoading = useSimulatedLoading(650);
  const opsKpis = kpiMetrics.filter((m) => m.id === "fulfillment");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          <KpiCardSkeleton />
        </div>
        <ChartCardSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
        {opsKpis.map((metric, index) => (
          <KpiCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <ChartCard title="Fulfillment status" subtitle="Order health over the last 7 days">
        <OperationsStatusChart />
      </ChartCard>

      <RecentOrdersTable />
    </div>
  );
}
