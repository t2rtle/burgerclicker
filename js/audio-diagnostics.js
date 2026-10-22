"use strict";

/* Diagnóstico de áudio visível para o Burger Clicker. */
(() => {
    const $ = id => document.getElementById(id);
    const status = $("audioDiagnosticoStatus");
    const btnArquivos = $("audioDiagnosticoArquivos");
    const btnEfeito = $("audioDiagnosticoEfeito");
    const btnMusica = $("audioDiagnosticoMusica");

    if (!status || !btnArquivos || !btnEfeito || !btnMusica) return;

    function mostrar(texto) {
        status.textContent = texto;
    }

    function infoAudio(audio) {
        if (!audio) return "elemento de áudio não encontrado";
        const source = audio.querySelector("source");
        return [
            "src=" + (source?.src || audio.currentSrc || audio.src || "(vazio)"),
            "readyState=" + audio.readyState,
            "networkState=" + audio.networkState,
            "muted=" + audio.muted,
            "volume=" + audio.volume,
            "canPlayMP3=" + (audio.canPlayType('audio/mpeg') || "não informado"),
            "canPlayWAV=" + (audio.canPlayType('audio/wav') || "não informado"),
            "erro=" + (audio.error ? audio.error.code + (audio.error.message ? ": " + audio.error.message : "") : "nenhum")
        ].join("\n");
    }

    async function verificarArquivo(url) {
        try {
            const resposta = await fetch(url, { method: "HEAD", cache: "no-store" });
            return url + " → HTTP " + resposta.status +
                (resposta.headers.get("content-type") ? " | tipo: " + resposta.headers.get("content-type") : "") +
                (resposta.ok ? "" : " | resposta não OK");
        } catch (erro) {
            return url + " → FALHA de rede: " + (erro?.message || String(erro));
        }
    }

    btnArquivos.addEventListener("click", async () => {
        btnArquivos.disabled = true;
        mostrar("Verificando os arquivos e as configurações salvas…");
        try {
            const musica = $("musicaFundo");
            const efeito = $("somClique");
            const resultados = await Promise.all([
                verificarArquivo("/media/music.mp3"),
                verificarArquivo("/media/click.wav")
            ]);
            const chaves = [
                "bc_config_som",
                "bc_config_musica",
                "bc_config_volume_efeitos",
                "bc_config_volume_musica"
            ];
            const config = chaves.map(chave => chave + "=" + (() => {
                try { return localStorage.getItem(chave) ?? "(padrão)"; }
                catch (erro) { return "ERRO: " + erro.message; }
            })()).join("\n");
            mostrar(
                "RESULTADO DOS ARQUIVOS\n" + resultados.join("\n") +
                "\n\nELEMENTO DE MÚSICA\n" + infoAudio(musica) +
                "\n\nELEMENTO DE EFEITO\n" + infoAudio(efeito) +
                "\n\nCONFIGURAÇÕES SALVAS\n" + config
            );
        } catch (erro) {
            mostrar("O diagnóstico encontrou uma exceção: " + (erro?.stack || erro?.message || String(erro)));
        } finally {
            btnArquivos.disabled = false;
        }
    });

    let musicaEmTeste = false;
    let configuracaoMusicaOriginal = null;

    function testar(id, nome, loop) {
        const audio = $(id);
        if (loop && musicaEmTeste && audio && !audio.paused) {
            audio.pause();
            musicaEmTeste = false;
            if (configuracaoMusicaOriginal) {
                audio.loop = configuracaoMusicaOriginal.loop;
                audio.muted = configuracaoMusicaOriginal.muted;
                audio.volume = configuracaoMusicaOriginal.volume;
                configuracaoMusicaOriginal = null;
            }
            mostrar("Teste de música interrompido.\n\n" + infoAudio(audio));
            return;
        }
        if (!audio) {
            mostrar("FALHA: elemento " + id + " não existe no HTML.");
            return;
        }

        const volumeOriginal = audio.volume;
        const mutedOriginal = audio.muted;
        const loopOriginal = audio.loop;
        if (loop) configuracaoMusicaOriginal = { volume: volumeOriginal, muted: mutedOriginal, loop: loopOriginal };
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = 0.7;
        audio.loop = loop;
        if (loop) musicaEmTeste = true;

        const restaurar = () => {
            if (loop) {
                musicaEmTeste = false;
                configuracaoMusicaOriginal = null;
            }
            audio.loop = loopOriginal;
            audio.muted = mutedOriginal;
            audio.volume = volumeOriginal;
        };

        audio.addEventListener("error", () => {
            mostrar("FALHA ao tocar " + nome + ".\n" + infoAudio(audio));
            restaurar();
        }, { once: true });

        const promessa = audio.play();
        if (promessa && typeof promessa.then === "function") {
            promessa.then(() => {
                mostrar("O navegador ACEITOU a reprodução de " + nome + ".\nO teste utiliza diretamente o arquivo presente em /media.\n\n" + infoAudio(audio));
                if (!loop) {
                    audio.addEventListener("ended", restaurar, { once: true });
                    setTimeout(restaurar, 15000);
                }
            }).catch(erro => {
                mostrar("FALHA ao iniciar " + nome + ": " + (erro?.name || "Erro") + " — " + (erro?.message || String(erro)) + "\n\n" + infoAudio(audio));
                restaurar();
            });
        } else {
            mostrar("Foi feita a chamada de reprodução para " + nome + ".\n\n" + infoAudio(audio));
        }
    }

    btnEfeito.addEventListener("click", () => {
        const audio = window.BurgerClickerAudio;
        if (!audio || typeof audio.tocarEfeito !== "function") {
            mostrar("FALHA: sistema de áudio centralizado não está disponível.");
            return;
        }
        const tocou = audio.tocarEfeito();
        mostrar(tocou
            ? "O teste acionou o arquivo /media/click.wav diretamente usando HTMLAudioElement. Não há geração de som por Web Audio API."
            : "FALHA: não foi possível iniciar /media/click.wav. Verifique se os efeitos estão ativados, se o volume está acima de zero e se o arquivo está acessível.");
    });
    btnMusica.addEventListener("click", () => testar("musicaFundo", "música de fundo", true));
    mostrar("Pronto para diagnosticar. Toque primeiro em “Verificar arquivos” e depois teste cada áudio.");
})();
