export function abbreviateNumber(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "0";
  const absValue = Math.abs(value);
  if (absValue < 1000) return value.toString();

  const units = ["K", "M", "B", "T", "P", "E"];
  let unitIndex = -1;
  let reduced = absValue;

  while (reduced >= 1000 && unitIndex < units.length - 1) {
    reduced /= 1000;
    unitIndex++;
  }

  // Show one decimal if not an integer (e.g., 1.5M)
  const formatted = reduced % 1 === 0 ? reduced.toString() : reduced.toFixed(1);

  // Preserve sign for negative numbers
  return (value < 0 ? "-" : "") + formatted + units[unitIndex];
}
