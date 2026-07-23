#!/usr/bin/env sh
set -eu

REPOSITORY_URL=${1:?"Usage: deploy-source.sh <repository-url> <git-revision>"}
REVISION=${2:?"Usage: deploy-source.sh <repository-url> <git-revision>"}
APP_DIR=${APP_DIR:-/home/ubuntu/apps/admin-project}

mkdir -p "$(dirname "$APP_DIR")"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone --no-checkout "$REPOSITORY_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git remote set-url origin "$REPOSITORY_URL"
git fetch --depth=1 origin "$REVISION"
git checkout --detach --force FETCH_HEAD

IMAGE_TAG=$REVISION docker compose build web
./scripts/deploy-image.sh "admin-project:$REVISION"
