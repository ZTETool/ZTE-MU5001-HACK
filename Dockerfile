FROM node:alpine

ARG COMMAND

WORKDIR /zte

COPY src/chart.bundle.min.js chart.bundle.min.js
COPY src/chart.css chart.css
COPY src/chart.html chart.html
COPY src/content.js content.js
COPY src/hack.js hack.js
COPY src/manifest.json manifest.json

RUN chown -R root:root /zte && \
    npm install -g web-ext

ENV COMMAND=$COMMAND
