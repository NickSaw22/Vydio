# Docker Commands

Run these commands from the `vydio-web-client` directory. Docker Desktop must be
running before you use Docker commands.

## Build and run locally

```sh
docker build --tag vydio-web-client:test .
docker run --detach --rm \
  --name vydio-web-client-check \
  --publish 127.0.0.1:3000:3000 \
  vydio-web-client:test
```

Verify the app responds:

```sh
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:3000/
```

Stop the container when finished:

```sh
docker stop vydio-web-client-check
```

## Build and push for Cloud Run

Authenticate Docker with Artifact Registry and set the image name:

```sh
gcloud auth configure-docker us-central1-docker.pkg.dev

REGISTRY=us-central1-docker.pkg.dev/vydio-db876/vydio-web-client-repo
IMAGE=$REGISTRY/vydio-web-client
```

Build and push a Linux AMD64 image. Disabling provenance avoids an OCI image
index that may not be accepted by Cloud Run:

```sh
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --tag "$IMAGE:latest" \
  --push \
  .
```

Verify the published image includes `linux/amd64`:

```sh
docker buildx imagetools inspect "$IMAGE:latest"
```

## Deploy to Cloud Run

```sh
gcloud run deploy vydio-web-client \
  --image "$IMAGE:latest" \
  --region us-central1 \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 1 \
  --allow-unauthenticated
```
