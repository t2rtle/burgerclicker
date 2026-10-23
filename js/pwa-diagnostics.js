"use strict";

/* Diagnóstico PWA do Burger Clicker: coleta informações locais sem enviar dados. */
(() => {
    const $ = id => document.getElementById(id);
    const output = $("pwaDiagnosticoStatus");
    const runButton = $("pwaDiagnosticoExecutar");
    const openButton = $("pwaAbrirAppBtn");
    const copyButton = $("pwaDiagnosticoCopiar");
    const statusInstall = $("configInstalacaoStatus");
    if (!output || !runButton) return;

    const standalone = () => window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        navigator.standalone === true;

    const line = (label, value) => label + ": " + value;
    const yesNo = value => value ? "SIM" : "NÃO";

    async function checkUrl(url) {
        try {
            const response = await fetch(url, { cache: "no-store" });
            return { ok: response.ok, status: response.status, type: response.headers.get("content-type") || "não informado" };
        } catch (error) {
            return { ok: false, status: "ERRO", type: error?.message || String(error) };
        }
    }

    async function diagnose() {
        runButton.disabled = true;
        output.textContent = "Executando diagnóstico PWA…";
        const results = [];
        try {
            results.push("BURGER CLICKER — DIAGNÓSTICO PWA");
            results.push("Data: " + new Date().toLocaleString("pt-BR"));
            results.push(line("Navegador / sistema", navigator.userAgent));
            results.push(line("Plataforma", navigator.userAgentData?.platform || navigator.platform || "não informado"));
            results.push(line("Online", yesNo(navigator.onLine)));
            results.push(line("URL segura (HTTPS/localhost)", yesNo(isSecureContext)));
            results.push(line("Modo aplicativo (standalone)", yesNo(standalone())));
            results.push(line("API Service Worker", yesNo("serviceWorker" in navigator)));
            results.push(line("Controlado por Service Worker", yesNo(!!navigator.serviceWorker?.controller)));
            results.push(line("API Cache Storage", yesNo("caches" in window)));
            results.push(line("Evento de instalação capturado", yesNo(!!window.BurgerClickerPWA)));
            results.push(line("Suporte a beforeinstallprompt", "não é detectável diretamente; depende de critérios do navegador"));
            results.push("");

            const manifestLink = document.querySelector('link[rel="manifest"]');
            results.push("MANIFESTO");
            results.push(line("Link do manifesto", manifestLink?.href || "NÃO ENCONTRADO"));
            if (manifestLink?.href) {
                const manifestResponse = await checkUrl(manifestLink.href);
                results.push(line("Resposta HTTP", manifestResponse.status));
                results.push(line("Content-Type", manifestResponse.type));
                if (manifestResponse.ok) {
                    try {
                        const response = await fetch(manifestLink.href, { cache: "no-store" });
                        const manifest = await response.json();
                        results.push(line("JSON válido", "SIM"));
                        results.push(line("name / short_name", (manifest.name || "(sem name)") + " / " + (manifest.short_name || "(sem short_name)")));
                        results.push(line("start_url", manifest.start_url || "(ausente)"));
                        results.push(line("scope", manifest.scope || "(padrão)"));
                        results.push(line("display", manifest.display || "(padrão browser)"));
                        results.push(line("icons", Array.isArray(manifest.icons) ? manifest.icons.length : 0));
                        if (Array.isArray(manifest.icons)) {
                            for (const icon of manifest.icons) {
                                const iconUrl = new URL(icon.src, manifestLink.href).href;
                                const iconResult = await checkUrl(iconUrl);
                                results.push("  Ícone " + icon.src + " → HTTP " + iconResult.status + " | " + iconResult.type);
                            }
                        }
                    } catch (error) {
                        results.push(line("JSON válido", "NÃO — " + (error?.message || String(error))));
                    }
                } else {
                    results.push("O navegador não conseguiu buscar o manifesto.");
                }
            }
            results.push("");

            results.push("SERVICE WORKER");
            if (!("serviceWorker" in navigator)) {
                results.push("Este navegador não oferece Service Worker.");
            } else if (!isSecureContext) {
                results.push("Contexto inseguro: Service Workers normalmente exigem HTTPS (exceto localhost).");
            } else {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    results.push(line("Registros encontrados", registrations.length));
                    for (const reg of registrations) {
                        results.push("  scope=" + reg.scope +
                            " | active=" + (reg.active?.state || "nenhum") +
                            " | waiting=" + (reg.waiting?.state || "nenhum") +
                            " | installing=" + (reg.installing?.state || "nenhum"));
                    }
                    if (window.BurgerClickerPWA?.registration) {
                        results.push(line("Registro do Burger Clicker", window.BurgerClickerPWA.registration.scope));
                    } else {
                        results.push("O módulo PWA ainda não expôs um registro ativo nesta página.");
                    }
                } catch (error) {
                    results.push("Falha ao ler registros: " + (error?.message || String(error)));
                }
            }
            results.push("");

            results.push("CACHE / ARMAZENAMENTO");
            if ("caches" in window) {
                try {
                    const keys = await caches.keys();
                    results.push(line("Caches", keys.length ? keys.join(", ") : "(nenhum)"));
                    for (const key of keys) {
                        const cache = await caches.open(key);
                        results.push("  " + key + ": " + (await cache.keys()).length + " recurso(s)");
                    }
                } catch (error) {
                    results.push("Falha ao consultar caches: " + (error?.message || String(error)));
                }
            }
            try {
                const estimate = await navigator.storage?.estimate?.();
                if (estimate) {
                    results.push(line("Armazenamento usado", Math.round((estimate.usage || 0) / 1024) + " KB"));
                    results.push(line("Cota estimada", Math.round((estimate.quota || 0) / 1024 / 1024) + " MB"));
                } else results.push("Estimativa de armazenamento: API indisponível.");
            } catch (error) {
                results.push("Estimativa de armazenamento falhou: " + (error?.message || String(error)));
            }
            try {
                const key = "__bc_pwa_diagnostic_test__";
                localStorage.setItem(key, "ok");
                localStorage.removeItem(key);
                results.push("localStorage: disponível");
            } catch (error) {
                results.push("localStorage: ERRO — " + (error?.message || String(error)));
            }
            results.push("");
            results.push("LEITURA RÁPIDA");
            if (standalone()) {
                results.push("O site está rodando em modo de aplicativo neste momento.");
            } else {
                results.push("Esta página está aberta no navegador. Isso não prova que o app esteja instalado ou quebrado.");
            }
            if (!navigator.serviceWorker?.controller) {
                results.push("A página não está controlada por Service Worker. Recarregue após o registro; se persistir, envie este relatório.");
            }
            results.push("O relatório é gerado localmente e não é enviado automaticamente.");
            output.textContent = results.join("\n");
        } catch (error) {
            output.textContent = results.join("\n") + "\n\nERRO INESPERADO: " + (error?.stack || error?.message || String(error));
        } finally {
            runButton.disabled = false;
        }
    }

    runButton.addEventListener("click", diagnose);
    copyButton?.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(output.textContent || "Execute o diagnóstico PWA primeiro.");
            if (statusInstall) statusInstall.textContent = "Relatório do diagnóstico copiado. Cole-o na conversa para análise.";
        } catch (error) {
            if (statusInstall) statusInstall.textContent = "Não foi possível copiar automaticamente. Selecione o relatório e copie manualmente.";
        }
    });

    if (openButton) {
        openButton.addEventListener("click", () => {
            if (standalone()) {
                if (statusInstall) statusInstall.textContent = "O Burger Clicker já está aberto em modo aplicativo.";
                return;
            }

            const ua = navigator.userAgent || "";
            const chromium = ua.includes("Edg/") || ua.includes("Chrome/");
            if (chromium) {
                // O protocolo declarado no manifesto é a única tentativa web de encaminhar
                // a ação ao PWA instalado; a página não consegue confirmar a abertura.
                if (statusInstall) statusInstall.textContent =
                    "Tentando encaminhar ao Burger Clicker instalado. Se o navegador pedir confirmação, permita abrir o aplicativo. Se nada acontecer, use o ícone do Burger Clicker no menu Iniciar/na tela inicial: páginas web não podem forçar a abertura de um app instalado.";
                window.location.href = "web+burgerclicker://open";
                return;
            }

            // Não abrir outra guia como falso substituto do aplicativo instalado.
            if (statusInstall) statusInstall.textContent =
                "Este navegador não oferece um mecanismo compatível para abrir diretamente o aplicativo instalado a partir desta página. Abra o Burger Clicker pelo ícone instalado no dispositivo. Nenhuma nova guia foi aberta.";
        });
    }
    window.addEventListener("appinstalled", () => {
        if (statusInstall) statusInstall.textContent = "Instalação detectada nesta sessão. Abra o aplicativo pelo ícone criado pelo navegador/sistema.";
    });
})();