const CACHE_NAME = "burger-clicker-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./css/pets.css",
    "./css/tooltips.css",
    "./js/core.js",
    "./js/systems.js",
    "./js/main.js",
    "./js/tooltips.js",
    "./js/settings.js",
    "./manifest.json",
    "./media/background.jpg",
    "./media/art_1.png",
    "./media/art_2.png",
    "./media/click.mp3",
    "./media/music.mp3",
    "./media/pwa-icon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    if (!response || response.status !== 200 || response.type === "opaque") {
                        return response;
                    }

                    const copia = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
                    return response;
                })
                .catch(() => caches.match("./index.html"));
        })
    );
});
