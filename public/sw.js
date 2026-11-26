// Hand-written service worker. App shell is precached; everything else is stale-while-revalidate with a size cap.
// shortcut: JS/CSS chunks are cached on the first controlled load, so the very first offline visit needs one reload online. Upgrade by listing chunks at build time.
const V = "pv-v1";
const SHELL = `${V}-shell`;
const RUN = `${V}-run`;
const CAP = 60;
const PRECACHE = [
  "/", "/offline", "/manifest.webmanifest", "/tvrc-mark.svg",
  "/images/bg-home.webp", "/images/logo-platinum-vibe.webp", "/images/logo-platinum-corp.webp",
  "/images/card-show-flat.webp", "/images/card-aerial-view.webp", "/images/card-amenities.webp", "/images/card-connectivity.webp",
  "/images/card-renders.webp", "/images/card-presentation.webp", "/images/card-3d-elevation.webp", "/images/card-plans.webp",
];

// A new version waits and activates on the next load, never mid-tour.
self.addEventListener("install", (e) => e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE))));

self.addEventListener("activate", (e) =>
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("pv-") && !k.startsWith(V)).map((k) => caches.delete(k))))),
);

async function put(request, res) {
  if (res.status !== 200 || /no-store/.test(res.headers.get("cache-control") || "")) return;
  const cache = await caches.open(RUN);
  await cache.put(request, res);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - CAP)).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (e) => {
  const request = e.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).then((res) => { e.waitUntil(put(request, res.clone())); return res; })
        .catch(() => caches.match(request).then((hit) => hit || caches.match("/offline"))),
    );
    return;
  }
  e.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request).then((res) => { e.waitUntil(put(request, res.clone())); return res; });
      return hit || net.catch(() => caches.match("/offline"));
    }),
  );
});
