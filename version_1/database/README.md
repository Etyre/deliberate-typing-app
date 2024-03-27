### Building

This is the command for building the image from the Dockerfile.

```
docker build -t eli/postgres:1.0 .
```

### Running

The easiest way to run the image (making a container from the image), after it is built, is with the following terminal command, from inside the database directory:

```
bash ./scripts/run.sh
```

That runs a file in the scripts folder with the following bash commands.

```
docker container stop eli-postgres
docker rm eli-postgres
docker run -p 5432:5432 -v "/$PWD/volumes/data":"/var/lib/postgresql/data" --name=eli-postgres -t eli/postgres:1.0
```

It does three things:

- Stops the old container named eli-postgres (if there is one)
- Deletes the old container named eli-postgres (if there is one)
- Runs a new container at the inner prt 5432, and the outer port 5432, creating a volume with the data folder on my machine, using the the eli/postgres image, and naming the container eli-postgres

### Run SQL commands

To open up an interactive terminal that access the container (always do this one first):

```
docker exec -it eli-postgres psql -U elityre -d deliberate_typing_app
```

To check the tables in the SQL database inside of the prisma thing:

```
\dt;
```
