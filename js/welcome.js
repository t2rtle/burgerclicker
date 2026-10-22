/* ========================================
   TELA DE BOAS-VINDAS — BURGER CLICKER
   O botão JOGAR fecha a tela imediatamente e inicia o áudio sem bloquear o jogo.
======================================== */
(function () {
    "use strict";

    function iniciarBoasVindas() {
        const screen = document.getElementById("welcomeScreen");
        const playBtn = document.getElementById("welcomePlayBtn");
        if (!screen || !playBtn) return;

        screen.hidden = false;
        document.body.classList.add("welcome-aberto");

        const jogar = function () {
            // Feche a tela no mesmo gesto do usuário. A reprodução de áudio
            // nunca deve impedir a entrada no jogo caso o navegador demore.
            screen.hidden = true;
            document.body.classList.remove("welcome-aberto");
            document.body.classList.add("jogo-iniciado");

            const burger = document.getElementById("burgerBtn");
            if (burger) burger.focus({ preventScroll: true });

            // Inicia a música em segundo plano; a tela já foi fechada.
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
        };

        playBtn.addEventListener("click", jogar);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarBoasVindas, { once: true });
    } else {
        iniciarBoasVindas();
    }
})();
