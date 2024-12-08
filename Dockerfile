FROM node:22-bullseye AS dev

WORKDIR /usr/src/app
COPY package.json .
RUN yarn install
COPY . .

FROM node:22-bullseye AS build

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
COPY --from=dev /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:22-bullseye AS production

ENV CHROME_BIN=/usr/bin/google-chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libpango1.0-0 \
    libnss3 \
    lsb-release \
    xdg-utils \
    chromium

WORKDIR /app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 80
CMD ["sh", "-c", "yarn start:prod"]
