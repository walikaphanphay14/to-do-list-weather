const C = "tw-v2";
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["/", "/manifest.webmanifest", "/icon.svg"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const isFont = FONT_HOSTS.includes(u.hostname);
  if (u.origin !== location.origin && !isFont) return;
  e.respondWith(caches.open(C).then(async c => {
    const net = fetch(r).then(res => { if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; }).catch(() => null);
    if (u.origin === location.origin && u.pathname.startsWith("/api/")) {
      const res = await net;
      return res || (await c.match(r)) || new Response("{}", { status: 504 });
    }
    const hit = await c.match(r);                                         
    if (hit) return hit;
    const res = await net;
    if (res) return res;
    if (isFont) return new Response("", { status: 504 });
    return (r.mode === "navigate" && (await c.match("/"))) || new Response("", { status: 504 });
  }));
});
