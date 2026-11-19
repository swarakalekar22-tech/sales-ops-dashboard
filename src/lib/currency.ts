const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Exact rupee amount with Indian digit grouping, e.g. ₹8,42,000 */
export function formatINR(value: number): string {
  return inrFormatter.format(value);
}

/**
 * Compact rupee amount using Lakh / Crore suffixes, the convention used
 * across Indian enterprise reporting for large figures.
 * e.g. 184500000 -> "₹18.45 Cr", 420000 -> "₹4.20 L"
 */
export function formatCompactINR(value: number, fractionDigits = 2): string {
  const abs = Math.abs(value);

  if (abs >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(fractionDigits)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(fractionDigits)} L`;
  }
  if (abs >= 1_000) {
    return `₹${(value / 1_000).toFixed(1)} K`;
  }
  return formatINR(value);
}
