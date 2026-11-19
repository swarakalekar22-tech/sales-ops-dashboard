import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insights } from "@/data/insights";

export function InsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          Key insights
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.id} className="space-y-1">
            <p className="text-sm font-medium">{insight.title}</p>
            <p className="text-xs text-muted-foreground">{insight.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}