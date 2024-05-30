source .env

docker build -t eli/postgres:1.0 . \
--build-arg POSTGRES_USER=$POSTGRES_USER \
--build-arg POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
--build-arg PORT=$PORT 