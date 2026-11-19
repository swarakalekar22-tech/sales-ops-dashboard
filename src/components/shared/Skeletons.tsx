import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="mt-4 h-8 w-28" />
        <Skeleton className="mt-3 h-4 w-24" />
        <Skeleton className="mt-2 h-3 w-36" />
      </CardContent>
    </Card>
  );
}

export function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ChartCardSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton style={{ height }} className="w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-64 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-md" />
        ))}
      </CardContent>
    </Card>
  );
}
