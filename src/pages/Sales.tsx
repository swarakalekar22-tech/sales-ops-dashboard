import { ChartCard } from "@/components/shared/ChartCard";
import { KpiCard } from "@/components/shared/KpiCard";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { PipelineFunnelChart } from "@/components/charts/PipelineFunnelChart";
import { ChartCardSkeleton, KpiGridSkeleton } from "@/components/shared/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { formatCompactINR } from "@/lib/currency";
import { kpiMetrics } from "@/data/kpis";
import { pipelineStages } from "@/data/mockData";

const currency = (value: number) => formatCompactINR(value);

export default function Sales() {
  const isLoading = useSimulatedLoading(650);
  const salesKpis = kpiMetrics.filter((m) =>
    ["revenue", "pipeline", "win-rate"].includes(m.id)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <KpiGridSkeleton />
        <ChartCardSkeleton />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCardSkeleton />
          </div>
          <ChartCardSkeleton height={220} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {salesKpis.map((metric, index) => (
          <KpiCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <ChartCard title="Revenue vs. target" subtitle="Monthly recognized revenue against plan">
        <RevenueTrendChart />
      </ChartCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Pipeline by stage"
          subtitle="Deals by stage"
          className="lg:col-span-2"
        >
          <PipelineFunnelChart />
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              Stage value
            </CardTitle>
            <p className="text-xs text-muted-foreground">Total value by stage</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineStages.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stage.stage}</span>
                <span className="font-medium tabular-nums">
                  {currency(stage.value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}