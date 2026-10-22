"use strict";

/*
 * Burger Clicker PWA
 * A instalação automática é oferecida pelo navegador quando elegível.
 * Quando não é oferecida, mostramos instruções adequadas à plataforma:
 * os sites não podem forçar a instalação nem contornar as regras do sistema.
 */
(() => {
    const SW_URL = "/sw.js";
    const APP_SCOPE = "/";
    let deferredInstallPrompt = null;
    let registration = null;
    let installInProgress = false;

    const get = id => document.getElementById(id);

    function isStandalone() {
        return window.matchMedia("(display-mode: standalone)").matches ||
            window.matchMedia("(display-mode: minimal-ui)").matches ||
            window.matchMedia("(display-mode: fullscreen)").matches ||
            window.navigator.standalone === true;
    }

    function platformInstructions() {
        const ua = navigator.userAgent || "";
        const isIOS = /iPad|iPhone|iPod/.test(ua) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/i.test(ua);
        const isEdge = /Edg\//i.test(ua);
        const isChrome = /Chrome\//i.test(ua) && !isEdge;
        const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg|FxiOS/i.test(ua);

        if (isIOS) {
            return "iPhone/iPad: abra este site no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”. A instalação por botão automático não é oferecida em todos os navegadores do iOS.";
        }
        if (isAndroid) {
            return "Android: use Chrome ou um navegador compatível e abra o menu ⋮. Escolha “Instalar app” ou “Adicionar à tela inicial”, se aparecer.";
        }
        if (isEdge) {
            return "Windows/Edge: abra ⋯ > Aplicativos > Instalar este site como um aplicativo. Em outros sistemas, procure a opção de instalar no menu do navegador.";
        }
        if (isChrome) {
            return "Computador/Chrome: procure o ícone Instalar na barra de endereço ou abra ⋮ > Transmitir, salvar e compartilhar > Instalar página como app (o nome pode variar).";
        }
        if (isSafari) {
            return "Safari no Mac: procure “Adicionar ao Dock” no menu Arquivo, caso sua versão do macOS ofereça esse recurso.";
        }
        return "Abra o menu do navegador e procure “Instalar aplicativo” ou “Adicionar à tela inicial”. A opção depende do navegador e do sistema operacional.";
    }

    function setStatus(message) {
        const status = get("configInstalacaoStatus");
        if (status) status.textContent = message;
    }

    function setButtonState() {
        const button = get("configInstalarBtn");
        if (!button) return;

        if (isStandalone()) {
            button.disabled = true;
            button.textContent = "✅ Aplicativo aberto";
            setStatus("O Burger Clicker está aberto em modo aplicativo. " + platformInstructions());
            return;
        }

        button.disabled = installInProgress;
        button.textContent = installInProgress ? "⏳ Abrindo instalação…" : "📱 Instalar aplicativo";
        if (deferredInstallPrompt) {
            setStatus("Seu navegador oferece instalação automática. Toque no botão para continuar.");
        } else {
            setStatus("A instalação automática ainda não foi disponibilizada por este navegador. " + platformInstructions());
        }
    }

    async function install() {
        if (isStandalone()) {
            setStatus("O Burger Clicker já está aberto em modo aplicativo.");
            return;
        }
        if (installInProgress) return;

        if (!deferredInstallPrompt) {
            setStatus(platformInstructions());
            return;
        }

        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;
        installInProgress = true;
        setButtonState();

        try {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice?.outcome === "accepted") {
                setStatus("✅ Pedido de instalação aceito. Siga as próximas etapas mostradas pelo navegador.");
            } else {
                setStatus("Instalação cancelada. Você pode tentar novamente pelo menu do navegador.");
            }
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha ao abrir instalação:", error);
            setStatus("Não foi possível abrir a instalação automática. " + platformInstructions());
        } finally {
            installInProgress = false;
            setButtonState();
        }
    }

    function captureInstallPrompt(event) {
        event.preventDefault();
        deferredInstallPrompt = event;
        setButtonState();
    }

    function setupInstallButton() {
        const button = get("configInstalarBtn");
        if (button && !button.dataset.pwaBound) {
            button.dataset.pwaBound = "true";
            // Captura antes do listener antigo de settings.js para impedir prompts duplicados.
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                install();
            }, true);
        }

        window.addEventListener("appinstalled", () => {
            deferredInstallPrompt = null;
            installInProgress = false;
            setButtonState();
            setStatus("🎉 Burger Clicker instalado! Você já pode abri-lo pelo ícone criado pelo sistema.");
        });

        setButtonState();
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            setStatus("Este navegador não oferece suporte a Service Worker. O jogo continua disponível como site, mas instalação/offline podem não funcionar.");
            return;
        }

        // Service Workers exigem HTTPS, exceto em ambientes locais de desenvolvimento.
        if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
            setStatus("Para ativar instalação e funcionamento offline, abra o Burger Clicker por HTTPS.");
            return;
        }

        try {
            registration = await navigator.serviceWorker.register(SW_URL, {
                scope: APP_SCOPE,
                updateViaCache: "none"
            });

            await registration.update().catch(() => {});

            if (registration.waiting) {
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            registration.addEventListener("updatefound", () => {
                const worker = registration.installing;
                if (!worker) return;
                worker.addEventListener("statechange", () => {
                    if (worker.state === "installed" && navigator.serviceWorker.controller) {
                        worker.postMessage({ type: "SKIP_WAITING" });
                    }
                });
            });

            navigator.serviceWorker.addEventListener("controllerchange", () => {
                console.info("[Burger Clicker PWA] Service Worker atualizado.");
            });

            console.info("[Burger Clicker PWA] Service Worker registrado:", registration.scope);
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha ao registrar Service Worker:", error);
            setStatus("O jogo abre normalmente, mas não foi possível ativar o modo offline. Atualize a página e verifique a conexão.");
        }
    }

    function init() {
        setupInstallButton();
        registerServiceWorker();
    }

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    window.BurgerClickerPWA = {
        isStandalone,
        install,
        get registration() { return registration; },
        getInstallInstructions: platformInstructions
    };
})();
