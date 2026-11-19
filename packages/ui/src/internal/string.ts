export function humanReadableSize(bytes: number | null | undefined): string {
  if (!bytes) return "0 Byte";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${Math.round(bytes / 1024 ** index)} ${sizes[index]}`;
}

export function centsToDollars(cents: number | string | null | undefined): number {
  if (cents == null) return 0;
  return (typeof cents === "number" ? cents : parseInt(cents, 10)) / 100;
}

export function dollarsToCents(dollars: number | string | null | undefined): number {
  if (dollars == null) return 0;
  const value = typeof dollars === "number" ? dollars : parseFloat(dollars);
  return Number.isNaN(value) ? 0 : Math.round(value * 100);
}

export function formatToMoney(value: number | string | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return "0,00";
  const [integer, decimals] = Number(value).toFixed(2).split(".");
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimals}`;
}

export const formatCentsToMoney = (cents: number | string | null | undefined): string =>
  formatToMoney(centsToDollars(cents));

export function textToHtml(text: string): string {
  return text.replace(/\r?\n/g, "<br>").replace(/ {2,}/g, (match) => "&nbsp;".repeat(match.length));
}
