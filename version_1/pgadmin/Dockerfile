FROM dpage/pgadmin4:8.2

ARG PORT
ENV PGADMIN_LISTEN_PORT=${PORT}

ARG ADMIN_EMAIL
ENV PGADMIN_DEFAULT_EMAIL=elityre@gmail.com

ARG ADMIN_PASSWORD
ENV PGADMIN_DEFAULT_PASSWORD=${ADMIN_PASSWORD}

ENV PGADMIN_LISTEN_ADDRESS=0.0.0.0

# TODO: Investigate this
# Source: https://stackoverflow.com/questions/54433522/docker-compose-and-postgres-name-does-not-resolve?rq=3
USER root

RUN apk update && apk add bind-tools

USER pgadmin

EXPOSE ${PORT}
