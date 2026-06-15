#!/usr/bin/env bash
set -euo pipefail

BATCH_SIZE=250
GENERATED_JSON="src/lib/Prerender/fairsharingRecords.generated.json"
OUTPUT_DIR=".prerender-output"

mkdir -p src/lib/Prerender

# Generate the records JSON only if it does not already exist.
if [ -f "$GENERATED_JSON" ]; then
  echo "Using existing generated file: $GENERATED_JSON"
else
  echo "Generating records file from API..."
  node --input-type=module <<'NODE'
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import GraphClientSEO from "./src/lib/GraphClient/GraphClientSEO.js";
import getAllFairsharingRecordsQuery from "./src/lib/GraphClient/queries/getAllFairsharingRecords.json" with { type: "json" };

const graphClientSEO = new GraphClientSEO();
const allPayload = structuredClone(getAllFairsharingRecordsQuery);
const responseData = await graphClientSEO.executeQuery(allPayload);

const records = responseData?.allFairsharingRecords || [];
const outFile = path.resolve("src/lib/Prerender/fairsharingRecords.generated.json");

fs.writeFileSync(outFile, JSON.stringify(records, null, 2), "utf8");
NODE
fi

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

# Netlify: skip the long batched build and do one light build only.
if [ "${SKIP_FULL_PRERENDER:-false}" = "true" ]; then
  echo "Skipping full prerender"
  PRERENDER_FULL=false VITE_BUILD_BATCH=1 VITE_BUILD_BATCH_SIZE=1 vike build
  exit 0
fi

# Local / production: full batched prerender.
TOTAL_BATCHES=$(( (LAST_ID + BATCH_SIZE - 1) / BATCH_SIZE ))

npx rimraf "$OUTPUT_DIR" dist
mkdir -p "$OUTPUT_DIR/client"

for batch in $(seq 1 "$TOTAL_BATCHES"); do
  start_id=$(( (batch - 1) * BATCH_SIZE + 1 ))
  end_id=$(( batch * BATCH_SIZE ))

  if [ "$end_id" -gt "$LAST_ID" ]; then
    end_id="$LAST_ID"
  fi

  echo "Building chunk $batch / $TOTAL_BATCHES: IDs $start_id to $end_id"

  PRERENDER_FULL=true VITE_BUILD_BATCH="$batch" VITE_BUILD_BATCH_SIZE="$BATCH_SIZE" vike build

  cp -R dist/client/. "$OUTPUT_DIR/client/"
  npx rimraf dist
done

npx rimraf dist
mkdir -p dist/client
cp -R "$OUTPUT_DIR/client"/. dist/client/

npx rimraf "$OUTPUT_DIR" dist/server