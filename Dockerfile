FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openbabel \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /node

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=20808
EXPOSE 20808

USER node

CMD ["node", "src/index.js"]
