"use strict";

/*
 * Burger Clicker — sistema de áudio compatível e resiliente.
 *
 * - O clique continua sendo sintetizado pela Web Audio API.
 * - A música usa HTMLAudioElement e não fica presa a um MIME fixo no HTML.
 * - O tipo MIME é inferido pela extensão quando ela é conhecida.
 * - Extensões desconhecidas são deixadas para o navegador decidir por sniffing.
 * - A arquitetura aceita trocar/adicionar formatos sem reescrever o sistema.
 *
 * Observação: nenhum navegador consegue reproduzir literalmente qualquer formato.
 * Este sistema tenta o formato fornecido e informa claramente quando o navegador
 * não possui suporte ao codec/container usado pelo arquivo.
 */
(() => {
    const CLICK_BACKUP_URL = "/media/click.mp3";
    const MUSIC_URL = "/media/music.mp3";

    const MIME_BY_EXTENSION = Object.freeze({
        mp3: "audio/mpeg",
        ogg: "audio/ogg",
        oga: "audio/ogg",
        opus: "audio/ogg; codecs=opus",
        wav: "audio/wav",
        wave: "audio/wav",
        m4a: "audio/mp4",
        mp4: "audio/mp4",
        aac: "audio/aac",
        webm: "audio/webm",
        flac: "audio/flac"
    });

    let audioContext = null;
    let musicAudio = null;
    let initialized = false;
    let userInteracted = false;

    function getConfigBool(id, fallback = true) {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && input.type === "checkbox") return input.checked;
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

    function obterExtensao(url) {
        try {
            const pathname = new URL(url, document.baseURI).pathname;
            const nome = pathname.split("/").pop() || "";
            const ponto = nome.lastIndexOf(".");
            return ponto >= 0 ? nome.slice(ponto + 1).toLowerCase() : "";
        } catch (_) {
            return "";
        }
    }

    function obterMimeAudio(url) {
        return MIME_BY_EXTENSION[obterExtensao(url)] || "";
    }

    function obterSuporteAudio(url) {
        const mime = obterMimeAudio(url);
        const teste = document.createElement("audio");
        return {
            mime: mime || "não especificado",
            canPlayType: mime ? (teste.canPlayType(mime) || "") : "não testado",
            extensao: obterExtensao(url) || "sem extensão"
        };
    }

    function configurarFonteAudio(audio, url) {
        const absoluteUrl = new URL(url, document.baseURI).href;
        const mime = obterMimeAudio(url);

        // Remove <source> antigos para que não exista uma segunda fonte com MIME
        // fixado no HTML interferindo na seleção do navegador.
        while (audio.firstChild) audio.removeChild(audio.firstChild);

        audio.removeAttribute("type");
        audio.src = absoluteUrl;
        audio.dataset.audioSource = url;
        if (mime) audio.dataset.audioMime = mime;
        else delete audio.dataset.audioMime;

        return { url: absoluteUrl, mime: mime || null };
    }

    function getAudioContext() {
        if (!audioContext) {
            const Context = window.AudioContext || window.webkitAudioContext;
            if (!Context) throw new Error("Este navegador não oferece suporte à Web Audio API.");
            audioContext = new Context();
        }
        return audioContext;
    }

    function getMusicAudio() {
        if (!(musicAudio instanceof HTMLAudioElement)) {
            const existing = document.getElementById("musicaFundo");
            musicAudio = existing instanceof HTMLAudioElement ? existing : new Audio();
            musicAudio.preload = "metadata";
            musicAudio.loop = true;
            configurarFonteAudio(musicAudio, MUSIC_URL);
            musicAudio.addEventListener("error", () => {
                console.warn("[Burger Clicker] Falha ao carregar a música:", musicAudio.error, musicAudio.src);
            });
        }
        return musicAudio;
    }

    function inicializar() {
        if (initialized) return;
        initialized = true;
        getMusicAudio();
        aplicarConfiguracoes();
    }

    function aplicarConfiguracoes() {
        const music = getMusicAudio();
        const musicaAtiva = getConfigBool("configMusica", true);
        const volumeMusica = getConfigVolume("configVolumeMusica", 0.5);
        music.muted = !musicaAtiva;
        music.volume = volumeMusica;
        music.loop = true;
        if (!musicaAtiva || volumeMusica <= 0) music.pause();
    }

    async function tocarEfeito(opcoes = {}) {
        inicializar();
        const forcar = opcoes && opcoes.forcar === true;
        if (!forcar && !getConfigBool("configSom", true)) {
            return { ok: false, motivo: "Os efeitos sonoros estão desativados nas configurações." };
        }

        try {
            const ctx = getAudioContext();
            if (ctx.state === "suspended") await ctx.resume();

            const volumeConfigurado = getConfigVolume("configVolumeEfeitos", 1);
            const volume = forcar ? Math.max(0.01, volumeConfigurado) : volumeConfigurado;
            if (volume <= 0 && !forcar) return { ok: true, engine: "Web Audio API", synthesized: true, silent: true };

            const now = ctx.currentTime;
            const master = ctx.createGain();
            master.gain.setValueAtTime(Math.max(0.0001, volume * 0.24), now);
            master.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
            master.connect(ctx.destination);

            const oscillator = ctx.createOscillator();
            const toneGain = ctx.createGain();
            oscillator.type = "triangle";
            oscillator.frequency.setValueAtTime(1250, now);
            oscillator.frequency.exponentialRampToValueAtTime(430, now + 0.045);
            toneGain.gain.setValueAtTime(0.9, now);
            toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
            oscillator.connect(toneGain);
            toneGain.connect(master);
            oscillator.start(now);
            oscillator.stop(now + 0.06);

            const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * 0.012));
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const noise = ctx.createBufferSource();
            const noiseGain = ctx.createGain();
            noise.buffer = buffer;
            noiseGain.gain.setValueAtTime(0.22, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
            noise.connect(noiseGain);
            noiseGain.connect(master);
            noise.start(now);
            noise.stop(now + 0.013);

            const dispose = () => {
                try { master.disconnect(); } catch (_) {}
            };
            oscillator.addEventListener("ended", dispose, { once: true });
            return { ok: true, engine: "Web Audio API", synthesized: true, contextState: ctx.state };
        } catch (error) {
            console.error("[Burger Clicker] Falha ao sintetizar o som de clique:", error);
            return {
                ok: false,
                source: "Web Audio API (som sintetizado)",
                name: error?.name || "Error",
                motivo: error?.message || String(error),
                contextState: audioContext?.state || "indisponível"
            };
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
            console.warn("[Burger Clicker] Não foi possível reproduzir a música:", error);
            return false;
        }
    }

    function pararMusica() {
        inicializar();
        getMusicAudio().pause();
    }

    function obterEstado() {
        inicializar();
        const music = getMusicAudio();
        return Object.freeze({
            engine: "Web Audio API + HTMLAudioElement",
            webAudio: true,
            clickSource: "Web Audio API (sintetizado; click.mp3 não utilizado)",
            clickBackup: CLICK_BACKUP_URL,
            musicSource: MUSIC_URL,
            musicMime: obterMimeAudio(MUSIC_URL) || "não especificado",
            musicCanPlayType: obterSuporteAudio(MUSIC_URL).canPlayType,
            clickReadyState: audioContext ? (audioContext.state === "running" ? 4 : 0) : 0,
            clickNetworkState: 0,
            clickPaused: !audioContext || audioContext.state !== "running",
            clickVolume: getConfigVolume("configVolumeEfeitos", 1),
            audioContextState: audioContext?.state || "não inicializado",
            musicReadyState: music.readyState,
            musicNetworkState: music.networkState,
            musicPaused: music.paused,
            musicVolume: music.volume,
            musicError: music.error ? {
                code: music.error.code,
                message: music.error.message || ""
            } : null,
            userInteracted
        });
    }

    function testarArquivo(url) {
        return new Promise(resolve => {
            const audio = new Audio();
            const suporte = obterSuporteAudio(url);
            configurarFonteAudio(audio, url);
            audio.preload = "metadata";
            let terminou = false;

            const finalizar = resultado => {
                if (terminou) return;
                terminou = true;
                clearTimeout(timer);
                try { audio.pause(); } catch (_) {}
                resolve({ ...suporte, ...resultado });
            };

            const sucesso = () => finalizar({
                ok: true,
                url,
                readyState: audio.readyState,
                networkState: audio.networkState,
                duration: Number.isFinite(audio.duration) ? audio.duration : 0
            });

            const erro = () => finalizar({
                ok: false,
                url,
                readyState: audio.readyState,
                networkState: audio.networkState,
                errorCode: audio.error?.code || null,
                errorMessage: audio.error?.message || "",
                motivo: audio.error?.message || (audio.error ? "code=" + audio.error.code : "erro de mídia")
            });

            const timer = setTimeout(() => finalizar({
                ok: false,
                url,
                motivo: "tempo limite de carregamento"
            }), 7000);

            audio.addEventListener("loadedmetadata", sucesso, { once: true });
            audio.addEventListener("canplay", sucesso, { once: true });
            audio.addEventListener("error", erro, { once: true });
            audio.load();
        });
    }

    async function diagnosticarArquivos() {
        let sintetizador;
        try {
            const ctx = getAudioContext();
            sintetizador = { ok: true, engine: "Web Audio API", state: ctx.state, arquivoNecessario: false };
        } catch (error) {
            sintetizador = { ok: false, engine: "Web Audio API", motivo: error?.message || String(error) };
        }

        const music = await testarArquivo(MUSIC_URL);
        return Object.freeze({
            click: { ...sintetizador, url: "sintetizado por código", backup: CLICK_BACKUP_URL },
            music,
            estado: obterEstado()
        });
    }

    document.addEventListener("pointerdown", () => { userInteracted = true; }, { capture: true, passive: true });
    document.addEventListener("keydown", () => { userInteracted = true; }, { capture: true });
    document.addEventListener("click", () => { userInteracted = true; }, { capture: true });

    document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest("button");
        if (!button || button.disabled || button.id === "audioDiagnosticoEfeito") return;
        void tocarEfeito();
    });

    window.BurgerClickerAudio = Object.freeze({
        inicializar,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        aplicarConfiguracoes,
        obterEstado,
        diagnosticarArquivos,
        inferirMime: obterMimeAudio,
        verificarSuporte: obterSuporteAudio,
        assets: Object.freeze({
            click: CLICK_BACKUP_URL,
            clickMode: "synthesized",
            music: MUSIC_URL,
            musicMode: "html-audio-dynamic-mime"
        })
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar, { once: true });
    } else {
        inicializar();
    }
})();
