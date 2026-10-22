"use strict";

/* Burger Clicker - sistema de áudio centralizado.
 * Efeito: media/click.wav (o arquivo chamado click.mp3 no repositório é o mesmo WAV).
 * Música: media/music.mp3 em loop.
 *
 * Os caminhos começam com / porque o Burger Clicker é publicado na raiz
 * de t2rtle.github.io. Assim evitamos que o navegador monte uma URL errada
 * quando a página é aberta a partir de outra rota.
 */
(() => {
    const CONFIG = {
        som: "bc_config_som",
        musica: "bc_config_musica",
        volumeSom: "bc_config_volume_efeitos",
        volumeMusica: "bc_config_volume_musica"
    };

    // IMPORTANTE: media/click.mp3 e media/click.wav possuem exatamente o mesmo
    // blob no GitHub (mesmo SHA). O conteúdo começa com RIFF/WAVE, portanto o
    // arquivo é WAV apesar da extensão .mp3. Usamos a extensão correta.
    const CLICK_SRC = "/media/click.wav";
    const MUSIC_SRC = "/media/music.mp3";
    const CLICK_POOL_SIZE = 8;

    let clickPool = [];
    let clickIndex = 0;
    let musica = null;
    let inicializado = false;
    let houveInteracao = false;

    function lerBooleano(chave, padrao) {
        try {
            const valor = localStorage.getItem(chave);
            return valor === null ? padrao : valor === "true";
        } catch (_) {
            return padrao;
        }
    }

    function lerVolume(chave, padrao) {
        try {
            const valor = Number(localStorage.getItem(chave));
            return Number.isFinite(valor) ? Math.max(0, Math.min(1, valor)) : padrao;
        } catch (_) {
            return padrao;
        }
    }

    function criarAudio(src, loop = false) {
        try {
            const audio = new Audio();
            audio.preload = "auto";
            audio.autoplay = false;
            audio.loop = loop;
            audio.muted = false;
            audio.setAttribute("playsinline", "true");
            audio.src = src;
            audio.addEventListener("error", () => {
                console.warn("[Burger Clicker Audio] Erro ao carregar:", src, audio.error);
            });
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

        // Reaproveita o elemento de música já presente no HTML quando possível.
        const elementoMusica = document.getElementById("musicaFundo");
        if (elementoMusica) {
            musica = elementoMusica;
            musica.preload = "auto";
            musica.autoplay = false;
            musica.loop = true;
            musica.setAttribute("playsinline", "true");
            musica.addEventListener("error", () => {
                console.warn("[Burger Clicker Audio] Erro ao carregar:", MUSIC_SRC, musica.error);
            });
            musica.load();
        } else {
            musica = criarAudio(MUSIC_SRC, true);
        }

        for (let i = 0; i < CLICK_POOL_SIZE; i++) {
            const audio = criarAudio(CLICK_SRC);
            if (audio) clickPool.push(audio);
        }
    }

    function tocarEfeito() {
        inicializar();
        if (!lerBooleano(CONFIG.som, true)) return false;

        const volume = lerVolume(CONFIG.volumeSom, 1);
        if (volume <= 0 || !clickPool.length) return false;

        const audio = clickPool[clickIndex++ % clickPool.length];
        try {
            audio.volume = volume;
            audio.muted = false;
            audio.currentTime = 0;
            const promessa = audio.play();
            if (promessa && typeof promessa.catch === "function") {
                promessa.catch(erro => {
                    console.warn("[Burger Clicker Audio] Falha no efeito de clique:", erro);
                });
            }
            return true;
        } catch (erro) {
            console.warn("[Burger Clicker Audio] Falha no efeito de clique:", erro);
            return false;
        }
    }

    async function iniciarMusica() {
        inicializar();
        if (!musica || !lerBooleano(CONFIG.musica, true)) return false;

        musica.loop = true;
        musica.volume = lerVolume(CONFIG.volumeMusica, 0.5);
        musica.muted = false;

        try {
            // Esta função é chamada diretamente durante o clique/tap em JOGAR
            // ou em outra interação do jogador, satisfazendo a política de
            // autoplay dos navegadores.
            await musica.play();
            houveInteracao = true;
            return true;
        } catch (erro) {
            console.warn("[Burger Clicker Audio] Música não pôde iniciar:", erro);
            return false;
        }
    }

    function pararMusica() {
        inicializar();
        try {
            musica?.pause();
        } catch (_) {}
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
        }
    }

    function processarInteracao() {
        houveInteracao = true;
        aplicarConfiguracoes();
        if (lerBooleano(CONFIG.musica, true) && musica?.paused) {
            // A tentativa acontece no mesmo gesto do usuário.
            iniciarMusica();
        }
    }

    // Captura o gesto antes dos handlers antigos de main.js. Em botões,
    // impedimos o código antigo de tentar tocar o arquivo click.mp3 inválido.
    window.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        const alvo = event.target instanceof Element ? event.target : null;
        const botao = alvo?.closest("button");
        processarInteracao();
        if (botao) {
            tocarEfeito();
        }
    }, { capture: true, passive: true });

    window.addEventListener("keydown", event => {
        processarInteracao();
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            const alvo = document.activeElement instanceof Element ? document.activeElement : null;
            if (alvo?.closest("button")) tocarEfeito();
        }
    }, { capture: true, passive: true });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && houveInteracao && lerBooleano(CONFIG.musica, true)) {
            iniciarMusica();
        }
    });

    window.BurgerClickerAudio = Object.freeze({
        inicializar,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        aplicarConfiguracoes
    });

    inicializar();
    aplicarConfiguracoes();
})();
