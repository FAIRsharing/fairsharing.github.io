import { createRequire } from "node:module";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

const require = createRequire(import.meta.url);
const fs = require("node:fs");

function readJsonIfExists(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.warn(`Missing file: ${filePath}`);
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return raw ? JSON.parse(raw) : [];
}

export function readGeneratedRecords() {
  return readJsonIfExists(buildContext.recordsFile);
}

export function readGeneratedOrganisations() {
  return readJsonIfExists(buildContext.organisationsFile);
}
