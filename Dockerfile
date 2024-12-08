FROM --platform=linux/amd64 node:20-alpine AS DEV

WORKDIR /usr/src/app
COPY --chown=node:node package.json .
RUN yarn install
COPY --chown=node:node . .

FROM --platform=linux/amd64 node:20-alpine AS BUILD

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node package.json ./
COPY --chown=node:node --from=DEV /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN yarn build

FROM --platform=linux/amd64 node:20-alpine AS production

ENV CHROME_BIN=/usr/bin/chromium-browser
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium@edge \
    nss@edge

WORKDIR /app
COPY --chown=node:node --from=BUILD /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=BUILD /usr/src/app/dist ./dist
COPY --from=BUILD /usr/src/app/package.json ./package.json

EXPOSE 80
CMD ["sh", "-c", "yarn start:prod"]
