#!/usr/bin/env bash
set -euo pipefail
umask 022

# Load local .env values if present.
set -a
if [ -f .env ]; then
  . ./.env
fi
set +a

export PRERENDER_ROOT="$(pwd)"
START_TIME=$(date +%Y%m%d%H%M%S)
START_EPOCH=$(date +%s)
BATCH_SIZE=750
BUILD_CONTEXT="src/lib/Prerender/build-context.json"
OUTPUT_DIR=".prerender-output"
CACHE_DIR=".prerender-cache"
VITE_FULL_PRERENDER="${VITE_FULL_PRERENDER:-true}"
BUILD_OUTPUT_DIR="${BUILD_OUTPUT_DIR:-dist_${START_TIME}}"
LIVE_DIST_LINK="${LIVE_DIST_LINK:-dist}"

PROJECT_ROOT="$(pwd)"
JSONLD_DIR="${JSONLD_DIR:-$PROJECT_ROOT/dist/jsonld}"
RECORDS_JSON="$PROJECT_ROOT/src/lib/Prerender/fairsharingRecords.generated.json"
ORG_JSON="$PROJECT_ROOT/src/lib/Prerender/organisations.generated.json"

ensure_dir_755() {
  mkdir -p "$@"
  chmod 755 "$@"
}

ensure_file_644() {
  chmod 644 "$@"
}

normalise_tree_permissions() {
  local target

  for target in "$@"; do
    [ -e "$target" ] || continue

    if [ -d "$target" ]; then
      find "$target" -type d -exec chmod 755 {} +
      find "$target" -type f -exec chmod 644 {} +
    elif [ -f "$target" ]; then
      chmod 644 "$target"
    fi
  done
}

prepare_clean_dir() {
  local dir="$1"

  npx rimraf "$dir"
  mkdir -p "$dir"
  chmod 755 "$dir"
}

prepare_build_output_dir() {
  local live_target
  local build_target

  live_target="$(readlink -f "$LIVE_DIST_LINK" 2>/dev/null || true)"
  build_target="$(readlink -f "$BUILD_OUTPUT_DIR" 2>/dev/null || true)"

  if [ -n "$live_target" ] && [ "$build_target" = "$live_target" ]; then
    echo "Refusing to clear BUILD_OUTPUT_DIR because it is the live release: $BUILD_OUTPUT_DIR"
    exit 1
  fi

  prepare_clean_dir "$BUILD_OUTPUT_DIR"
}

switch_live_dist() {
  if [ -e "$LIVE_DIST_LINK" ] && [ ! -L "$LIVE_DIST_LINK" ]; then
    # echo "$LIVE_DIST_LINK must be a symlink before running this script"
    # exit 1
    mv "$LIVE_DIST_LINK" "${LIVE_DIST_LINK}_backup_${START_TIME}"
  fi

  ln -sfn "$BUILD_OUTPUT_DIR" "$LIVE_DIST_LINK.new"
  mv -f "$LIVE_DIST_LINK.new" "$LIVE_DIST_LINK"
}

sync_jsonld_release() {
  if [ -d "$JSONLD_DIR" ]; then
    ensure_dir_755 "$BUILD_OUTPUT_DIR/jsonld"
    cp -R "$JSONLD_DIR"/. "$BUILD_OUTPUT_DIR/jsonld/"
    normalise_tree_permissions "$BUILD_OUTPUT_DIR/jsonld"
  fi
}

# Below method will keep last 3 dist. Can be uncommented if we want to keep only last 3 dist releases.
# cleanup_old_releases() {
#   ls -1dt dist_* 2>/dev/null | tail -n +4 | while read -r old_release; do
#     [ -n "$old_release" ] && rm -rf -- "$old_release"
#   done
# }

echo "Using VITE_API_ENDPOINT=${VITE_API_ENDPOINT:-<unset>}"
npx rimraf "$OUTPUT_DIR" "$CACHE_DIR"
prepare_build_output_dir
ensure_dir_755 src/lib/Prerender

# Light build path: skip API fetch and skip generated JSON entirely.
if [ "$VITE_FULL_PRERENDER" != "true" ]; then
  printf '{
  "batch": 1,
  "batchSize": 1,
  "skipFull": true,
  "recordsFile": "%s",
  "organisationsFile": "%s",
  "jsonldDir": "%s"
}\n' "$RECORDS_JSON" "$ORG_JSON" "$JSONLD_DIR" > "$BUILD_CONTEXT"
  ensure_file_644 "$BUILD_CONTEXT"
  echo "Skipping full prerender"

  prepare_build_output_dir
  BUILD_OUTPUT_DIR="$BUILD_OUTPUT_DIR" PRERENDER_FULL=false vike build
  npx rimraf "$BUILD_OUTPUT_DIR/server"
  normalise_tree_permissions "$BUILD_OUTPUT_DIR"

  sync_jsonld_release
  switch_live_dist
  # cleanup_old_releases

  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_EPOCH))
  MINUTES=$((ELAPSED / 60))
  SECONDS_REMAINING=$((ELAPSED % 60))
  echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"
  exit 0
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

ensure_file_644 "$RECORDS_JSON" "$ORG_JSON"

LAST_ID=$(
  node --input-type=module <<'NODE'
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
}\n' "$batch" "$BATCH_SIZE" "$RECORDS_JSON" "$ORG_JSON" "$JSONLD_DIR" > "$BUILD_CONTEXT"
  ensure_file_644 "$BUILD_CONTEXT"
  echo "Building chunk $batch / $TOTAL_BATCHES: IDs $start_id to $end_id"

  prepare_build_output_dir
  BUILD_OUTPUT_DIR="$BUILD_OUTPUT_DIR" PRERENDER_FULL=true vike build

  cp -R "$BUILD_OUTPUT_DIR/client/." "$OUTPUT_DIR/client/"
  npx rimraf "$BUILD_OUTPUT_DIR/server"
done

prepare_build_output_dir
ensure_dir_755 "$BUILD_OUTPUT_DIR/client"
cp -R "$OUTPUT_DIR/client"/. "$BUILD_OUTPUT_DIR/client/"
normalise_tree_permissions "$BUILD_OUTPUT_DIR"

npx rimraf "$OUTPUT_DIR" "$BUILD_OUTPUT_DIR/server"
sync_jsonld_release
switch_live_dist

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_EPOCH))
MINUTES=$((ELAPSED / 60))
SECONDS_REMAINING=$((ELAPSED % 60))
echo "Total build time: ${MINUTES}m ${SECONDS_REMAINING}s"
