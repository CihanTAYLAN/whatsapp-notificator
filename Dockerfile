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
RUN yarn db:generate
RUN yarn build

FROM --platform=linux/amd64 node:20-alpine AS production
WORKDIR /app
COPY --chown=node:node --from=BUILD /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=BUILD /usr/src/app/dist ./dist
COPY --chown=node:node --from=BUILD /usr/src/app/prisma ./prisma
COPY --chown=node:node ./public ./public
COPY --from=BUILD /usr/src/app/package.json ./package.json

#ENV NODE_OPTIONS="--openssl-legacy-provider"

EXPOSE 80
CMD ["sh", "-c", "yarn db:push && yarn start:prod"]
# CMD ["sh", "-c", "yarn db:push && yarn db:seed && yarn start:prod"]
