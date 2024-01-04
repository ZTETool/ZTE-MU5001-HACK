FROM node:alpine

ARG MANIFEST_PATH
ARG COMMAND

WORKDIR /zte

COPY src/content.js content.js
COPY src/hack.js hack.js
COPY $MANIFEST_PATH manifest.json

RUN chown -R root:root /zte && \
    npm install -g web-ext

ENV COMMAND=$COMMAND

CMD $COMMAND
