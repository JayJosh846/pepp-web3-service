FROM node:14.16.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /token-chats-staging

COPY . .

RUN npm cache verify

RUN npm install

ENV NODE_ENV=development

EXPOSE 3001

CMD [ "node", "server.js" ]
