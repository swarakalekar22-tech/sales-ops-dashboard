import * as React from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/currency";
import { recentOrders } from "@/data/mockData";
import type { OrderStatus, RecentOrder } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; dot: string; badgeClass: string }
> = {
  fulfilled: {
    label: "Fulfilled",
    dot: "bg-positive",
    badgeClass: "bg-positive/10 text-positive",
  },
  processing: {
    label: "Processing",
    dot: "bg-muted-foreground",
    badgeClass: "bg-secondary text-secondary-foreground",
  },
  delayed: {
    label: "Delayed",
    dot: "bg-warning",
    badgeClass: "bg-warning/10 text-warning",
  },
  at_risk: {
    label: "At risk",
    dot: "bg-destructive",
    badgeClass: "bg-destructive/10 text-destructive",
  },
};

const currency = formatINR;

type SortKey = keyof Pick<
  RecentOrder,
  "id" | "account" | "owner" | "amount" | "status" | "updatedAt"
>;

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "id", label: "Order" },
  { key: "account", label: "Account" },
  { key: "owner", label: "Owner" },
  { key: "amount", label: "Amount", align: "right" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Updated" },
];

const PAGE_SIZE = 8;

interface RecentOrdersTableProps {
  orders?: RecentOrder[];
}

export function RecentOrdersTable({
  orders = recentOrders,
}: RecentOrdersTableProps) {
    const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [query, setQuery] = React.useState(urlSearch);
  const [sortKey, setSortKey] = React.useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [page, setPage] = React.useState(1);
  
  React.useEffect(() => {
    setQuery(urlSearch);
    setPage(1);
  }, [urlSearch]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    const rows = q
      ? orders.filter(
          (order) =>
            order.id.toLowerCase().includes(q) ||
            order.account.toLowerCase().includes(q) ||
            order.owner.toLowerCase().includes(q)
        )
      : orders;

    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return sortDir === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [orders, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }

    setPage(1);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">
            Recent orders
          </CardTitle>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {filtered.length} order{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search orders…"
            aria-label="Search recent orders"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {columns.map((column) => {
                  const isActive = column.key === sortKey;

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        isActive
                          ? sortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className={cn(
                        "px-5 py-3 font-medium",
                        column.align === "right" && "text-right"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          column.align === "right" && "flex-row-reverse"
                        )}
                      >
                        {column.label}

                        <ArrowUpDown
                          className={cn(
                            "h-3 w-3 transition-opacity",
                            isActive ? "opacity-100" : "opacity-30"
                          )}
                        />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {paginated.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border text-sm transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-5 py-3 font-medium tabular-nums">
                    {order.id}
                  </td>

                  <td className="px-5 py-3">
                    {order.account}
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">
                    {order.owner}
                  </td>

                  <td className="px-5 py-3 text-right tabular-nums">
                    {currency(order.amount)}
                  </td>

                  <td className="px-5 py-3">
                    <Badge
                      className={cn(
                        "gap-1.5 border-transparent font-medium",
                        statusConfig[order.status].badgeClass
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          statusConfig[order.status].dot
                        )}
                      />

                      {statusConfig[order.status].label}
                    </Badge>
                  </td>

                  <td className="px-5 py-3 text-muted-foreground tabular-nums">
                    {order.updatedAt}
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Inbox
                        className="h-6 w-6 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <p className="text-sm font-medium">
                        No orders match your search
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Try a different order ID, account, or owner.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border px-5 py-3.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(
                currentPage * PAGE_SIZE,
                filtered.length
              )}{" "}
              of {filtered.length}
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>

              <span className="px-1.5 tabular-nums">
                Page {currentPage} of {pageCount}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() =>
                  setPage((p) => Math.min(pageCount, p + 1))
                }
                disabled={currentPage === pageCount}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
