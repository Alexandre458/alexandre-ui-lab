export const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const decimal = (value: number, digits = 1) => value.toLocaleString("pt-BR", { maximumFractionDigits: digits });

export function parseDecimal(raw: string): number | null {
  if (!/^\d+(?:[,.]\d+)?$/.test(raw.trim())) return null;
  const value = Number(raw.trim().replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

export function parseMoney(raw: string): number | null {
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(raw.trim())) return null;
  const [whole, fraction = ""] = raw.trim().replaceAll(".", "").split(",");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 100_000_000 ? cents : null;
}

export function normalizePlace(value: string): string {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, " ");
}
