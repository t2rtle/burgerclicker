"use strict";

(() => {
    const CONFIG_VIBRACAO = "bc_config_vibracao";
    const CONFIG_SOM = "bc_config_som";

    function somAtivo() {
        return localStorage.getItem(CONFIG_SOM) !== "false";
    }

    function vibracaoAtiva() {
        return localStorage.getItem(CONFIG_VIBRACAO) !== "false";
    }

    // O main.js cria uma nova instância do áudio para cada clique.
    // Garantimos que essa cópia respeite a opção Som das configurações.
    if (window.HTMLMediaElement) {
        const cloneOriginal = HTMLMediaElement.prototype.cloneNode;
        HTMLMediaElement.prototype.cloneNode = function(deep) {
            const copia = cloneOriginal.call(this, deep);
            if (this.id === "somClique") {
                copia.muted = !somAtivo();
                copia.defaultMuted = !somAtivo();
                if (!somAtivo()) copia.setAttribute("muted", "");
                else copia.removeAttribute("muted");
            }
            return copia;
        };
    }

    // Faz a Vibration API obedecer ao interruptor de vibração sem alterar o
    // comportamento do restante do jogo.
    if (navigator && typeof navigator.vibrate === "function") {
        const vibrarOriginal = navigator.vibrate.bind(navigator);
        try {
            Object.defineProperty(navigator, "vibrate", {
                configurable: true,
                value: padrao => vibracaoAtiva() ? vibrarOriginal(padrao) : true
            });
        } catch {
            try {
                navigator.vibrate = padrao => vibracaoAtiva() ? vibrarOriginal(padrao) : true;
            } catch {
                // Alguns navegadores não permitem substituir o método.
            }
        }
    }
})();
