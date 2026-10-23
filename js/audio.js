"use strict";

/*
 * Burger Clicker — áudio simples e direto.
 *
 * Os dois arquivos são recursos locais do próprio site:
 *   /media/music.mp3
 *   /media/click.mp3
 *
 * A música e o efeito usam HTMLAudioElement diretamente, exatamente como
 * os <audio> existentes no index.html. Não há Web Audio API, pools,
 * cooldowns ou lógica de cache para decidir como reproduzir o som.
 */
(() => {
    const CLICK_URL = "/media/click.mp3";
    const MUSIC_URL = "/media/music.mp3";

    let clickAudio = null;
    let musicAudio = null;
    let initialized = false;

    function getConfigBool(id, fallback = true) {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && input.type === "checkbox") {
            return input.checked;
        }
        return fallback;
    }

    function getConfigVolume(id, fallback) {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && input.type === "range") {
            const value = Number(input.value);
            if (Number.isFinite(value)) return Math.max(0, Math.min(1, value / 100));
        }
        return fallback;
    }

    function getClickAudio() {
        if (!(clickAudio instanceof HTMLAudioElement)) {
            const existing = document.getElementById("somClique");
            clickAudio = existing instanceof HTMLAudioElement ? existing : new Audio(CLICK_URL);
            clickAudio.preload = "auto";
            clickAudio.src = CLICK_URL;
            clickAudio.load();
        }
        return clickAudio;
    }

    function getMusicAudio() {
        if (!(musicAudio instanceof HTMLAudioElement)) {
            const existing = document.getElementById("musicaFundo");
            musicAudio = existing instanceof HTMLAudioElement ? existing : new Audio(MUSIC_URL);
            musicAudio.preload = "auto";
            musicAudio.loop = true;
            musicAudio.src = MUSIC_URL;
            musicAudio.load();
        }
        return musicAudio;
    }

    function inicializar() {
        if (initialized) return;
        initialized = true;
        getClickAudio();
        getMusicAudio();
        aplicarConfiguracoes();
    }

    function aplicarConfiguracoes() {
        const click = getClickAudio();
        const music = getMusicAudio();

        const somAtivo = getConfigBool("configSom", true);
        const musicaAtiva = getConfigBool("configMusica", true);
        const volumeSom = getConfigVolume("configVolumeEfeitos", 1);
        const volumeMusica = getConfigVolume("configVolumeMusica", 0.5);

        click.muted = !somAtivo;
        click.volume = volumeSom;
        music.muted = !musicaAtiva;
        music.volume = volumeMusica;
        music.loop = true;

        if (!musicaAtiva || volumeMusica <= 0) {
            music.pause();
        }
    }

    function tocarEfeito(opcoes = {}) {
        inicializar();
        const click = getClickAudio();
        const forcar = opcoes && opcoes.forcar === true;

        if (!forcar && !getConfigBool("configSom", true)) return false;

        click.muted = false;
        click.volume = getConfigVolume("configVolumeEfeitos", 1);
        click.currentTime = 0;

        try {
            const promise = click.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(error => console.warn("[Burger Clicker] Não foi possível reproduzir click.mp3:", error));
            }
            return true;
        } catch (error) {
            console.warn("[Burger Clicker] Não foi possível reproduzir click.mp3:", error);
            return false;
        }
    }

    function iniciarMusica() {
        inicializar();
        aplicarConfiguracoes();

        const music = getMusicAudio();
        if (!getConfigBool("configMusica", true) || music.volume <= 0) return false;

        try {
            const promise = music.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(error => console.warn("[Burger Clicker] Música aguardando interação do usuário:", error));
            }
            return true;
        } catch (error) {
            console.warn("[Burger Clicker] Não foi possível reproduzir music.mp3:", error);
            return false;
        }
    }

    function pararMusica() {
        inicializar();
        getMusicAudio().pause();
    }

    function obterEstado() {
        inicializar();
        const click = getClickAudio();
        const music = getMusicAudio();
        return Object.freeze({
            engine: "HTMLAudioElement",
            webAudio: false,
            clickSource: CLICK_URL,
            musicSource: MUSIC_URL,
            clickReadyState: click.readyState,
            clickNetworkState: click.networkState,
            clickPaused: click.paused,
            clickVolume: click.volume,
            musicReadyState: music.readyState,
            musicNetworkState: music.networkState,
            musicPaused: music.paused,
            musicVolume: music.volume,
            userInteracted: true
        });
    }

    function testarArquivo(url) {
        return new Promise(resolve => {
            const audio = new Audio(url);
            audio.preload = "metadata";
            let terminou = false;
            const finalizar = resultado => {
                if (terminou) return;
                terminou = true;
                clearTimeout(timer);
                resolve(resultado);
            };
            const sucesso = () => finalizar({
                ok: true,
                url,
                readyState: audio.readyState,
                duration: Number.isFinite(audio.duration) ? audio.duration : 0
            });
            const erro = () => finalizar({
                ok: false,
                url,
                readyState: audio.readyState,
                motivo: audio.error?.message || (audio.error ? "code=" + audio.error.code : "erro de mídia")
            });
            const timer = setTimeout(() => finalizar({ ok: false, url, motivo: "tempo limite de carregamento" }), 7000);
            audio.addEventListener("loadedmetadata", sucesso, { once: true });
            audio.addEventListener("canplay", sucesso, { once: true });
            audio.addEventListener("error", erro, { once: true });
            audio.load();
        });
    }

    async function diagnosticarArquivos() {
        const [click, music] = await Promise.all([
            testarArquivo(CLICK_URL),
            testarArquivo(MUSIC_URL)
        ]);
        return Object.freeze({ click, music, estado: obterEstado() });
    }

    window.BurgerClickerAudio = Object.freeze({
        inicializar,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        aplicarConfiguracoes,
        obterEstado,
        diagnosticarArquivos,
        assets: Object.freeze({ click: CLICK_URL, music: MUSIC_URL })
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar, { once: true });
    } else {
        inicializar();
    }
})();