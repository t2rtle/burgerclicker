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

    // Módulos separados para manter instalação/PWA, reset e navegação fora da
    // lógica principal das configurações. Este arquivo já é carregado pelo HTML.
    const carregarScript = src => {
        const script = document.createElement("script");
        script.src = src;
        script.defer = false;
        document.head.appendChild(script);
    };

    carregarScript("/js/pwa.js");
    carregarScript("/js/reset.js");
    carregarScript("/js/navigation.js");
})();
