# Stremio Web — Home Assistant theme (branch `ha-theme`)

A small patch set on top of [Stremio/stremio-web](https://github.com/Stremio/stremio-web) for people who
self-host Stremio Web and embed it in a **Home Assistant** dashboard (iframe panel), e.g. next to a
self-hosted Stremio streaming server.

## Changes

1. **Home Assistant dark look** — background `#111111`, panels/modals `#1c1c1c`, accent `#03a9f4`
   (HA's default blue) instead of Stremio's purple, and a flat background instead of the purple gradient.
2. **Side navigation on the right** on desktop widths (mobile keeps the bottom bar), so it does not sit
   next to Home Assistant's own sidebar.
3. **Not inverted by dark-mode extensions** — a `color-scheme` meta and a `prefers-color-scheme` rule in
   `index.html`, so extensions such as Deluminate treat the app as already dark (it renders no text at
   load time, so they used to invert it).
4. **Facebook / Apple login inside embedded WebViews** (e.g. the Home Assistant Android app):
   - if the login popup cannot open, the top window is sent to the login page instead (the app hands it
     to the browser);
   - the polling for the login result lasts up to 5 minutes instead of 25 seconds;
   - the «Authenticating» dialog shows the login link with a copy button, so it can be opened on any
     browser or device while the dialog keeps waiting.

## Build and serve

```bash
pnpm install --frozen-lockfile
pnpm run build          # static files in ./build
docker run -d -p 8095:80 -v "$PWD/build:/usr/share/nginx/html:ro" nginx:alpine
```

Point the Home Assistant iframe at your URL; add `?streamingServerUrl=https://your-server/` to preset
your streaming server.

License: GPL-2.0, as upstream.
