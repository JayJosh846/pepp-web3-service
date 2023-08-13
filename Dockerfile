FROM node:14.16.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /token-chats

COPY . .

RUN npm cache verify

RUN npm install

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "server.js" ]
