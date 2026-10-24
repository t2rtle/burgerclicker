"use strict";

/*
 * Burger Clicker — sistema de áudio baseado no sistema da versão v0.5.8.
 *
 * A versão antiga usava diretamente os dois <audio> do HTML:
 *   #musicaFundo -> /media/music.mp3
 *   #somClique   -> /media/click.mp3
 *
 * Este arquivo mantém esse comportamento simples de propósito. O navegador
 * recebe os arquivos MP3 diretamente pelo HTML/HTMLAudioElement, sem Web Audio
 * API para o clique, sem geração de som por código e sem seleção dinâmica de
 * MIME/codec.
 */
(() => {
    const musica = document.getElementById("musicaFundo");
    const somClique = document.getElementById("somClique");
    let userInteracted = false;

    function lerBooleano(id, fallback = true) {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && input.type === "checkbox") {
            return input.checked;
        }
        return fallback;
    }

    function lerVolume(id, fallback) {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && input.type === "range") {
            const valor = Number(input.value) / 100;
            return Number.isFinite(valor) ? Math.max(0, Math.min(1, valor)) : fallback;
        }
        return fallback;
    }

    function aplicarConfiguracoes() {
        if (somClique instanceof HTMLAudioElement) {
            somClique.muted = !lerBooleano("configSom", true);
            somClique.volume = lerVolume("configVolumeEfeitos", 1);
        }

        if (musica instanceof HTMLAudioElement) {
            musica.muted = !lerBooleano("configMusica", true);
            musica.volume = lerVolume("configVolumeMusica", 0.5);
            musica.loop = true;
            if (!lerBooleano("configMusica", true)) musica.pause();
        }
    }

    function tocarEfeito(opcoes = {}) {
        if (!(somClique instanceof HTMLAudioElement)) {
            return Promise.resolve({ ok: false, motivo: "Elemento #somClique não encontrado." });
        }

        const forcar = opcoes && opcoes.forcar === true;
        if (!forcar && !lerBooleano("configSom", true)) {
            return Promise.resolve({ ok: false, motivo: "Os efeitos sonoros estão desativados nas configurações." });
        }

        somClique.currentTime = 0;
        somClique.muted = forcar ? false : !lerBooleano("configSom", true);
        somClique.volume = forcar
            ? Math.max(0.01, lerVolume("configVolumeEfeitos", 1))
            : lerVolume("configVolumeEfeitos", 1);

        try {
            const resultado = somClique.play();
            if (resultado && typeof resultado.then === "function") {
                return resultado.then(() => ({
                    ok: true,
                    engine: "HTMLAudioElement",
                    source: "/media/click.mp3",
                    format: "MP3"
                })).catch(error => ({
                    ok: false,
                    engine: "HTMLAudioElement",
                    source: "/media/click.mp3",
                    format: "MP3",
                    name: error?.name || "Error",
                    motivo: error?.message || String(error)
                }));
            }
            return Promise.resolve({
                ok: true,
                engine: "HTMLAudioElement",
                source: "/media/click.mp3",
                format: "MP3"
            });
        } catch (error) {
            console.error("Erro ao reproduzir som de clique:", error);
            return Promise.resolve({
                ok: false,
                engine: "HTMLAudioElement",
                source: "/media/click.mp3",
                format: "MP3",
                name: error?.name || "Error",
                motivo: error?.message || String(error)
            });
        }
    }

    function iniciarMusica() {
        if (!(musica instanceof HTMLAudioElement)) return false;
        if (!lerBooleano("configMusica", true)) return false;

        musica.volume = lerVolume("configVolumeMusica", 0.5);
        musica.loop = true;

        try {
            return musica.play();
        } catch (error) {
            console.warn("Não foi possível iniciar a música:", error);
            return false;
        }
    }

    function pararMusica() {
        if (musica instanceof HTMLAudioElement) musica.pause();
    }

    function obterEstado() {
        return Object.freeze({
            engine: "HTMLAudioElement",
            webAudio: false,
            clickSource: "/media/click.mp3",
            clickBackup: "/media/click.mp3",
            musicSource: "/media/music.mp3",
            musicMode: "html-audio",
            format: "MP3",
            userInteracted,
            clickReadyState: somClique instanceof HTMLAudioElement ? somClique.readyState : 0,
            clickNetworkState: somClique instanceof HTMLAudioElement ? somClique.networkState : 0,
            clickPaused: somClique instanceof HTMLAudioElement ? somClique.paused : true,
            clickVolume: somClique instanceof HTMLAudioElement ? somClique.volume : 0,
            audioContextState: "não utilizado",
            musicReadyState: musica instanceof HTMLAudioElement ? musica.readyState : 0,
            musicNetworkState: musica instanceof HTMLAudioElement ? musica.networkState : 0,
            musicPaused: musica instanceof HTMLAudioElement ? musica.paused : true,
            musicVolume: musica instanceof HTMLAudioElement ? musica.volume : 0,
            musicError: musica instanceof HTMLAudioElement && musica.error ? {
                code: musica.error.code,
                message: musica.error.message || ""
            } : null
        });
    }

    function diagnosticarArquivo(audio, url) {
        return {
            ok: audio instanceof HTMLAudioElement && !audio.error,
            url,
            format: "MP3",
            readyState: audio instanceof HTMLAudioElement ? audio.readyState : 0,
            networkState: audio instanceof HTMLAudioElement ? audio.networkState : 0,
            paused: audio instanceof HTMLAudioElement ? audio.paused : true,
            duration: audio instanceof HTMLAudioElement && Number.isFinite(audio.duration) ? audio.duration : 0,
            errorCode: audio instanceof HTMLAudioElement ? audio.error?.code || null : null,
            errorMessage: audio instanceof HTMLAudioElement ? audio.error?.message || "" : "elemento não encontrado"
        };
    }

    async function diagnosticarArquivos() {
        const music = diagnosticarArquivo(musica, "/media/music.mp3");
        const click = diagnosticarArquivo(somClique, "/media/click.mp3");
        return Object.freeze({
            click,
            music,
            estado: obterEstado()
        });
    }

    document.addEventListener("pointerdown", () => {
        userInteracted = true;
    }, { capture: true, passive: true });

    document.addEventListener("keydown", () => {
        userInteracted = true;
    }, { capture: true });

    document.addEventListener("click", () => {
        userInteracted = true;
    }, { capture: true });

    // Reproduz o arquivo click.mp3 ao clicar em qualquer botão do jogo.
    // A delegação cobre também botões criados dinamicamente por lojas,
    // conquistas, pets, contratos, configurações e expansões.
    // O listener em captura evita que handlers do jogo que desabilitam um
    // botão durante o clique impeçam a reprodução do efeito.
    document.addEventListener("click", event => {
        const alvo = event.target;
        const botao = alvo instanceof Element ? alvo.closest("button") : null;

        if (!botao || botao.disabled || !(somClique instanceof HTMLAudioElement)) {
            return;
        }

        void tocarEfeito();
    }, { capture: true });

    // EXATAMENTE o comportamento da versão v0.5.8:
    // a primeira interação do usuário tenta iniciar a música em loop.
    if (musica instanceof HTMLAudioElement) {
        musica.loop = true;
        document.addEventListener("click", function iniciarMusicaNaPrimeiraInteracao() {
            if (musica.paused && lerBooleano("configMusica", true)) {
                try {
                    musica.play().catch(error => {
                        console.log("Não foi possível iniciar a música:", error);
                    });
                } catch (error) {
                    console.log("Não foi possível iniciar a música:", error);
                }
            }
        }, { once: true });
    }

    window.BurgerClickerAudio = Object.freeze({
        aplicarConfiguracoes,
        tocarEfeito,
        iniciarMusica,
        pararMusica,
        obterEstado,
        diagnosticarArquivos,
        assets: Object.freeze({
            click: "/media/click.mp3",
            clickMode: "html-audio",
            music: "/media/music.mp3",
            musicMode: "html-audio"
        })
    });

    aplicarConfiguracoes();
})();
