/* Burger Clicker PWA Service Worker */
const CACHE_PREFIX = "burger-clicker-";
const CACHE_NAME = "burger-clicker-v35";
const APP_SHELL = [
    "/", "/index.html", "/manifest.json", "/style.css",
    "/css/pets.css", "/css/tooltips.css", "/css/settings.css", "/css/navigation.css", "/css/welcome.css", "/css/glass-ui.css",
    "/js/core.js", "/js/systems.js", "/js/main.js", "/js/audio.js", "/js/audio-diagnostics.js", "/js/welcome.js", "/js/tooltips.js", "/js/settings.js", "/js/settings-compat.js",
    "/js/expansion-bridge.js", "/js/expansion.js", "/js/expansion-ui.js", "/js/statistics.js", "/js/statistics-accuracy.js",
    "/js/pwa.js", "/js/pwa-diagnostics.js", "/js/reset.js", "/js/navigation.js",
    "/media/background.jpg", "/media/art_1.png", "/media/art_2.png", "/media/click.wav", "/media/music.mp3", "/media/pwa-icon.svg"
];
self.addEventListener("install",event=>{event.waitUntil((async()=>{const c=await caches.open(CACHE_NAME);await Promise.allSettled(APP_SHELL.map(async p=>{try{const r=await fetch(p,{cache:"no-cache"});if(r.ok&&r.type==="basic")await c.put(p,r);}catch(e){console.warn("[Burger Clicker PWA] Falha ao pré-cachear:",p,e);}}));await self.skipWaiting();})());});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith(CACHE_PREFIX)&&n!==CACHE_NAME).map(n=>caches.delete(n)));await self.clients.claim();})());});
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting();if(event.data?.type==="CLEAR_APP_CACHE")event.waitUntil(caches.keys().then(ns=>Promise.all(ns.filter(n=>n.startsWith(CACHE_PREFIX)).map(n=>caches.delete(n)))));});
self.addEventListener("fetch",event=>{const r=event.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;if(r.mode==="navigate"){event.respondWith((async()=>{try{const x=await fetch(r,{cache:"no-store"});if(x?.ok){const c=await caches.open(CACHE_NAME);await c.put("/index.html",x.clone());}return x;}catch{const c=await caches.match(r)||await caches.match("/index.html")||await caches.match("/");return c||new Response("Sem conexão",{status:503});}})());return;}event.respondWith((async()=>{const c=await caches.match(r);if(c)return c;try{const x=await fetch(r);if(x?.ok&&x.type==="basic"){const c2=await caches.open(CACHE_NAME);await c2.put(r,x.clone());}return x;}catch{return new Response("",{status:504,statusText:"Offline"});}})());});
