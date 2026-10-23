"use strict";

/*
 * Burger Clicker PWA runtime.
 * Install and update prompts remain under browser/user control. A detected update
 * waits until the player explicitly chooses to apply it.
 */
(() => {
    const SW_URL = "/sw.js";
    const APP_SCOPE = "/";
    const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;
    let deferredInstallPrompt = null;
    let registration = null;
    let installInProgress = false;
    let updateInProgress = false;
    let reloadAfterControllerChange = false;
    let checkInProgress = false;

    const get = id => document.getElementById(id);
    const isStandalone = () =>
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        navigator.standalone === true;

    function platformInstructions() {
        const ua = navigator.userAgent || "";
        const isIOS = /iPad|iPhone|iPod/.test(ua) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/i.test(ua);
        const isEdge = /Edg\//i.test(ua);
        const isChrome = /Chrome\//i.test(ua) && !isEdge;
        const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg|FxiOS/i.test(ua);

        if (isIOS) return "iPhone/iPad: abra no navegador, toque em Compartilhar e escolha “Adicionar à Tela de Início”. O iOS não oferece instalação automática por botão.";
        if (isAndroid) return "Android: use o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”, se disponível.";
        if (isEdge) return "Edge: abra ⋯ > Aplicativos > Instalar este site como um aplicativo.";
        if (isChrome) return "Chrome: use o ícone Instalar na barra de endereço ou o menu ⋮ > Instalar página como app.";
        if (isSafari) return "Safari no Mac: procure Arquivo > Adicionar ao Dock, se disponível na sua versão.";
        return "Abra o menu do navegador e procure “Instalar aplicativo” ou “Adicionar à tela inicial”. A opção varia conforme navegador e sistema.";
    }

    function setStatus(message) {
        const status = get("configInstalacaoStatus");
        if (status) status.textContent = message;
    }

    function setUpdateStatus(message) {
        const status = get("pwaAtualizacaoStatus");
        if (status) status.textContent = message;
    }

    function setUpdateButtons({ available = false, checking = false, applying = false } = {}) {
        const check = get("pwaVerificarAtualizacaoBtn");
        const apply = get("pwaAplicarAtualizacaoBtn");
        if (check) {
            check.disabled = checking || applying;
            check.textContent = checking ? "⏳ Verificando…" : "🔎 Verificar atualizações";
        }
        if (apply) {
            apply.hidden = !available;
            apply.disabled = applying;
            apply.textContent = applying ? "⏳ Preparando atualização…" : "⬇️ Atualizar e reiniciar";
        }
    }

    function setInstallButtonState() {
        const button = get("configInstalarBtn");
        if (!button) return;
        if (isStandalone()) {
            button.disabled = true;
            button.textContent = "✅ Aplicativo aberto";
            setStatus("O Burger Clicker está aberto em modo aplicativo.");
            return;
        }
        button.disabled = installInProgress;
        button.textContent = installInProgress ? "⏳ Abrindo instalação…" : "📱 Instalar aplicativo";
        setStatus(deferredInstallPrompt
            ? "Seu navegador oferece instalação automática. Toque no botão para continuar."
            : "A instalação automática depende do navegador. " + platformInstructions());
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
        setInstallButtonState();
        try {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            setStatus(choice?.outcome === "accepted"
                ? "✅ Pedido de instalação aceito. Conclua as etapas mostradas pelo navegador."
                : "Instalação cancelada. Você pode tentar novamente pelo menu do navegador.");
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha na instalação:", error);
            setStatus("Não foi possível abrir a instalação automática. " + platformInstructions());
        } finally {
            installInProgress = false;
            setInstallButtonState();
        }
    }

    function captureInstallPrompt(event) {
        event.preventDefault();
        deferredInstallPrompt = event;
        setInstallButtonState();
    }

    function showUpdateAvailable() {
        setUpdateButtons({ available: true });
        setUpdateStatus("✨ Uma nova versão está pronta. Toque em “Atualizar e reiniciar” quando quiser aplicar a atualização.");
    }

    function watchInstallingWorker(worker) {
        if (!worker) return;
        worker.addEventListener("statechange", () => {
            if (worker.state !== "installed") return;
            if (navigator.serviceWorker.controller) {
                showUpdateAvailable();
            } else {
                setUpdateStatus("✅ O suporte offline foi preparado. Recarregue a página se algum recurso ainda não estiver disponível.");
            }
        });
    }

    async function checkForUpdates(manual = false) {
        if (checkInProgress) return;
        if (!("serviceWorker" in navigator) || !registration) {
            setUpdateStatus("Atualizações PWA indisponíveis: o Service Worker ainda não está registrado neste navegador.");
            return;
        }
        if (!navigator.onLine) {
            setUpdateStatus("Você está offline. Conecte-se à internet para verificar se há uma nova versão.");
            return;
        }
        checkInProgress = true;
        setUpdateButtons({ checking: true });
        if (manual) setUpdateStatus("Verificando a versão publicada…");
        try {
            if (registration.waiting && navigator.serviceWorker.controller) {
                showUpdateAvailable();
                return;
            }
            await registration.update();
            if (registration.waiting && navigator.serviceWorker.controller) {
                showUpdateAvailable();
            } else if (registration.installing) {
                watchInstallingWorker(registration.installing);
                setUpdateStatus("Uma verificação encontrou recursos novos. Aguardando a instalação segura da atualização…");
            } else {
                setUpdateButtons({ available: false });
                setUpdateStatus(manual
                    ? "✅ Você já está usando a versão disponível. Nenhuma atualização foi encontrada."
                    : "Atualizações verificadas automaticamente. Nenhuma nova versão disponível.");
            }
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha ao verificar atualização:", error);
            setUpdateStatus(navigator.onLine
                ? "Não foi possível verificar agora. Tente novamente em instantes."
                : "Sem conexão. A verificação será possível quando a internet voltar.");
        } finally {
            checkInProgress = false;
            const available = !!(registration?.waiting && navigator.serviceWorker.controller);
            setUpdateButtons({ available });
        }
    }

    async function applyUpdate() {
        if (updateInProgress || !registration?.waiting) {
            setUpdateStatus("Nenhuma atualização pronta para aplicar. Verifique novamente.");
            return;
        }
        updateInProgress = true;
        reloadAfterControllerChange = !!navigator.serviceWorker.controller;
        setUpdateButtons({ available: true, applying: true });
        setUpdateStatus("Aplicando a atualização. O aplicativo será recarregado; seu progresso salvo pelo jogo não deve ser apagado.");
        try {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
            if (!reloadAfterControllerChange) {
                setUpdateStatus("A atualização foi solicitada. Recarregue a página para carregar os novos recursos.");
                updateInProgress = false;
                setUpdateButtons({ available: false });
            }
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha ao aplicar atualização:", error);
            updateInProgress = false;
            setUpdateButtons({ available: true });
            setUpdateStatus("Não foi possível aplicar a atualização. Feche outras janelas do app e tente novamente.");
        }
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            setUpdateStatus("Este navegador não oferece Service Worker. O jogo continua disponível como site, mas recursos offline e atualização PWA não ficam disponíveis.");
            setStatus("Service Worker indisponível neste navegador.");
            return;
        }
        if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
            setUpdateStatus("Abra o jogo por HTTPS para habilitar o Service Worker e a verificação de atualizações.");
            return;
        }
        try {
            registration = await navigator.serviceWorker.register(SW_URL, {
                scope: APP_SCOPE,
                updateViaCache: "none"
            });

            registration.addEventListener("updatefound", () => {
                const worker = registration.installing;
                if (worker) watchInstallingWorker(worker);
            });

            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (reloadAfterControllerChange) {
                    reloadAfterControllerChange = false;
                    window.location.reload();
                    return;
                }
                setUpdateStatus("Service Worker ativo. As próximas atualizações serão verificadas automaticamente.");
            });

            if (registration.waiting && navigator.serviceWorker.controller) {
                showUpdateAvailable();
            } else {
                setUpdateStatus("Verificação automática de atualizações ativada. Você pode verificar manualmente quando quiser.");
            }

            // Verify on startup, when returning to the app, and periodically while open.
            checkForUpdates(false);
            window.addEventListener("focus", () => checkForUpdates(false));
            window.addEventListener("online", () => checkForUpdates(false));
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") checkForUpdates(false);
            });
            window.setInterval(() => {
                if (document.visibilityState === "visible") checkForUpdates(false);
            }, UPDATE_CHECK_INTERVAL);

            console.info("[Burger Clicker PWA] Service Worker registrado:", registration.scope);
        } catch (error) {
            console.warn("[Burger Clicker PWA] Falha ao registrar Service Worker:", error);
            setUpdateStatus("Não foi possível ativar as atualizações automáticas. Atualize a página e verifique a conexão.");
            setStatus("O jogo abre normalmente, mas o modo offline pode não funcionar até que o registro seja corrigido.");
        }
    }

    function init() {
        const installButton = get("configInstalarBtn");
        if (installButton && !installButton.dataset.pwaBound) {
            installButton.dataset.pwaBound = "true";
            installButton.addEventListener("click", event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                install();
            }, true);
        }
        get("pwaVerificarAtualizacaoBtn")?.addEventListener("click", () => checkForUpdates(true));
        get("pwaAplicarAtualizacaoBtn")?.addEventListener("click", applyUpdate);
        window.addEventListener("appinstalled", () => {
            deferredInstallPrompt = null;
            installInProgress = false;
            setInstallButtonState();
            setStatus("🎉 Burger Clicker instalado! Você já pode abri-lo pelo ícone criado pelo sistema.");
        });
        setInstallButtonState();
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
        checkForUpdates: () => checkForUpdates(true),
        applyUpdate,
        get registration() { return registration; },
        getInstallInstructions: platformInstructions
    };
})();
