#!/usr/bin/env sh
set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_DIR"

if [ -n "$(git status --porcelain)" ]; then
  echo "Deployment stopped: the server checkout has uncommitted changes." >&2
  exit 1
fi

git pull --ff-only
docker compose up --detach --build --remove-orphans

container_id=$(docker compose ps --quiet web)
if [ -z "$container_id" ]; then
  echo "Deployment failed: web container was not created." >&2
  exit 1
fi

attempt=0
while [ "$attempt" -lt 20 ]; do
  status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")
  if [ "$status" = "healthy" ]; then
    docker compose ps
    echo "Deployment completed: http://127.0.0.1:8080 is healthy."
    exit 0
  fi
  if [ "$status" = "unhealthy" ] || [ "$status" = "exited" ] || [ "$status" = "dead" ]; then
    docker compose logs --tail=100 web
    echo "Deployment failed: container status is $status." >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 2
done

docker compose logs --tail=100 web
echo "Deployment failed: health check timed out." >&2
exit 1
