docker container stop eli-backend
docker rm eli-backend
docker run -p 3000:3000 -v "/$PWD/secrets/jwtRS256.key":"/app/secrets/jwtRS256.key" -v "/$PWD/secrets/jwtRS256.key.pub":"/app/secrets/jwtRS256.key.pub" --name=eli-backend -t eli/backend:1.0 