import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import buildContext from "@/lib/Prerender/build-context.json" with {type: "json"};

const require = createRequire(import.meta.url);
const fs = require("node:fs");

function readJsonIfExists(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.warn(`Missing file: ${filePath}`);
    return fallback;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return raw ? JSON.parse(raw) : fallback;
}

function getJsonldDir() {
  if (buildContext.jsonldDir) return buildContext.jsonldDir;
  if (process.env.JSONLD_DIR) return process.env.JSONLD_DIR;

  return fileURLToPath(new URL("../../../dist/jsonld/", import.meta.url));
}

export function readGeneratedRecords() {
  return readJsonIfExists(buildContext.recordsFile, []);
}

export function readGeneratedOrganisations() {
  return readJsonIfExists(buildContext.organisationsFile, []);
}

export function readGeneratedSchemaOrg(recordId) {
  const jsonldDir = getJsonldDir().replace(/[\\/]+$/, "");
  const filePath = `${jsonldDir}/${recordId}.jsonld`;
  return readJsonIfExists(filePath, null);
}
