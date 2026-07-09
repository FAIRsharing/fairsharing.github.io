#!/usr/bin/env bash
set -euo pipefail
umask 022

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
BUILD_OUTPUT_DIR="dist_${TIMESTAMP}"
DIST_LINK="dist"
JSONLD_DIR="${JSONLD_DIR:-$(pwd)/jsonld}"

normalise_tree_permissions() {
  local target="$1"

  find "$target" -type d -exec chmod 755 {} +
  find "$target" -type f -exec chmod 644 {} +
}

switch_live_dist() {
  local next_link="${DIST_LINK}.new.$$"

  ln -sfn "$BUILD_OUTPUT_DIR" "$next_link"
  mv -f "$next_link" "$DIST_LINK"
}

if [ -e "$BUILD_OUTPUT_DIR" ]; then
  echo "Refusing to build into existing directory: $BUILD_OUTPUT_DIR"
  exit 1
fi

if [ -e "$DIST_LINK" ] && [ ! -L "$DIST_LINK" ]; then
  echo "Refusing to replace $DIST_LINK because it is not a symlink"
  exit 1
fi

if [ ! -d "$JSONLD_DIR" ]; then
  echo "JSONLD_DIR does not exist: $JSONLD_DIR"
  exit 1
fi

JSONLD_DIR="$(cd "$JSONLD_DIR" && pwd)"

echo "Building $BUILD_OUTPUT_DIR using JSONLD_DIR=$JSONLD_DIR"
BUILD_OUTPUT_DIR="$BUILD_OUTPUT_DIR" JSONLD_DIR="$JSONLD_DIR" vike build

mkdir -p "$BUILD_OUTPUT_DIR/jsonld"
cp -R "$JSONLD_DIR"/. "$BUILD_OUTPUT_DIR/jsonld/"

normalise_tree_permissions "$BUILD_OUTPUT_DIR"
switch_live_dist

echo "$DIST_LINK now points to $BUILD_OUTPUT_DIR"
