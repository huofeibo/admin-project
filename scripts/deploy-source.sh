#!/usr/bin/env sh
set -eu

ARCHIVE_PATH=${1:?"Usage: deploy-source.sh <archive-path> <git-revision>"}
REVISION=${2:?"Usage: deploy-source.sh <archive-path> <git-revision>"}
APP_ROOT=${APP_ROOT:-/home/ubuntu/apps/admin-project}
RELEASES_DIR="$APP_ROOT/releases"
RELEASE_DIR="$RELEASES_DIR/$REVISION"
STAGING_DIR="$RELEASES_DIR/.$REVISION.tmp"

case "$REVISION" in
  ''|*[!0-9a-f]*)
    echo "Deployment stopped: the revision must be a lowercase Git commit hash." >&2
    exit 1
    ;;
esac

if [ "${#REVISION}" -ne 40 ]; then
  echo "Deployment stopped: the revision must contain 40 characters." >&2
  exit 1
fi

if [ ! -s "$ARCHIVE_PATH" ]; then
  echo "Deployment stopped: source archive $ARCHIVE_PATH is missing or empty." >&2
  exit 1
fi

cleanup() {
  rm -f "$ARCHIVE_PATH"
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$RELEASES_DIR"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
tar -xzf "$ARCHIVE_PATH" -C "$STAGING_DIR"

rm -rf "$RELEASE_DIR"
mv "$STAGING_DIR" "$RELEASE_DIR"

cd "$RELEASE_DIR"
chmod +x scripts/deploy-image.sh

IMAGE_TAG=$REVISION docker compose build web
./scripts/deploy-image.sh "admin-project:$REVISION"

ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
echo "Active release: $RELEASE_DIR"
