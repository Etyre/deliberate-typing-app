### Building

This is the command for building the image from the Dockerfile.

```
docker build -t eli/postgres:1.0 .
```

### Running

This is the command for running the image, after it is built.

```
docker run -p 5432:5432 -t eli/postgres:1.0
```

### Connecting

This is the command, for running in the docker CLI, to connect to the database.

```
psql -U elityre -d deliberate_typing_app
```
