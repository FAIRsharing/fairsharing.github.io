#!/usr/bin/env bash
set -euo pipefail

START_TIME=$(date +%s)
BATCH_SIZE=500
BUILD_CONTEXT="src/lib/Prerender/build-context.json"
OUTPUT_DIR=".prerender-output"

mkdir -p src/lib/Prerender

echo "Generating records file from API..."
node --input-type=module <<'NODE'
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import GraphClientSEO from "./src/lib/GraphClient/GraphClientSEO.js";
import getAllFairsharingRecordsQuery from "./src/lib/GraphClient/queries/getAllFairsharingRecords.json" with { type: "json" };
import getAllOrganisationsQuery from "./src/lib/GraphClient/queries/getAllOrganisations.json" with { type: "json" };

const graphClientSEO = new GraphClientSEO();
const allPayload = structuredClone(getAllFairsharingRecordsQuery);
const responseData = await graphClientSEO.executeQuery(allPayload);

const records = responseData?.allFairsharingRecords || [];
const outFile = path.resolve("src/lib/Prerender/fairsharingRecords.generated.json");

fs.writeFileSync(outFile, JSON.stringify(records, null, 2), "utf8");

const allOrganisationsPayload = structuredClone(getAllOrganisationsQuery);
const responseOrganisationsData = await graphClientSEO.executeQuery(allOrganisationsPayload);

const organisations = responseOrganisationsData?.allOrganisations || [];
const organisationsOutFile = path.resolve("src/lib/Prerender/organisations.generated.json");

fs.writeFileSync(organisationsOutFile, JSON.stringify(organisations, null, 2), "utf8");
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

# Netlify: skip the full batch loop and do one light build.
if [ "${SKIP_FULL_PRERENDER:-false}" = "true" ]; then
  echo '{"batch":1,"batchSize":1,"skipFull":true}' > "$BUILD_CONTEXT"
  echo "Skipping full prerender"

  PRERENDER_FULL=false vike build

  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  echo "Total build time: ${ELAPSED} seconds"
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

  echo "{\"batch\":$batch,\"batchSize\":$BATCH_SIZE,\"skipFull\":false}" > "$BUILD_CONTEXT"
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