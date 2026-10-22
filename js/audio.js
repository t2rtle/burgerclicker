"use strict";

/*
 * Burger Clicker - camada de áudio resiliente.
 *
 * Regras importantes:
 * - Nenhum autoplay forçado antes de uma interação do usuário.
 * - Música só inicia dentro de uma interação real, respeitando a política
 *   de autoplay dos navegadores.
 * - Os caminhos são relativos ao próprio site/PWA.
 * - Erros de áudio nunca podem interromper o jogo.
 * - A configuração continua sendo controlada pelo localStorage existente.
 */
(() => {
    const CHAVES = {
        som: "bc_config_som",
        musica: "bc_config_musica",
        volumeSom: "bc_config_volume_efeitos",
        volumeMusica: "bc_config_volume_musica"
    };

    const CLIP = "media/click.wav";
    const MUSICA = "media/music.mp3";
    const POOL_SIZE = 12;

    let efeitoPool = [];
    let efeitoIndice = 0;
    let audioInicializado = false;
    let primeiraInteracao = false;

    const lerBool = (chave, padrao) => {
        try {
            const valor = localStorage.getItem(chave);
            return valor === null ? padrao : valor === "true";
        } catch (_) {
            return padrao;
        }
    };

    const lerVolume = (chave, padrao) => {
        try {
            const n = Number(localStorage.getItem(chave));
            return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : padrao;
        } catch (_) {
            return padrao;
        }
    };

    function obterMusica() {
        return document.getElementById("musicaFundo");
    }

    function configurarElemento(audio, volume) {
        audio.preload = "auto";
        audio.autoplay = false;
        audio.loop = false;
        audio.muted = false;
        audio.volume = volume;
    }

    function inicializar() {
        if (audioInicializado) return;
        audioInicializado = true;

        const principal = document.getElementById("somClique");
        if (principal) {
            principal.preload = "auto";
            principal.autoplay = false;
            principal.muted = false;
            principal.volume = lerVolume(CHAVES.volumeSom, 1);
            // Mantém o elemento HTML como fallback e aquece o carregamento.
            try { principal.load(); } catch (_) {}

            const origem = principal.currentSrc || CLIP;
            for (let i = 0; i < POOL_SIZE; i++) {
                try {
                    const audio = new Audio();
                    audio.src = origem;
                    configurarElemento(audio, lerVolume(CHAVES.volumeSom, 1));
                    audio.addEventListener("error", () => {
                        console.warn("[Burger Clicker Audio] Falha ao carregar efeito de clique.", audio.error);
                    }, { once: true });
                    try { audio.load(); } catch (_) {}
                    efeitoPool.push(audio);
                } catch (erro) {
                    console.warn("[Burger Clicker Audio] Não foi possível criar o canal de efeito:", erro);
                }
            }
        }

        const musica = obterMusica();
        if (musica) {
            configurarElemento(musica, lerVolume(CHAVES.volumeMusica, 0.5));
            musica.loop = true;
            try { musica.load(); } catch (_) {}
            musica.addEventListener("error", () => {
                console.error("[Burger Clicker Audio] Falha ao carregar media/music.mp3:", musica.error);
            });
        }
    }

    function prepararNoPrimeiroToque() {
        inicializar();
        primeiraInteracao = true;

        // A música é iniciada aqui, dentro da interação do usuário.
        // Isso evita a rejeição de play() causada pelo autoplay policy.
        if (lerBool(CHAVES.musica, true)) {
            iniciarMusica();
        }
    }

    function tocarEfeito() {
        inicializar();
        if (!lerBool(CHAVES.som, true)) return;

        const volume = lerVolume(CHAVES.volumeSom, 1);
        if (volume <= 0) return;

        const principal = document.getElementById("somClique");
        let audio = efeitoPool.length ? efeitoPool[efeitoIndice++ % efeitoPool.length] : principal;
        if (!audio) return;

        try {
            audio.volume = volume;
            audio.muted = false;
            audio.currentTime = 0;
            const promessa = audio.play();
            if (promessa && typeof promessa.catch === "function") {
                promessa.catch(() => {
                    // Segundo caminho: elemento HTML original.
                    if (!principal || audio === principal) return;
                    try {
                        principal.volume = volume;
                        principal.muted = false;
                        principal.currentTime = 0;
                        const fallback = principal.play();
                        if (fallback?.catch) fallback.catch(() => {});
                    } catch (_) {}
                });
            }
        } catch (_) {
            // Áudio nunca pode quebrar a lógica do jogo.
        }
    }

    async function iniciarMusica() {
        inicializar();
        const musica = obterMusica();
        if (!musica || !lerBool(CHAVES.musica, true)) return false;

        musica.volume = lerVolume(CHAVES.volumeMusica, 0.5);
        musica.muted = false;
        musica.loop = true;

        try {
            await musica.play();
            return true;
        } catch (erro) {
            // Normalmente significa que o navegador exige uma interação do usuário.
            // Não mostramos alerta nem interrompemos o jogo; a próxima interação
            // tentará novamente automaticamente.
            console.info("[Burger Clicker Audio] Música aguardando interação do usuário.", erro?.name || erro);
            return false;
        }
    }

    function pararMusica() {
        const musica = obterMusica();
        if (!musica) return;
        try { musica.pause(); } catch (_) {}
    }

    function aplicarConfiguracoes() {
        inicializar();
        const som = lerBool(CHAVES.som, true);
        const musicaHabilitada = lerBool(CHAVES.musica, true);
        const volumeSom = lerVolume(CHAVES.volumeSom, 1);
        const volumeMusica = lerVolume(CHAVES.volumeMusica, 0.5);

        const principal = document.getElementById("somClique");
        if (principal) {
            principal.muted = !som;
            principal.volume = volumeSom;
        }
        efeitoPool.forEach(audio => {
            audio.muted = !som;
            audio.volume = volumeSom;
        });

        const musica = obterMusica();
        if (musica) {
            musica.muted = !musicaHabilitada;
            musica.volume = volumeMusica;
            if (!musicaHabilitada) pararMusica();
            else if (primeiraInteracao) iniciarMusica();
        }
    }

    // Exposto para settings.js e para qualquer sistema futuro do jogo.
    window.BurgerClickerAudio = Object.freeze({
        inicializar,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        aplicarConfiguracoes
    });

    // Prime qualquer áudio no primeiro gesto sem bloquear a ação do botão.
    const primeiroGesto = () => {
        prepararNoPrimeiroToque();
        aplicarConfiguracoes();
    };
    window.addEventListener("pointerdown", primeiroGesto, { capture: true, once: true, passive: true });
    window.addEventListener("keydown", primeiroGesto, { capture: true, once: true, passive: true });

    // Se a música for interrompida ao trocar de aba/app, tenta retomá-la quando
    // a página voltar, mas somente se o usuário já tiver interagido.
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && primeiraInteracao && lerBool(CHAVES.musica, true)) {
            iniciarMusica();
        }
    });

    // Sincroniza quando settings.js já tiver sido carregado.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", aplicarConfiguracoes, { once: true });
    } else {
        aplicarConfiguracoes();
    }
})();
