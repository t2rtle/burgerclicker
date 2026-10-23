"use strict";

/* Diagnóstico do sistema de áudio MP3 do Burger Clicker. */
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
        if (!(audio instanceof HTMLAudioElement)) return "elemento de áudio não encontrado";
        const source = audio.querySelector("source");
        return [
            "src=" + (source?.src || audio.currentSrc || audio.src || "(vazio)"),
            "readyState=" + audio.readyState,
            "networkState=" + audio.networkState,
            "paused=" + audio.paused,
            "muted=" + audio.muted,
            "volume=" + audio.volume,
            "duration=" + (Number.isFinite(audio.duration) ? audio.duration.toFixed(2) + "s" : "desconhecida"),
            "canPlayMP3=" + (audio.canPlayType("audio/mpeg") || "não informado"),
            "erro=" + (audio.error ? audio.error.code + (audio.error.message ? ": " + audio.error.message : "") : "nenhum")
        ].join("\n");
    }

    function infoSistema() {
        const sistema = window.BurgerClickerAudio;
        if (!sistema || typeof sistema.obterEstado !== "function") return "Sistema centralizado: NÃO disponível";
        const estado = sistema.obterEstado();
        return [
            "engine=" + estado.engine,
            "Web Audio API=" + (estado.webAudio ? "SIM" : "NÃO"),
            "arquivo de efeito=" + estado.clickSource,
            "arquivo de música=" + estado.musicSource,
            "formato=" + (estado.format || "MP3"),
            "usuário já interagiu=" + estado.userInteracted
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

    btnArquivos.addEventListener("click", async event => {
        event.stopPropagation();
        btnArquivos.disabled = true;
        mostrar("Verificando os dois arquivos MP3 da pasta /media…");
        try {
            const musica = $("musicaFundo");
            const efeito = $("somClique");
            const resultados = await Promise.all([
                verificarArquivo("/media/music.mp3"),
                verificarArquivo("/media/click.mp3")
            ]);

            let testes = "";
            if (window.BurgerClickerAudio?.diagnosticarArquivos) {
                const resultado = await window.BurgerClickerAudio.diagnosticarArquivos();
                testes = "\n\nCARREGAMENTO DOS ARQUIVOS MP3\n" + JSON.stringify(resultado, null, 2);
            }

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
                "RESULTADO DOS ARQUIVOS MP3\n" + resultados.join("\n") +
                "\n\nSISTEMA CENTRALIZADO\n" + infoSistema() +
                "\n\nELEMENTO DE MÚSICA\n" + infoAudio(musica) +
                "\n\nELEMENTO DE EFEITO\n" + infoAudio(efeito) +
                "\n\nCONFIGURAÇÕES SALVAS\n" + config + testes
            );
        } catch (erro) {
            mostrar("O diagnóstico encontrou uma exceção: " + (erro?.stack || erro?.message || String(erro)));
        } finally {
            btnArquivos.disabled = false;
        }
    });

    let musicaEmTeste = false;
    let configuracaoMusicaOriginal = null;

    function testarMusica() {
        const audio = $("musicaFundo");
        if (!(audio instanceof HTMLAudioElement)) {
            mostrar("FALHA: o elemento #musicaFundo não existe no HTML.");
            return;
        }

        if (musicaEmTeste && !audio.paused) {
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

        configuracaoMusicaOriginal = {
            volume: audio.volume,
            muted: audio.muted,
            loop: audio.loop
        };
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = 0.7;
        audio.loop = true;
        musicaEmTeste = true;

        const promessa = audio.play();
        if (promessa && typeof promessa.then === "function") {
            promessa.then(() => {
                mostrar("O navegador ACEITOU a reprodução de /media/music.mp3 usando HTMLAudioElement.\nOs efeitos e a música usam arquivos MP3 reais; não há geração por Web Audio API.\n\n" + infoAudio(audio));
            }).catch(erro => {
                mostrar("FALHA ao iniciar /media/music.mp3: " + (erro?.name || "Erro") + " — " + (erro?.message || String(erro)) + "\n\n" + infoAudio(audio));
                restaurarMusica();
            });
        }
    }

    function restaurarMusica() {
        const audio = $("musicaFundo");
        if (!(audio instanceof HTMLAudioElement)) return;
        audio.pause();
        if (configuracaoMusicaOriginal) {
            audio.loop = configuracaoMusicaOriginal.loop;
            audio.muted = configuracaoMusicaOriginal.muted;
            audio.volume = configuracaoMusicaOriginal.volume;
        }
        configuracaoMusicaOriginal = null;
        musicaEmTeste = false;
    }

    btnEfeito.addEventListener("click", event => {
        event.stopPropagation();
        const sistema = window.BurgerClickerAudio;
        if (!sistema || typeof sistema.tocarEfeito !== "function") {
            mostrar("FALHA: sistema de áudio centralizado não está disponível.");
            return;
        }
        const audio = sistema.tocarEfeito({ forcar: true });
        mostrar(audio
            ? "Teste solicitado: /media/click.mp3 foi enviado ao HTMLAudioElement.\n\n" + infoSistema()
            : "FALHA ao iniciar /media/click.mp3. Verifique o arquivo, volume e console do navegador.");
    });

    btnMusica.addEventListener("click", event => {
        event.stopPropagation();
        testarMusica();
    });

    mostrar("Pronto para diagnosticar. O sistema usa exclusivamente /media/music.mp3 e /media/click.mp3.");
})();