#!/usr/bin/env bash
set -e

BATCH_SIZE=750
LAST_ID=8298
TOTAL_BATCHES=$(( (LAST_ID + BATCH_SIZE - 1) / BATCH_SIZE ))

rimraf .prerender-chunks dist
mkdir -p .prerender-chunks

for batch in $(seq 1 "$TOTAL_BATCHES"); do
  start_id=$(( (batch - 1) * BATCH_SIZE + 1 ))
  end_id=$(( batch * BATCH_SIZE ))

  if [ "$end_id" -gt "$LAST_ID" ]; then
    end_id="$LAST_ID"
  fi

  echo "Building chunk $batch / $TOTAL_BATCHES: IDs $start_id to $end_id"

  VITE_BUILD_BATCH="$batch" VITE_BUILD_BATCH_SIZE="$BATCH_SIZE" vike build

  mkdir -p ".prerender-chunks/chunk$batch"
  cp -r dist/client/. ".prerender-chunks/chunk$batch/"

  rimraf dist
done

mkdir -p dist/client

for batch in $(seq 1 "$TOTAL_BATCHES"); do
  echo "Merging chunk $batch"
  cp -r ".prerender-chunks/chunk$batch/." dist/client/
done

rimraf .prerender-chunks dist/server