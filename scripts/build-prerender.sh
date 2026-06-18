#!/usr/bin/env bash
set -euo pipefail

# Load local .env values if present.
set -a
[ -f .env ] && . ./.env
set +a

START_TIME=$(date +%s)
BATCH_SIZE=500
BUILD_CONTEXT="src/lib/Prerender/build-context.json"
OUTPUT_DIR=".prerender-output"
VITE_FULL_PRERENDER="${VITE_FULL_PRERENDER:-true}"

mkdir -p src/lib/Prerender

# Light build path: skip API fetch and skip generated JSON entirely.
if [ "$VITE_FULL_PRERENDER" != "true" ]; then
  printf '{"batch":1,"batchSize":1,"skipFull":true}\n' > "$BUILD_CONTEXT"
  echo "Skipping full prerender"

  PRERENDER_FULL=false vike build
  npx rimraf dist/server

  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  MINUTES=$((ELAPSED / 60))
  SECONDS_REMAINING=$((ELAPSED % 60))
  echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"
  exit 0
fi

# Full build path: fetch API data and write generated JSON files.
echo "Generating records file from API..."
node --input-type=module <<'NODE'
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import GraphClientSEO from "./src/lib/GraphClient/GraphClientSEO.js";
import getAllFairsharingRecordsQuery from "./src/lib/GraphClient/queries/getAllFairsharingRecords.json" with { type: "json" };
import getAllOrganisationsQuery from "./src/lib/GraphClient/queries/getAllOrganisations.json" with { type: "json" };

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

npx rimraf "$OUTPUT_DIR" dist
mkdir -p "$OUTPUT_DIR/client"

for batch in $(seq 1 "$TOTAL_BATCHES"); do
  start_id=$(( (batch - 1) * BATCH_SIZE + 1 ))
  end_id=$(( batch * BATCH_SIZE ))

  if [ "$end_id" -gt "$LAST_ID" ]; then
    end_id="$LAST_ID"
  fi

  printf '{"batch":%s,"batchSize":%s,"skipFull":false}\n' "$batch" "$BATCH_SIZE" > "$BUILD_CONTEXT"
  echo "Building chunk $batch / $TOTAL_BATCHES: IDs $start_id to $end_id"

  PRERENDER_FULL=true vike build

  cp -R dist/client/. "$OUTPUT_DIR/client/"
  npx rimraf dist
done

npx rimraf dist
mkdir -p dist/client
cp -R "$OUTPUT_DIR/client"/. dist/client/

npx rimraf "$OUTPUT_DIR" dist/server

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS_REMAINING=$((ELAPSED % 60))
echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"