"use strict";

(() => {
    const SW_URL = "/sw.js";
    const APP_SCOPE = "/";
    let deferredInstallPrompt = null;
    let updateRegistration = null;

    const get = id => document.getElementById(id);

    function isStandalone() {
        return window.matchMedia("(display-mode: standalone)").matches ||
            window.matchMedia("(display-mode: fullscreen)").matches ||
            window.navigator.standalone === true;
    }

    function setStatus(message) {
        const status = get("configInstalacaoStatus");
        if (status) status.textContent = message;
    }

    function setInstallButtonState() {
        const button = get("configInstalarBtn");
        if (!button) return;

        if (isStandalone()) {
            button.disabled = true;
            button.textContent = "✅ Aplicativo já instalado";
            setStatus("O Burger Clicker está aberto no modo aplicativo.");
            return;
        }

        button.disabled = false;
        button.textContent = "📱 Instalar aplicativo";
        if (deferredInstallPrompt) {
            setStatus("Este navegador disponibilizou a instalação. Clique no botão acima.");
        }
    }

    async function install() {
        if (isStandalone()) {
            setStatus("O Burger Clicker já está aberto como aplicativo.");
            return;
        }

        if (!deferredInstallPrompt) {
            setStatus("O navegador não liberou a instalação por este botão. No Microsoft Edge, use ⋯ > Aplicativos > Instalar este site como um aplicativo.");
            return;
        }

        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;

        try {
            await promptEvent.prompt();
            const result = await promptEvent.userChoice;
            setStatus(result.outcome === "accepted"
                ? "✅ Instalação aceita. O aplicativo deve aparecer no Windows e no menu de aplicativos do navegador."
                : "Instalação cancelada. Você pode tentar novamente pelo menu do navegador.");
        } catch (error) {
            console.warn("Burger Clicker PWA: erro ao instalar.", error);
            setStatus("❌ Não foi possível iniciar a instalação agora. Tente pelo menu do navegador.");
        }

        setInstallButtonState();
    }

    function captureInstallPrompt(event) {
        event.preventDefault();
        deferredInstallPrompt = event;
        setInstallButtonState();
    }

    function setupInstallButton() {
        const button = get("configInstalarBtn");
        if (!button) return;

        // Captura antes dos listeners antigos de settings.js. Isso evita dois prompts
        // concorrentes e garante que o mesmo evento de instalação seja usado.
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            install();
        }, true);

        window.addEventListener("appinstalled", () => {
            deferredInstallPrompt = null;
            setInstallButtonState();
        });

        setInstallButtonState();
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            setStatus("Este navegador não oferece suporte a Service Worker/PWA.");
            return;
        }

        try {
            updateRegistration = await navigator.serviceWorker.register(SW_URL, {
                scope: APP_SCOPE,
                updateViaCache: "none"
            });

            if (updateRegistration.waiting) {
                updateRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            updateRegistration.addEventListener("updatefound", () => {
                const worker = updateRegistration.installing;
                if (!worker) return;
                worker.addEventListener("statechange", () => {
                    if (worker.state === "installed" && navigator.serviceWorker.controller) {
                        worker.postMessage({ type: "SKIP_WAITING" });
                    }
                });
            });

            navigator.serviceWorker.addEventListener("controllerchange", () => {
                // A nova versão assumirá o controle na próxima navegação/reload.
                console.info("Burger Clicker PWA: Service Worker atualizado.");
            });

            console.info("Burger Clicker PWA: Service Worker registrado com sucesso.");
        } catch (error) {
            console.warn("Burger Clicker PWA: falha ao registrar Service Worker.", error);
            setStatus("⚠️ O aplicativo funciona no navegador, mas o modo offline não pôde ser ativado.");
        }
    }

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("load", () => {
        setupInstallButton();
        registerServiceWorker();
        setInstallButtonState();
    });

    window.BurgerClickerPWA = {
        isStandalone,
        install,
        get registration() { return updateRegistration; }
    };
})();
