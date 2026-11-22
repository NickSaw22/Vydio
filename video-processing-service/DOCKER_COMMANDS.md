# Docker Commands

Run these commands from the `video-processing-service` directory.

## Build the image

```sh
docker build --tag vydio-video-processing-service:test .
```

Set the registry image name:

```sh
REGISTRY=us-central1-docker.pkg.dev/vydio-db876/vydio-video-processing-repo
IMAGE=$REGISTRY/vydio-video-processing-service
```

## Build for Cloud Run

Cloud Run requires a Linux AMD64 image. Build and push that platform explicitly:

```sh
docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE:latest" \
  --push \
  .
```

## Build for Cloud Run and Apple Silicon

To publish one image tag usable on both Cloud Run (AMD64) and Apple Silicon
machines (ARM64), build and push both Linux platforms:

```sh
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag "$IMAGE:latest" \
  --push \
  .
```

Verify the published platforms:

```sh
docker buildx imagetools inspect "$IMAGE:latest"
```

For the multi-platform image, the output must include both `linux/amd64` and
`linux/arm64`. Cloud Run selects the AMD64 image. Deploy Cloud Run from the new
image tag or digest.

## Start the container

```sh
docker run --detach --rm \
  --name vydio-video-processing-service-check \
  --publish 127.0.0.1:3010:3000 \
  vydio-video-processing-service:test
```

## Verify the service and FFmpeg

```sh
curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3010/
docker exec vydio-video-processing-service-check id -u
docker exec vydio-video-processing-service-check ffmpeg -version
docker inspect --format '{{.State.Health.Status}}' vydio-video-processing-service-check
```

The HTTP check should return `Video Processing Service is running!`, and `id -u`
should return `1000` to confirm the service is not running as root.

## Stop the container

```sh
docker stop vydio-video-processing-service-check
```
