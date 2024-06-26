source .env

docker container stop deliberate-typing-pgadmin
docker rm deliberate-typing-pgadmin
bash ./scripts/build.sh
docker network create deliberate-typing-network
docker run -d -p 8080:8080 -v "/$PWD/data":/var/lib/pgadmin --name deliberate-typing-pgadmin -t deliberate-typing/pgadmin:1.0
docker network connect deliberate-typing-network deliberate-typing-pgadmin

$SHELL