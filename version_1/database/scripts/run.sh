docker container stop eli-postgres
docker rm eli-postgres
docker run -p 5432:5432 -v "/$PWD/volumes/data":"/var/lib/postgresql/data" --name=eli-postgres -t eli/postgres:1.0 