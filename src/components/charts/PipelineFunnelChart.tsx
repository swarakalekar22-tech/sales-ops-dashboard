import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { pipelineStages } from "@/data/mockData";

export function PipelineFunnelChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={pipelineStages} margin={{ left: 4, right: 12, top: 8 }} barCategoryGap={22}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          width={32}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
          content={
            <ChartTooltip valueFormatter={(value) => [String(value), "Deals"]} />
          }
        />
        <Bar
          dataKey="deals"
          name="deals"
          fill="hsl(var(--chart-1))"
          radius={[6, 6, 0, 0]}
          barSize={40}
          isAnimationActive
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
