export function normalizeDoi(value) {
  return decodeURIComponent(String(value))
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:/i, "")
    .replace(/^10\.\d{4,9}\//i, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}