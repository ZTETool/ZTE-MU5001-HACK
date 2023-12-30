FROM node:alpine

RUN npm install -g web-ext

WORKDIR /zte

COPY . .

CMD ["web-ext", "sign", "--api-key=${MOZILLA_API_KEY}", "--api-secret=${MOZILLA_API_SECRET}"]
