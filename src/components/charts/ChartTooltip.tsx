import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number, name: string) => [string, string];
  indicatorColors?: Record<string, string>;
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  indicatorColors,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="min-w-[10rem] rounded-lg border border-border bg-popover px-3.5 py-2.5 text-popover-foreground shadow-popover">
      {label ? (
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(String(label)) : label}
        </p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry) => {
          const name = String(entry.name ?? "");
          const numericValue =
            typeof entry.value === "number" ? entry.value : Number(entry.value);
          const [formattedValue, formattedName] = valueFormatter
            ? valueFormatter(numericValue, name)
            : [String(entry.value), name];
          const color = indicatorColors?.[name] ?? (entry.color as string);

          return (
            <div
              key={name}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {formattedName}
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
