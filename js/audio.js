"use strict";

/* Burger Clicker - sistema de áudio centralizado.
 * Efeito: media/click.mp3 em todos os botões.
 * Música: media/music.mp3 em loop.
 */
(() => {
    const CONFIG = {
        som: "bc_config_som",
        musica: "bc_config_musica",
        volumeSom: "bc_config_volume_efeitos",
        volumeMusica: "bc_config_volume_musica"
    };
    const CLICK_SRC = "media/click.mp3";
    const MUSIC_SRC = "media/music.mp3";
    const CLICK_POOL_SIZE = 12;

    let clickPool = [];
    let clickIndex = 0;
    let musica = null;
    let inicializado = false;
    let houveInteracao = false;

    function lerBooleano(chave, padrao) {
        try {
            const valor = localStorage.getItem(chave);
            return valor === null ? padrao : valor === "true";
        } catch (_) { return padrao; }
    }

    function lerVolume(chave, padrao) {
        try {
            const valor = Number(localStorage.getItem(chave));
            return Number.isFinite(valor) ? Math.max(0, Math.min(1, valor)) : padrao;
        } catch (_) { return padrao; }
    }

    function criarAudio(src, loop = false) {
        try {
            const audio = new Audio(src);
            audio.preload = "auto";
            audio.autoplay = false;
            audio.loop = loop;
            audio.muted = false;
            audio.setAttribute("playsinline", "true");
            audio.load();
            return audio;
        } catch (erro) {
            console.warn("[Burger Clicker Audio] Falha ao criar áudio:", src, erro);
            return null;
        }
    }

    function inicializar() {
        if (inicializado) return;
        inicializado = true;

        for (let i = 0; i < CLICK_POOL_SIZE; i++) {
            const audio = criarAudio(CLICK_SRC);
            if (audio) clickPool.push(audio);
        }

        musica = criarAudio(MUSIC_SRC, true);
        if (musica) musica.loop = true;
    }

    function tocarEfeito() {
        inicializar();
        if (!lerBooleano(CONFIG.som, true)) return;
        const volume = lerVolume(CONFIG.volumeSom, 1);
        if (volume <= 0 || !clickPool.length) return;

        const audio = clickPool[clickIndex++ % clickPool.length];
        try {
            audio.volume = volume;
            audio.muted = false;
            audio.currentTime = 0;
            const promessa = audio.play();
            if (promessa?.catch) promessa.catch(() => {});
        } catch (_) {}
    }

    async function iniciarMusica() {
        inicializar();
        if (!musica || !lerBooleano(CONFIG.musica, true)) return false;
        musica.loop = true;
        musica.volume = lerVolume(CONFIG.volumeMusica, 0.5);
        musica.muted = false;
        try {
            await musica.play();
            return true;
        } catch (_) {
            // Autoplay pode ser bloqueado; a próxima interação tenta novamente.
            return false;
        }
    }

    function pararMusica() {
        inicializar();
        try { musica?.pause(); } catch (_) {}
    }

    function aplicarConfiguracoes() {
        inicializar();
        const somAtivo = lerBooleano(CONFIG.som, true);
        const musicaAtiva = lerBooleano(CONFIG.musica, true);
        const volumeSom = lerVolume(CONFIG.volumeSom, 1);
        const volumeMusica = lerVolume(CONFIG.volumeMusica, 0.5);

        clickPool.forEach(audio => {
            audio.muted = !somAtivo;
            audio.volume = volumeSom;
        });
        if (musica) {
            musica.muted = !musicaAtiva;
            musica.volume = volumeMusica;
            musica.loop = true;
            if (!musicaAtiva) pararMusica();
            else if (houveInteracao) iniciarMusica();
        }
    }

    function processarInteracao() {
        houveInteracao = true;
        aplicarConfiguracoes();
        if (lerBooleano(CONFIG.musica, true)) iniciarMusica();
    }

    // Executa antes dos handlers dos botões. Assim qualquer botão libera a música
    // e toca o efeito, inclusive configurações, loja, upgrades, pets e rebirth.
    window.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        processarInteracao();
        const alvo = event.target instanceof Element ? event.target : null;
        if (alvo?.closest("button")) tocarEfeito();
    }, { capture: true, passive: true });

    window.addEventListener("keydown", event => {
        processarInteracao();
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            const alvo = document.activeElement instanceof Element ? document.activeElement : null;
            if (alvo?.closest("button")) tocarEfeito();
        }
    }, { capture: true, passive: true });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && houveInteracao && lerBooleano(CONFIG.musica, true)) iniciarMusica();
    });

    window.BurgerClickerAudio = Object.freeze({
        inicializar,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        aplicarConfiguracoes
    });

    // Se autoplay for permitido, começa imediatamente. Caso contrário, começa
    // automaticamente no primeiro gesto do jogador.
    inicializar();
    aplicarConfiguracoes();
})();
