import { useState } from "react";
import jsPDF from "jspdf";
import {
  FileBarChart,
  Download,
  Eye,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: number;
  name: string;
  type: string;
  dateRange: string;
  region: string;
  format: string;
  createdAt: string;
}

function ReportModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (report: Omit<Report, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Executive Summary");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [region, setRegion] = useState("All India");
  const [format, setFormat] = useState("PDF");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      type,
      dateRange,
      region,
      format,
    });

    setName("");
    setType("Executive Summary");
    setDateRange("Last 30 days");
    setRegion("All India");
    setFormat("PDF");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Create a report
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Build a saved report from your dashboard data.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* REPORT NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Report name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. July Executive Performance"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* REPORT TYPE */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Report type
            </label>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Executive Summary</option>
              <option>Sales Performance</option>
              <option>Operations Performance</option>
              <option>Revenue Analysis</option>
              <option>Order Fulfillment</option>
            </select>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Date range
            </label>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Year to date</option>
              <option>Previous quarter</option>
            </select>
          </div>

          {/* REGION */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Region
            </label>

            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>All India</option>
              <option>West India</option>
              <option>North India</option>
              <option>South India</option>
              <option>East India</option>
              <option>Central India</option>
            </select>
          </div>

          {/* FORMAT */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Export format
            </label>

            <div className="grid grid-cols-2 gap-2">
              {["PDF", "CSV"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormat(option)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    format === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              disabled={!name.trim()}
              onClick={handleCreate}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Create report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [createOpen, setCreateOpen] = useState(false);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: "July Executive Performance",
      type: "Executive Summary",
      dateRange: "July 2026",
      region: "All India",
      format: "PDF",
      createdAt: "Today",
    },
    {
      id: 2,
      name: "West India Sales Review",
      type: "Sales Performance",
      dateRange: "Last 30 days",
      region: "West India",
      format: "CSV",
      createdAt: "Yesterday",
    },
  ]);

  const [viewReport, setViewReport] = useState<Report | null>(null);

  const createReport = (
    reportData: Omit<Report, "id" | "createdAt">
  ) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now(),
      createdAt: "Just now",
    };

    setReports((current) => [newReport, ...current]);
    setCreateOpen(false);
  };

  const downloadReport = (report: Report) => {
  const reportData = [
    ["Report", report.name],
    ["Type", report.type],
    ["Date range", report.dateRange],
    ["Region", report.region],
    ["Format", report.format],
    [],
    ["Metric", "Value"],
    ["Revenue", "₹18.45 Cr"],
    ["Open Pipeline", "₹64.2 Cr"],
    ["Win Rate", "28.6%"],
    ["On-Time Fulfillment", "94.1%"],
  ];

  const fileName = report.name
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();

  if (report.format === "PDF") {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("PulseGrid", 14, 20);

    doc.setFontSize(14);
    doc.text(report.name, 14, 32);

    doc.setFontSize(10);
    doc.text(`Report Type: ${report.type}`, 14, 44);
    doc.text(`Date Range: ${report.dateRange}`, 14, 51);
    doc.text(`Region: ${report.region}`, 14, 58);

    doc.setFontSize(12);
    doc.text("Performance Metrics", 14, 74);

    doc.setFontSize(10);

    const metrics = [
      ["Revenue", "INR 18.45 Cr"],
      ["Open Pipeline", "INR 64.2 Cr"],
      ["Win Rate", "28.6%"],
      ["On-Time Fulfillment", "94.1%"],
    ];

    let y = 86;

    metrics.forEach(([label, value]) => {
      doc.text(label, 14, y);
      doc.text(value, 100, y);
      y += 10;
    });

    doc.setFontSize(9);
    doc.text(
      "Generated from the current PulseGrid demo dataset.",
      14,
      y + 12
    );

    doc.save(`${fileName}.pdf`);
    return;
  }

  const csv = reportData
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};



  return (
    <>
      <div className="space-y-5">
        {/* HEADER */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                Saved reports
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Create, view and export reports for your sales and operations
                team.
              </p>
            </div>

            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create report
            </Button>
          </CardHeader>
        </Card>

        {/* REPORT LIST */}
        <Card>
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <FileBarChart className="h-5 w-5" />
                </span>

                <div className="max-w-xs">
                  <h2 className="text-sm font-semibold">
                    No saved reports yet
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Create your first report using the button above.
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setCreateOpen(true)}
                >
                  Create a report
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-5 py-3 font-medium">
                        Report
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Type
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Date range
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Region
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Format
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Created
                      </th>

                      <th className="px-5 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                              <FileBarChart className="h-4 w-4" />
                            </span>

                            <span className="font-medium">
                              {report.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {report.type}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {report.dateRange}
                        </td>

                        <td className="px-5 py-4">
                          {report.region}
                        </td>

                        <td className="px-5 py-4">
                          <Badge variant="secondary">
                            {report.format}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {report.createdAt}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View report"
                              onClick={() => setViewReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Download report"
                              onClick={() => downloadReport(report)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CREATE REPORT MODAL */}
      <ReportModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createReport}
      />

      {/* VIEW REPORT MODAL */}
      {viewReport && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={() => setViewReport(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  {viewReport.name}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {viewReport.type}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewReport(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Revenue
                </p>
                <p className="mt-1 text-lg font-semibold">
                  ₹18.45 Cr
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Open pipeline
                </p>
                <p className="mt-1 text-lg font-semibold">
                  ₹64.2 Cr
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Win rate
                </p>
                <p className="mt-1 text-lg font-semibold">
                  28.6%
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Fulfillment
                </p>
                <p className="mt-1 text-lg font-semibold">
                  94.1%
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-positive/10 p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-positive" />
              Report data is generated from the current PulseGrid demo dataset.
            </div>

            <Button
              className="mt-5 w-full"
              onClick={() => setViewReport(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}