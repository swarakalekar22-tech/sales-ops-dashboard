import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { formatCompactINR } from "@/lib/currency";
import { revenueTrend } from "@/data/mockData";

const currency = (value: number) => formatCompactINR(value, 1);

const legendLabels: Record<string, string> = {
  revenue: "Revenue",
  target: "Target",
};

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={revenueTrend} margin={{ left: 4, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.32} />
            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={currency}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
          content={
            <ChartTooltip
              valueFormatter={(value, name) => [
                currency(value),
                legendLabels[name] ?? name,
              ]}
            />
          }
        />
        <Legend
          verticalAlign="top"
          height={28}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">
              {legendLabels[value] ?? value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="target"
          name="target"
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="4 4"
          fill="transparent"
          strokeWidth={1.5}
          isAnimationActive
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="revenue"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2.25}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
