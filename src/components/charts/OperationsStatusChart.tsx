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
import { operationsStatus } from "@/data/mockData";

const labels: Record<string, string> = {
  onTime: "On time",
  delayed: "Delayed",
  atRisk: "At risk",
};

const colors: Record<string, string> = {
  onTime: "hsl(var(--positive))",
  delayed: "hsl(var(--warning))",
  atRisk: "hsl(var(--destructive))",
};

export function OperationsStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={operationsStatus} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          width={40}
        />
        <Tooltip
          cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
          content={
            <ChartTooltip
              indicatorColors={colors}
              valueFormatter={(value, name) => [`${value}%`, labels[name] ?? name]}
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
              {labels[value] ?? value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="onTime"
          name="onTime"
          stackId="1"
          stroke={colors.onTime}
          fill={colors.onTime}
          fillOpacity={0.22}
          strokeWidth={1.75}
          isAnimationActive
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="delayed"
          name="delayed"
          stackId="1"
          stroke={colors.delayed}
          fill={colors.delayed}
          fillOpacity={0.28}
          strokeWidth={1.75}
          isAnimationActive
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="atRisk"
          name="atRisk"
          stackId="1"
          stroke={colors.atRisk}
          fill={colors.atRisk}
          fillOpacity={0.28}
          strokeWidth={1.75}
          isAnimationActive
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
