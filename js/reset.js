"use strict";

(() => {
    const RESET_BUTTON_ID = "configResetarBtn";
    const CONFIG_PREFIX = "bc_config_";
    const BACKUP_PREFIX = "bc_backup_";
    const LAST_BACKUP_KEY = "bc_ultimo_backup";
    const BACKUP_QUANTIDADE = 5;

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

    function criarBackupAntesDoReset() {
        const dados = {};
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (!chave || chave.startsWith(CONFIG_PREFIX) || chave.startsWith(BACKUP_PREFIX) || chave === LAST_BACKUP_KEY) continue;
            dados[chave] = localStorage.getItem(chave);
        }

        const pacote = {
            app: "Burger Clicker",
            formato: 1,
            criadoEm: new Date().toISOString(),
            dados
        };

        const anteriores = [];
        for (let i = 0; i < BACKUP_QUANTIDADE; i++) {
            const valor = localStorage.getItem(BACKUP_PREFIX + i);
            if (valor) anteriores.push(valor);
        }

        localStorage.setItem(BACKUP_PREFIX + "0", JSON.stringify(pacote));
        anteriores.slice(0, BACKUP_QUANTIDADE - 1).forEach((valor, indice) => {
            localStorage.setItem(BACKUP_PREFIX + (indice + 1), valor);
        });
        localStorage.setItem(LAST_BACKUP_KEY, pacote.criadoEm);
    }

    function resetarEmUmClique(event) {
        if (!(event.target instanceof Element)) return;
        const botao = event.target.closest(`#${RESET_BUTTON_ID}`);
        if (!botao) return;

        // Capture phase intercepta o listener antigo de settings.js antes que
        // ele execute. Assim não há segunda confirmação nem necessidade de F5.
        event.preventDefault();
        event.stopImmediatePropagation();

        if (window.__burgerClickerResetEmAndamento) return;
        window.__burgerClickerResetEmAndamento = true;
        botao.disabled = true;
        botao.textContent = "⏳ Resetando...";

        try {
            // O backup de segurança é feito no próprio módulo para não depender
            // de funções privadas do módulo de configurações.
            try {
                criarBackupAntesDoReset();
            } catch (erroBackup) {
                console.warn("[Burger Clicker] Backup antes do reset indisponível; o reset continuará:", erroBackup);
            }

            // O backup recém-criado entra nesta lista e será preservado junto
            // das configurações do usuário.
            const manter = preservarConfiguracoesEBackups();
            localStorage.clear();
            Object.entries(manter).forEach(([chave, valor]) => {
                localStorage.setItem(chave, valor);
            });

            // settings.js e outros listeners consultam esta flag no beforeunload,
            // evitando que o progresso antigo seja gravado novamente.
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
        document.addEventListener("click", resetarEmUmClique, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
