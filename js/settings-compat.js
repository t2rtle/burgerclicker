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
    // Os módulos complementares são carregados em ordem explícita no index.html.
    // Isso evita inicializações duplicadas e corridas entre módulos.
})();
