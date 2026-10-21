const CACHE_NAME = "burger-clicker-v4";

const APP_SHELL = [
    "/",
    "/index.html",
    "/style.css",
    "/css/pets.css",
    "/css/tooltips.css",
    "/css/settings.css",
    "/js/core.js",
    "/js/systems.js",
    "/js/main.js",
    "/js/tooltips.js",
    "/js/settings.js",
    "/js/settings-compat.js",
    "/js/pwa.js",
    "/manifest.json",
    "/media/background.jpg",
    "/media/art_1.png",
    "/media/art_2.png",
    "/media/click.mp3",
    "/media/music.mp3",
    "/media/pwa-icon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        // Um único arquivo ausente não pode impedir a instalação do PWA inteiro.
        await Promise.allSettled(
            APP_SHELL.map(async url => {
                try {
                    const response = await fetch(url, { cache: "no-cache" });
                    if (response.ok) await cache.put(url, response);
                } catch (error) {
                    console.warn("Burger Clicker SW: não foi possível armazenar", url, error);
                }
            })
        );

        await self.skipWaiting();
    })());
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter(key => key.startsWith("burger-clicker-") && key !== CACHE_NAME)
                .map(key => caches.delete(key))
        );
        await self.clients.claim();
    })());
});

self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const request = event.request;
    const url = new URL(request.url);

    // Navegação: tenta sempre a versão online primeiro para evitar que uma
    // instalação antiga do Edge abra uma página desatualizada ou incompleta.
    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const response = await fetch(request, { cache: "no-store" });
                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put("/index.html", response.clone());
                }
                return response;
            } catch {
                return (await caches.match(request)) ||
                    (await caches.match("/index.html")) ||
                    new Response("Burger Clicker offline", {
                        status: 503,
                        headers: { "Content-Type": "text/plain; charset=utf-8" }
                    });
            }
        })());
        return;
    }

    // Arquivos locais: cache primeiro para carregamento rápido/offline;
    // quando não houver cache, busca na rede e guarda a cópia.
    if (url.origin === self.location.origin) {
        event.respondWith((async () => {
            const cached = await caches.match(request);
            if (cached) return cached;

            try {
                const response = await fetch(request);
                if (response.ok && response.type !== "opaque") {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, response.clone());
                }
                return response;
            } catch {
                return Response.error();
            }
        })());
    }
});
