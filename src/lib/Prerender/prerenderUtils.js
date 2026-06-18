import fs from "node:fs";
import path from "node:path";

export const recordsFile = path.resolve(
  process.cwd(),
  "src/lib/Prerender/fairsharingRecords.generated.json",
);

export const organisationsFile = path.resolve(
  process.cwd(),
  "src/lib/Prerender/organisations.generated.json",
);

export function normalizeDoi(value) {
  return decodeURIComponent(String(value))
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:/i, "")
    .replace(/^10\.\d{4,9}\//i, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

export function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function readGeneratedRecords() {
  return readJsonIfExists(recordsFile);
}

export function readGeneratedOrganisations() {
  return readJsonIfExists(organisationsFile);
}
