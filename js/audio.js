"use strict";

/*
 * Burger Clicker — sistema de áudio avançado.
 *
 * Usa somente os arquivos reais de /media através de HTMLAudioElement.
 * As configurações de áudio são normalizadas no carregamento para impedir
 * valores antigos/inválidos do localStorage de deixarem o áudio mudo.
 */
(() => {
    const CONFIG = Object.freeze({
        som: "bc_config_som",
        musica: "bc_config_musica",
        volumeSom: "bc_config_volume_efeitos",
        volumeMusica: "bc_config_volume_musica"
    });

    const ASSETS = Object.freeze({
        click: "/media/click.wav",
        music: "/media/music.mp3"
    });

    const CLICK_POOL_SIZE = 10;
    const CLICK_COOLDOWN_MS = 18;
    const AUDIO_READY_TIMEOUT_MS = 7000;

    let clickPool = [];
    let clickIndex = 0;
    let musica = null;
    let inicializado = false;
    let usuarioInteragiu = false;
    let musicaIniciando = null;
    let ultimoCliqueEm = 0;
    let listenersInstalados = false;

    function salvarSeguro(chave, valor) {
        try { localStorage.setItem(chave, String(valor)); } catch (_) {}
    }

    function lerBooleano(chave, padrao) {
        try {
            const valor = localStorage.getItem(chave);
            if (valor === null) {
                salvarSeguro(chave, padrao);
                return padrao;
            }
            if (valor === "true") return true;
            if (valor === "false") return false;
            // Corrige estados antigos como "1", "0", "on", "off", vazio etc.
            salvarSeguro(chave, padrao);
            return padrao;
        } catch (_) {
            return padrao;
        }
    }

    function lerVolume(chave, padrao) {
        try {
            const salvo = localStorage.getItem(chave);
            if (salvo === null || salvo.trim() === "") {
                salvarSeguro(chave, padrao);
                return padrao;
            }
            const valor = Number(salvo);
            if (!Number.isFinite(valor)) {
                salvarSeguro(chave, padrao);
                return padrao;
            }
            const normalizado = Math.max(0, Math.min(1, valor));
            if (String(valor) !== String(normalizado)) salvarSeguro(chave, normalizado);
            return normalizado;
        } catch (_) {
            return padrao;
        }
    }

    function normalizarConfiguracoes() {
        // Faz esta limpeza uma vez por carregamento. Não apaga preferências
        // válidas do jogador; somente repara chaves ausentes ou corrompidas.
        lerBooleano(CONFIG.som, true);
        lerBooleano(CONFIG.musica, true);
        lerVolume(CONFIG.volumeSom, 1);
        lerVolume(CONFIG.volumeMusica, 0.5);
    }

    function criarAudio(src, { loop = false, preload = "auto" } = {}) {
        try {
            const audio = new Audio();
            audio.preload = preload;
            audio.autoplay = false;
            audio.loop = loop;
            audio.muted = false;
            audio.controls = false;
            audio.setAttribute("playsinline", "true");
            audio.src = src;
            audio.addEventListener("error", () => console.warn("[Burger Clicker Audio] Falha no arquivo:", src, audio.error));
            audio.load();
            return audio;
        } catch (erro) {
            console.warn("[Burger Clicker Audio] Não foi possível criar HTMLAudioElement:", erro);
            return null;
        }
    }

    function configurarAudioDeClique(audio) {
        if (!audio) return;
        audio.preload = "auto";
        audio.autoplay = false;
        audio.loop = false;
        audio.muted = false;
        audio.playsInline = true;
        audio.volume = lerVolume(CONFIG.volumeSom, 1);
    }

    function obterMusicaDoHTML() {
        const elemento = document.getElementById("musicaFundo");
        if (!(elemento instanceof HTMLAudioElement)) return null;
        elemento.preload = "auto";
        elemento.autoplay = false;
        elemento.loop = true;
        elemento.muted = false;
        elemento.playsInline = true;
        return elemento;
    }

    function inicializar() {
        if (inicializado) return;
        inicializado = true;
        normalizarConfiguracoes();

        musica = obterMusicaDoHTML() || criarAudio(ASSETS.music, { loop: true });
        if (musica) {
            musica.addEventListener("error", () => console.warn("[Burger Clicker Audio] Erro na música:", musica.error));
            musica.addEventListener("ended", () => {
                if (lerBooleano(CONFIG.musica, true) && usuarioInteragiu) {
                    musica.currentTime = 0;
                    iniciarMusica();
                }
            });
            musica.load();
        }

        clickPool = [];
        for (let i = 0; i < CLICK_POOL_SIZE; i++) {
            const audio = criarAudio(ASSETS.click);
            if (audio) {
                configurarAudioDeClique(audio);
                clickPool.push(audio);
            }
        }
        instalarListenersDeInteracao();
    }

    function instalarListenersDeInteracao() {
        if (listenersInstalados) return;
        listenersInstalados = true;

        document.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            const alvo = event.target instanceof Element ? event.target : null;
            if (!alvo) return;
            usuarioInteragiu = true;
            const botao = alvo.closest("button");
            if (!botao || botao.disabled) return;
            if (alvo.closest(".config-diagnostico-audio")) return;
            aplicarConfiguracoes();
            iniciarMusica();
            tocarEfeito();
        }, { capture: true, passive: true });

        document.addEventListener("keydown", event => {
            if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
            const alvo = document.activeElement instanceof Element ? document.activeElement : null;
            const botao = alvo?.closest("button");
            if (!botao || botao.disabled) return;
            usuarioInteragiu = true;
            if (alvo.closest(".config-diagnostico-audio")) return;
            aplicarConfiguracoes();
            iniciarMusica();
            tocarEfeito();
        }, { capture: true, passive: true });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && usuarioInteragiu) {
                aplicarConfiguracoes();
                iniciarMusica();
            }
        });
        window.addEventListener("pageshow", () => {
            if (usuarioInteragiu) iniciarMusica();
        });
    }

    function aplicarConfiguracoes() {
        inicializar();
        const somAtivo = lerBooleano(CONFIG.som, true);
        const musicaAtiva = lerBooleano(CONFIG.musica, true);
        const volumeSom = lerVolume(CONFIG.volumeSom, 1);
        const volumeMusica = lerVolume(CONFIG.volumeMusica, 0.5);

        for (const audio of clickPool) {
            audio.muted = !somAtivo;
            audio.volume = volumeSom;
        }
        if (musica) {
            musica.muted = !musicaAtiva;
            musica.volume = volumeMusica;
            musica.loop = true;
            if (!musicaAtiva) musica.pause();
        }
    }

    function tocarEfeito(opcoes = {}) {
        inicializar();
        const forcar = opcoes && opcoes.forcar === true;
        if (!forcar && !lerBooleano(CONFIG.som, true)) return false;
        const volume = lerVolume(CONFIG.volumeSom, 1);
        if (volume <= 0 || clickPool.length === 0) return false;

        const agora = performance.now();
        if (!forcar && agora - ultimoCliqueEm < CLICK_COOLDOWN_MS) return false;
        ultimoCliqueEm = agora;

        let audio = null;
        for (let tentativa = 0; tentativa < clickPool.length; tentativa++) {
            const candidato = clickPool[(clickIndex + tentativa) % clickPool.length];
            if (candidato.paused || candidato.ended) {
                audio = candidato;
                clickIndex = (clickIndex + tentativa + 1) % clickPool.length;
                break;
            }
        }
        if (!audio) audio = clickPool[clickIndex++ % clickPool.length];

        try {
            audio.volume = volume;
            audio.muted = false;
            audio.currentTime = 0;
            const promessa = audio.play();
            promessa?.catch?.(erro => console.warn("[Burger Clicker Audio] Efeito bloqueado/interrompido:", erro));
            return true;
        } catch (erro) {
            console.warn("[Burger Clicker Audio] Falha no efeito:", erro);
            return false;
        }
    }

    async function iniciarMusica() {
        inicializar();
        if (!musica || !lerBooleano(CONFIG.musica, true)) return false;
        const volume = lerVolume(CONFIG.volumeMusica, 0.5);
        if (volume <= 0) { musica.pause(); return false; }
        musica.loop = true;
        musica.volume = volume;
        musica.muted = false;
        if (!musica.paused && !musica.ended) return true;
        if (musicaIniciando) return musicaIniciando;
        musicaIniciando = (async () => {
            try {
                const promessa = musica.play();
                if (promessa && typeof promessa.then === "function") await promessa;
                usuarioInteragiu = true;
                return true;
            } catch (erro) {
                console.warn("[Burger Clicker Audio] Música aguardando interação do usuário:", erro);
                return false;
            } finally { musicaIniciando = null; }
        })();
        return musicaIniciando;
    }

    function pararMusica() { inicializar(); try { musica?.pause(); } catch (_) {} }

    function obterEstado() {
        inicializar();
        return Object.freeze({
            engine: "HTMLAudioElement", webAudio: false,
            clickSource: ASSETS.click, musicSource: ASSETS.music,
            clickPool: clickPool.length,
            musicReadyState: musica?.readyState ?? 0,
            musicNetworkState: musica?.networkState ?? 0,
            musicPaused: musica?.paused ?? true,
            userInteracted: usuarioInteragiu
        });
    }

    function testarArquivo(url, timeout = AUDIO_READY_TIMEOUT_MS) {
        return new Promise(resolve => {
            const audio = criarAudio(url, { preload: "metadata" });
            if (!audio) { resolve({ ok: false, url, motivo: "Não foi possível criar HTMLAudioElement." }); return; }
            let finalizado = false;
            const terminar = resultado => {
                if (finalizado) return;
                finalizado = true;
                clearTimeout(timer);
                audio.removeEventListener("canplay", sucesso);
                audio.removeEventListener("loadedmetadata", sucesso);
                audio.removeEventListener("error", falha);
                resolve(resultado);
            };
            const sucesso = () => terminar({ ok: true, url, readyState: audio.readyState, duration: audio.duration });
            const falha = () => terminar({ ok: false, url, motivo: audio.error ? audio.error.message || ("code=" + audio.error.code) : "erro de mídia" });
            const timer = setTimeout(() => terminar({ ok: false, url, motivo: "tempo limite de carregamento" }), timeout);
            audio.addEventListener("canplay", sucesso, { once: true });
            audio.addEventListener("loadedmetadata", sucesso, { once: true });
            audio.addEventListener("error", falha, { once: true });
            audio.load();
        });
    }

    async function diagnosticarArquivos() {
        const [click, music] = await Promise.all([testarArquivo(ASSETS.click), testarArquivo(ASSETS.music)]);
        return Object.freeze({ click, music, estado: obterEstado() });
    }

    window.BurgerClickerAudio = Object.freeze({
        inicializar, tocarEfeito, iniciarMusica, pararMusica,
        aplicarConfiguracoes, obterEstado, diagnosticarArquivos, assets: ASSETS
    });

    inicializar();
    aplicarConfiguracoes();
})();