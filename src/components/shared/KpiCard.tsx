import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Minus,
  Percent,
  PackageCheck,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "@/components/shared/Sparkline";
import { cn } from "@/lib/utils";
import type { KpiMetric } from "@/types";

const icons = {
  IndianRupee,
  Target,
  Percent,
  PackageCheck,
} as const;

const trendColor = {
  up: "hsl(var(--positive))",
  down: "hsl(var(--destructive))",
  flat: "hsl(var(--muted-foreground))",
};

export function KpiCard({ metric, index = 0 }: { metric: KpiMetric; index?: number }) {
  const Icon = icons[metric.icon];
  const isUp = metric.trend === "up";
  const isFlat = metric.trend === "flat";
  const TrendIcon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;

  // Cycle each card through the 5-color chart palette so the grid reads as
  // "color coded" at a glance, without losing the up/down semantic colors.
  const accentIndex = (index % 5) + 1;
  const accentVar = `var(--chart-${accentIndex})`;
  const accent = `hsl(${accentVar})`;
  const accentSoft = `hsl(${accentVar} / 0.35)`;
  const accentFaint = `hsl(${accentVar} / 0.12)`;

  const deltaTextClass = isFlat
    ? "text-muted-foreground"
    : isUp
      ? "text-positive"
      : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      style={{ ["--kpi-accent" as string]: accentSoft }}
    >
      <Card className="group h-full transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--kpi-accent),0_16px_36px_-16px_var(--kpi-accent)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentSoft}, ${accentFaint})`,
                  color: accent,
                  boxShadow: `0 0 0 1px ${accentSoft}`,
                }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <span className="bg-brand-gradient bg-clip-text text-[1.85rem] font-extrabold leading-none tracking-tight text-transparent tabular-nums">
              {metric.value}
            </span>
            <div className="mb-0.5 w-20 opacity-90">
              <Sparkline
                id={metric.id}
                data={metric.sparkline}
                color={trendColor[metric.trend]}
              />
            </div>
          </div>

          <div
            className={cn(
              "mt-3 flex items-center gap-1 text-sm font-medium",
              deltaTextClass
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {isUp ? "+" : ""}
              {metric.deltaPct.toFixed(1)}
              {metric.deltaUnit ?? "%"}
            </span>
            <span className="font-normal text-muted-foreground">
              {metric.comparedTo}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground">{metric.insight}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}