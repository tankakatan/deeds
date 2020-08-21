FROM node:alpine

COPY server /app

WORKDIR /app

ENTRYPOINT [ "node" ]