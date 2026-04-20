# openbabel-docker

Web service that converts between molecule formats using [OpenBabel](https://openbabel.org/).

## Installation with Docker

The service is distributed as a Docker image at `ghcr.io/cheminfo/openbabel-docker`.

```bash
git clone https://github.com/cheminfo/openbabel-docker.git
cd openbabel-docker

cp .env.example .env
cp compose.example.yaml compose.yaml

# Run the released image:
docker compose pull && docker compose up -d

# Or rebuild from the current checkout:
docker compose up -d --build
```

The default port is `20808`. Change it by editing `PORT` in `.env`.
Open [http://localhost:20808/](http://localhost:20808/) to access the Swagger UI.

### Cloudflare Tunnel deployment

For a publicly-reachable deployment behind Cloudflare Tunnel (no host port published):

```bash
cp .env.example .env
cp compose.example.cloudflared.yaml compose.yaml
```

In the Cloudflare dashboard (<https://dash.cloudflare.com>):

1. Navigate to **Networking → Tunnels → Create a tunnel → Cloudflared connector**.
2. Copy the generated token into `.env` as `TUNNEL_TOKEN=...`.
3. Open the tunnel, go to the **Published applications** tab, and add an application with:
   - **Public hostname**: `openbabel.lactame.com` (or another domain you control)
   - **Service type**: HTTP
   - **Service URL**: `openbabel:20808` (match `PORT` from `.env`)

Then start the stack:

```bash
docker compose up -d
```

### Traefik deployment

For a host that already runs a [Traefik](https://traefik.io/) reverse proxy on
an external Docker network named `traefik` (with a `websecure` entrypoint and
a `letsencrypt` cert resolver):

```bash
cp .env.example .env
cp compose.example.traefik.yaml compose.yaml
docker compose up -d
```

Edit the `Host(...)` label in `compose.yaml` to point at the public hostname
you have configured for this service (default `openbabel.lactame.com`).

## Local development

```bash
npm install
npm run dev
```

`PORT` and `BABEL` are read from the environment (with `.env` auto-loaded via
`node --env-file-if-exists=.env`). By default `BABEL` is auto-detected from
`/opt/homebrew/bin/obabel` and `/usr/bin/obabel`.

Run the full check (tests + eslint + prettier):

```bash
npm test
```

## License

[MIT](./LICENSE)

OpenBabel is subject to [its own license](https://github.com/openbabel/openbabel/blob/master/COPYING).
