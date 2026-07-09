# ── Stage 1: build the frontend ──────────────────────────────────────────────
FROM node:24-bookworm-slim AS frontend-builder

WORKDIR /node

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
RUN npm ci

COPY frontend ./frontend
RUN npm run build --workspace=frontend

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openbabel \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /node

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --workspaces=false

COPY src ./src
COPY --from=frontend-builder /node/frontend/dist ./frontend/dist

ENV PORT=20808
EXPOSE 20808

USER node

CMD ["node", "src/index.js"]
