#!/usr/bin/env bash
set -euo pipefail

# Load local .env values if present.
set -a
[ -f .env ] && . ./.env
set +a
export PRERENDER_ROOT="$(pwd)"
START_TIME=$(date +%s)
BATCH_SIZE=750
BUILD_CONTEXT="src/lib/Prerender/build-context.json"
OUTPUT_DIR=".prerender-output"
CACHE_DIR=".prerender-cache"
VITE_FULL_PRERENDER="${VITE_FULL_PRERENDER:-true}"

PROJECT_ROOT="$(pwd)"
JSONLD_DIR="${JSONLD_DIR:-$PROJECT_ROOT/dist/jsonld}"
RECORDS_JSON="$PROJECT_ROOT/src/lib/Prerender/fairsharingRecords.generated.json"
ORG_JSON="$PROJECT_ROOT/src/lib/Prerender/organisations.generated.json"

mkdir -p src/lib/Prerender "$CACHE_DIR"

# Light build path: skip API fetch and skip generated JSON entirely.
if [ "$VITE_FULL_PRERENDER" != "true" ]; then
    printf '{
      "batch": 1,
      "batchSize": 1,
      "skipFull": true,
      "recordsFile": "%s",
      "organisationsFile": "%s",
      "jsonldDir": "%s"
    }\n' "$RECORDS_JSON" "$ORG_JSON" "$JSONLD_DIR"> "$BUILD_CONTEXT"
  echo "Skipping full prerender"

  npx rimraf dist/client dist/server
  PRERENDER_FULL=false vike build
  npx rimraf dist/server

  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  MINUTES=$((ELAPSED / 60))
  SECONDS_REMAINING=$((ELAPSED % 60))
  echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"
  exit 0
fi

# Full build path:
# restore cached files first so API downtime does not break the build.
if [ -f "$CACHE_DIR/fairsharingRecords.generated.json" ]; then
  cp "$CACHE_DIR/fairsharingRecords.generated.json" "$RECORDS_JSON"
  echo "Restored cached records JSON"
fi

if [ -f "$CACHE_DIR/organisations.generated.json" ]; then
  cp "$CACHE_DIR/organisations.generated.json" "$ORG_JSON"
  echo "Restored cached organisations JSON"
fi

echo "Generating records file from API..."
node --input-type=module <<'NODE'
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import GraphClientSEO from "./src/lib/GraphClient/GraphClientSEO.js";
import getAllFairsharingRecordsQuery from "./src/lib/GraphClient/queries/getAllFairsharingRecords.json" with { type: "json" };
import getAllOrganisationsQuery from "./src/lib/GraphClient/queries/getAllOrganisationsSEO.json" with { type: "json" };

const recordsOutFile = path.resolve("src/lib/Prerender/fairsharingRecords.generated.json");
const organisationsOutFile = path.resolve("src/lib/Prerender/organisations.generated.json");
const graphClientSEO = new GraphClientSEO();

async function fetchOrReuse(query, outFile, keyName) {
  try {
    const payload = structuredClone(query);
    const response = await graphClientSEO.executeQuery(payload);
    const data = response?.[keyName] || [];
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), "utf8");
    console.log(`Wrote ${outFile} (${data.length} items)`);
    return true;
  } catch (error) {
    if (fs.existsSync(outFile)) {
      console.warn(
        `API fetch failed for ${outFile}, reusing existing file. Reason: ${error?.message || error}`,
      );
      return true;
    }

    console.error(
      `API fetch failed and no cached file exists for ${outFile}. Reason: ${error?.message || error}`,
    );
    return false;
  }
}

const okRecords = await fetchOrReuse(
  getAllFairsharingRecordsQuery,
  recordsOutFile,
  "allFairsharingRecords",
);

const okOrganisations = await fetchOrReuse(
  getAllOrganisationsQuery,
  organisationsOutFile,
  "allOrganisations",
);

if (!okRecords || !okOrganisations) {
  process.exit(1);
}
NODE

# Save freshly generated files into cache for future builds.
cp "$RECORDS_JSON" "$CACHE_DIR/fairsharingRecords.generated.json"
cp "$ORG_JSON" "$CACHE_DIR/organisations.generated.json"

LAST_ID=$(node --input-type=module <<'NODE'
import fs from "node:fs";

const records = JSON.parse(
  fs.readFileSync("src/lib/Prerender/fairsharingRecords.generated.json", "utf8"),
);

const lastId = records.reduce((max, record) => {
  const id = Number(record.id);
  return Number.isFinite(id) ? Math.max(max, id) : max;
}, 0);

process.stdout.write(String(lastId));
NODE
)

if [ -z "$LAST_ID" ] || [ "$LAST_ID" -le 0 ]; then
  echo "Could not fetch LAST_ID"
  exit 1
fi

TOTAL_BATCHES=$(( (LAST_ID + BATCH_SIZE - 1) / BATCH_SIZE ))

npx rimraf "$OUTPUT_DIR" dist/client dist/server
mkdir -p "$OUTPUT_DIR/client"

for batch in $(seq 1 "$TOTAL_BATCHES"); do
  start_id=$(( (batch - 1) * BATCH_SIZE + 1 ))
  end_id=$(( batch * BATCH_SIZE ))

  if [ "$end_id" -gt "$LAST_ID" ]; then
    end_id="$LAST_ID"
  fi

  printf '{
    "batch": %s,
    "batchSize": %s,
    "skipFull": false,
    "recordsFile": "%s",
    "organisationsFile": "%s",
    "jsonldDir": "%s"
  }\n' "$batch" "$BATCH_SIZE" "$RECORDS_JSON" "$ORG_JSON" "$JSONLD_DIR"> "$BUILD_CONTEXT"
  echo "Building chunk $batch / $TOTAL_BATCHES: IDs $start_id to $end_id"

  PRERENDER_FULL=true vike build

  cp -R dist/client/. "$OUTPUT_DIR/client/"
  npx rimraf dist/client dist/server
done

npx rimraf dist/client dist/server
mkdir -p dist/client
cp -R "$OUTPUT_DIR/client"/. dist/client/

npx rimraf "$OUTPUT_DIR" dist/server

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS_REMAINING=$((ELAPSED % 60))
echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"