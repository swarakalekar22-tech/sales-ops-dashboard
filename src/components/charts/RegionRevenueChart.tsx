import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { formatCompactINR } from "@/lib/currency";
import { regionRevenue } from "@/data/mockData";

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const currency = (value: number) => formatCompactINR(value, 1);

export function RegionRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={regionRevenue}
        layout="vertical"
        margin={{ left: 8, right: 20, top: 8 }}
        barCategoryGap={14}
      >
        <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickFormatter={currency}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          type="category"
          dataKey="region"
          tickLine={false}
          axisLine={false}
          width={108}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
          content={
            <ChartTooltip
              valueFormatter={(value) => [currency(value), "Revenue"]}
            />
          }
        />
        <Bar
          dataKey="revenue"
          name="revenue"
          radius={[0, 6, 6, 0]}
          barSize={16}
          isAnimationActive
          animationDuration={800}
          animationEasing="ease-out"
        >
          {regionRevenue.map((entry, index) => (
            <Cell key={entry.region} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
