"use strict";

(() => {
    const CONFIG_VIBRACAO = "bc_config_vibracao";
    const CONFIG_SOM = "bc_config_som";
    function somAtivo() { return localStorage.getItem(CONFIG_SOM) !== "false"; }
    function vibracaoAtiva() { return localStorage.getItem(CONFIG_VIBRACAO) !== "false"; }
    if (navigator && typeof navigator.vibrate === "function") {
        const vibrarOriginal = navigator.vibrate.bind(navigator);
        try { Object.defineProperty(navigator, "vibrate", { configurable:true, value:padrao=>vibracaoAtiva()?vibrarOriginal(padrao):true }); }
        catch { try { navigator.vibrate=padrao=>vibracaoAtiva()?vibrarOriginal(padrao):true; } catch {} }
    }
    const sincronizarAudio=()=>{try{window.BurgerClickerAudio?.aplicarConfiguracoes();}catch(erro){console.warn("[Burger Clicker] Falha ao sincronizar áudio:",erro);}};
    ["configSom","configMusica","configVolumeMusica","configVolumeEfeitos"].forEach(id=>{const elemento=document.getElementById(id);elemento?.addEventListener("change",sincronizarAudio);elemento?.addEventListener("input",sincronizarAudio);});
    const iniciarMusicaComGesto=event=>{const alvo=event.target instanceof Element?event.target:document.activeElement;if(alvo?.closest(".config-diagnostico-audio"))return;try{window.BurgerClickerAudio?.iniciarMusica();}catch(erro){console.warn("[Burger Clicker] Falha ao iniciar áudio após interação:",erro);}};
    window.addEventListener("pointerdown",iniciarMusicaComGesto,{passive:true});window.addEventListener("keydown",iniciarMusicaComGesto,{passive:true});
    const carregarScript=src=>{const script=document.createElement("script");script.src=src;script.defer=false;document.head.appendChild(script);};
    carregarScript("/js/pwa.js");carregarScript("/js/reset.js");carregarScript("/js/navigation.js");carregarScript("/js/expansion-bridge.js");carregarScript("/js/expansion.js");carregarScript("/js/expansion-ui.js");
})();
