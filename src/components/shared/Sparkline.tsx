import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color: string;
  id: string;
}

export function Sparkline({ data, color, id }: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#sparkline-${id})`}
          isAnimationActive={true}
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
