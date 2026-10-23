/* Burger Clicker — welcome screen localization */
(function () {
    "use strict";

    const STORAGE_KEY = "burgerClickerLanguage";
    const translations = {
        "en-US": {
            aria: "Welcome to Burger Clicker",
            subtitle: "Welcome back! Check out what is new before starting your burger factory.",
            changelog: "📋 Changelog — v1.0",
            items: [
                "🎮 Complete progression system with levels, XP, businesses, and upgrades.",
                "⭐ Rebirth with tokens, permanent bonuses, and the Prestige Shop.",
                "🐾 Pet system with collection, equipping, names, and leveling.",
                "⚙️ Settings menu with audio, volume, animations, theme, vibration, and PWA installation.",
                "💾 Automatic and manual backups, restore, and safe progress reset.",
                "📱 PWA ready to install as an app in compatible browsers.",
                "🎵 Updated audio system: button sound effects and looping background music.",
                "🔊 The Play button enables audio during a browser-approved interaction."
            ],
            audio: "🔊 Click PLAY to enter the game and allow the browser to start the music and sound effects.",
            play: "🍔 PLAY"
        },
        "pt-BR": {
            aria: "Tela de boas-vindas ao Burger Clicker",
            subtitle: "Bem-vindo de volta! Confira as novidades antes de começar a sua fábrica de hambúrgueres.",
            changelog: "📋 Changelog — v1.0",
            items: [
                "🎮 Sistema completo de progressão com níveis, XP, negócios e upgrades.",
                "⭐ Rebirth com fichas, bônus permanentes e Loja de Prestígio.",
                "🐾 Sistema de pets com coleção, equipamento, nomes e evolução.",
                "⚙️ Menu de Configurações com áudio, volumes, animações, tema, vibração e instalação PWA.",
                "💾 Backups automáticos, backup manual, restauração e reset seguro do progresso.",
                "📱 PWA preparado para instalação como aplicativo em navegadores compatíveis.",
                "🎵 Sistema de áudio atualizado: efeitos nos botões e música de fundo em looping.",
                "🔊 O botão Jogar libera o áudio durante uma interação permitida pelo navegador."
            ],
            audio: "🔊 Clique em JOGAR para entrar no jogo e permitir que a música e os efeitos sonoros sejam iniciados pelo navegador.",
            play: "🍔 JOGAR"
        },
        "pt-PT": {
            aria: "Ecrã de boas-vindas ao Burger Clicker",
            subtitle: "Bem-vindo de volta! Consulte as novidades antes de começar a sua fábrica de hambúrgueres.",
            changelog: "📋 Registo de alterações — v1.0",
            items: [
                "🎮 Sistema completo de progressão com níveis, XP, negócios e melhorias.",
                "⭐ Rebirth com fichas, bónus permanentes e Loja de Prestígio.",
                "🐾 Sistema de animais de estimação com coleção, equipamento, nomes e evolução.",
                "⚙️ Menu de definições com áudio, volumes, animações, tema, vibração e instalação PWA.",
                "💾 Cópias de segurança automáticas e manuais, restauro e reinício seguro do progresso.",
                "📱 PWA preparado para instalação como aplicação em navegadores compatíveis.",
                "🎵 Sistema de áudio atualizado: efeitos nos botões e música de fundo em ciclo contínuo.",
                "🔊 O botão Jogar ativa o áudio durante uma interação permitida pelo navegador."
            ],
            audio: "🔊 Clique em JOGAR para entrar no jogo e permitir que o navegador inicie a música e os efeitos sonoros.",
            play: "🍔 JOGAR"
        }
    };

    function aplicarIdioma() {
        const idiomaSalvo = localStorage.getItem(STORAGE_KEY);
        const idioma = translations[idiomaSalvo] ? idiomaSalvo : "en-US";
        const t = translations[idioma];
        const screen = document.getElementById("welcomeScreen");
        if (!screen) return;

        screen.setAttribute("aria-label", t.aria);
        const subtitle = screen.querySelector(".welcome-subtitulo");
        const heading = screen.querySelector(".welcome-changelog h2");
        const items = screen.querySelectorAll(".welcome-changelog li");
        const audioNotice = screen.querySelector(".welcome-audio-aviso");
        const playBtn = document.getElementById("welcomePlayBtn");

        if (subtitle) subtitle.textContent = t.subtitle;
        if (heading) heading.textContent = t.changelog;
        items.forEach((item, index) => {
            if (t.items[index]) item.textContent = t.items[index];
        });
        if (audioNotice) audioNotice.textContent = t.audio;
        if (playBtn) playBtn.textContent = t.play;
    }

    document.addEventListener("burgerclicker:languagechange", aplicarIdioma);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", aplicarIdioma, { once: true });
    } else {
        aplicarIdioma();
    }

    function iniciarBoasVindas() {
        const screen = document.getElementById("welcomeScreen");
        const playBtn = document.getElementById("welcomePlayBtn");
        if (!screen || !playBtn) return;

        aplicarIdioma();
        screen.hidden = false;
        document.body.classList.add("welcome-aberto");

        playBtn.addEventListener("click", function jogar() {
            screen.hidden = true;
            document.body.classList.remove("welcome-aberto");
            document.body.classList.add("jogo-iniciado");

            const burger = document.getElementById("burgerBtn");
            if (burger) burger.focus({ preventScroll: true });

            try {
                const audio = window.BurgerClickerAudio;
                if (audio && typeof audio.iniciarMusica === "function") {
                    const tentativa = audio.iniciarMusica();
                    if (tentativa && typeof tentativa.catch === "function") {
                        tentativa.catch(erro => console.warn(
                            "Burger Clicker: não foi possível iniciar o áudio agora.", erro
                        ));
                    }
                }
            } catch (erro) {
                console.warn("Burger Clicker: não foi possível iniciar o áudio agora.", erro);
            }
        }, { once: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarBoasVindas, { once: true });
    } else {
        iniciarBoasVindas();
    }
})();