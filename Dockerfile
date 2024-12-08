FROM --platform=linux/amd64 node:22-alpine AS dev

WORKDIR /usr/src/app
COPY --chown=node:node package.json .
RUN yarn install
COPY --chown=node:node . .

FROM --platform=linux/amd64 node:22-alpine AS build

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --chown=node:node package.json ./
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN yarn build

FROM --platform=linux/amd64 node:22-alpine AS production

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium@edge \
    nss@edge \
    harfbuzz@edge \
    ttf-freefont@edge \
    font-noto-cjk@edge

WORKDIR /app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 80
CMD ["sh", "-c", "yarn start:prod"]
