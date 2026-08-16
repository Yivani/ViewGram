// created by Yivani yivani.dev
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    const thousands = num / 1000;
    if (thousands % 1 === 0) {
      return `${thousands}k`;
    }
    return `${thousands.toFixed(1)}k`;
  }

  const millions = num / 1000000;
  if (millions % 1 === 0) {
    return `${millions}m`;
  }
  return `${millions.toFixed(1)}m`;
}
