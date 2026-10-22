/* Burger Clicker PWA Service Worker */
const CACHE_PREFIX = "burger-clicker-";
const CACHE_NAME = "burger-clicker-v19";
const APP_SHELL = [
    "/",
    "/index.html",
    "/manifest.json",
    "/style.css",
    "/css/pets.css",
    "/css/tooltips.css",
    "/css/settings.css",
    "/css/navigation.css",
    "/css/welcome.css",
    "/js/core.js",
    "/js/systems.js",
    "/js/main.js",
    "/js/audio.js",
    "/js/audio-diagnostics.js",
    "/js/welcome.js",
    "/js/tooltips.js",
    "/js/settings.js",
    "/js/settings-compat.js",
    "/js/pwa.js",
    "/js/reset.js",
    "/js/navigation.js",
    "/media/background.jpg",
    "/media/art_1.png",
    "/media/art_2.png",
    "/media/click.wav",
    "/media/music.mp3",
    "/media/pwa-icon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await Promise.allSettled(APP_SHELL.map(async path => {
            try {
                const response = await fetch(path, { cache: "no-cache" });
                if (response.ok && response.type === "basic") await cache.put(path, response);
            } catch (error) {
                console.warn("[Burger Clicker PWA] Falha ao pré-cachear:", path, error);
            }
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names
            .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
            .map(name => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
    if (event.data?.type === "CLEAR_APP_CACHE") {
        event.waitUntil(caches.keys().then(names =>
            Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX)).map(name => caches.delete(name)))
        ));
    }
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const response = await fetch(request, { cache: "no-store" });
                if (response?.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put("/index.html", response.clone());
                }
                return response;
            } catch {
                const cached = await caches.match(request) || await caches.match("/index.html") || await caches.match("/");
                return cached || new Response(
                    "<!doctype html><html lang=\"pt-BR\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Sem conexão</title><body style=\"font-family:system-ui;text-align:center;padding:2rem\"><h1>🍔 Burger Clicker</h1><p>Você está sem conexão. Conecte-se à internet e tente novamente.</p></body></html>",
                    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
                );
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
            const response = await fetch(request);
            if (response?.ok && response.type === "basic") {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(request, response.clone());
            }
            return response;
        } catch {
            return new Response("", { status: 504, statusText: "Offline" });
        }
    })());
});
