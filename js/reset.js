"use strict";

(() => {
    const RESET_BUTTON_ID = "configResetarBtn";
    const CONFIG_PREFIX = "bc_config_";
    const BACKUP_PREFIX = "bc_backup_";
    const LAST_BACKUP_KEY = "bc_ultimo_backup";

    function definirStatus(texto, erro = false) {
        const status = document.getElementById("configStatus");
        if (!status) return;
        status.textContent = texto;
        status.dataset.erro = erro ? "true" : "false";
    }

    function preservarConfiguracoesEBackups() {
        const manter = {};
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (!chave) continue;
            if (chave.startsWith(CONFIG_PREFIX) || chave.startsWith(BACKUP_PREFIX) || chave === LAST_BACKUP_KEY) {
                manter[chave] = localStorage.getItem(chave);
            }
        }
        return manter;
    }

    function resetarEmUmClique(event) {
        if (!(event.target instanceof Element)) return;
        const botao = event.target.closest(`#${RESET_BUTTON_ID}`);
        if (!botao) return;

        // Intercepta antes do listener antigo de settings.js. Assim o reset
        // não abre duas confirmações e não depende de Ctrl+F5.
        event.preventDefault();
        event.stopImmediatePropagation();

        if (window.__burgerClickerResetEmAndamento) return;
        window.__burgerClickerResetEmAndamento = true;
        botao.disabled = true;
        botao.textContent = "⏳ Resetando...";

        try {
            const manter = preservarConfiguracoesEBackups();

            // Tenta criar um backup de segurança usando a função existente.
            // Se ela estiver disponível, o último estado válido fica preservado.
            if (typeof window.salvarBackupAutomatico === "function") {
                try {
                    window.salvarBackupAutomatico();
                } catch (erro) {
                    console.warn("[Burger Clicker] Backup antes do reset indisponível:", erro);
                }
            }

            // Recalcula a lista depois do backup para preservar também o backup
            // recém-criado. As chaves de configuração nunca são apagadas.
            const preservarDepoisDoBackup = preservarConfiguracoesEBackups();
            localStorage.clear();
            Object.entries(preservarDepoisDoBackup).forEach(([chave, valor]) => {
                localStorage.setItem(chave, valor);
            });

            // Evita que beforeunload salve novamente o estado antigo.
            // A própria página será recarregada imediatamente.
            location.reload();
        } catch (erro) {
            window.__burgerClickerResetEmAndamento = false;
            botao.disabled = false;
            botao.textContent = "🔄 Resetar todo o progresso";
            definirStatus("❌ Não foi possível resetar o progresso. O armazenamento deste dispositivo pode estar indisponível.", true);
            console.error("[Burger Clicker] Falha no reset em um clique:", erro);
        }
    }

    function iniciar() {
        // Capture phase garante que o listener antigo de settings.js não execute.
        document.addEventListener("click", resetarEmUmClique, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
