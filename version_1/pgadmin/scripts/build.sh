source .env
docker build --progress=plain -t deliberate-typing/pgadmin:1.0 \
  --build-arg PORT="$PORT" \
  --build-arg ADMIN_EMAIL="$ADMIN_EMAIL" \
  --build-arg ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  .