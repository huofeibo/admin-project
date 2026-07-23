#!/usr/bin/env sh
set -eu

IMAGE_REF=${1:?"Usage: deploy-image.sh <image-ref>"}
CONTAINER_NAME=admin-project-web
HOST_PORT=8080

previous_image=$(docker inspect --format '{{.Config.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)

if ! docker image inspect "$IMAGE_REF" >/dev/null 2>&1; then
  echo "Deployment failed: image $IMAGE_REF is not loaded on the server." >&2
  exit 1
fi

if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
  docker rm --force "$CONTAINER_NAME"
fi

start_container() {
  image=$1
  docker run \
    --detach \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    --publish "127.0.0.1:${HOST_PORT}:80" \
    "$image"
}

start_container "$IMAGE_REF"

attempt=0
while [ "$attempt" -lt 20 ]; do
  status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$CONTAINER_NAME")
  if [ "$status" = "healthy" ]; then
    echo "Deployment completed: $IMAGE_REF"
    docker image prune --force >/dev/null
    exit 0
  fi

  if [ "$status" = "unhealthy" ] || [ "$status" = "exited" ] || [ "$status" = "dead" ]; then
    break
  fi

  attempt=$((attempt + 1))
  sleep 2
done

echo "New container failed its health check." >&2
docker logs --tail=100 "$CONTAINER_NAME" >&2 || true
docker rm --force "$CONTAINER_NAME" >/dev/null 2>&1 || true

if [ -n "$previous_image" ]; then
  echo "Rolling back to $previous_image" >&2
  start_container "$previous_image" >/dev/null
else
  echo "No previous image is available for rollback." >&2
fi

exit 1
