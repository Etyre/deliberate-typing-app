docker container stop eli-postgres
docker rm eli-postgres
docker network create deliberate-typing-network
docker run -p 5432:5432 -v "/$PWD/volumes/data":"/var/lib/postgresql/data" --name=eli-postgres -t eli/postgres:1.0 
docker network connect deliberate-typing-network eli-postgres
