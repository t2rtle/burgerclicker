/* ========================================
   TELA DE BOAS-VINDAS — BURGER CLICKER
   O botão JOGAR também libera o áudio no navegador.
======================================== */
(function () {
    "use strict";

    function iniciarBoasVindas() {
        const screen = document.getElementById("welcomeScreen");
        const playBtn = document.getElementById("welcomePlayBtn");
        if (!screen || !playBtn) return;

        // A tela aparece sempre que o site é aberto/recarregado.
        screen.hidden = false;
        document.body.classList.add("welcome-aberto");

        const jogar = async function () {
            // Este clique é uma interação real do usuário e, portanto,
            // é o melhor momento para desbloquear o áudio.
            try {
                if (window.BurgerClickerAudio) {
                    window.BurgerClickerAudio.tocarEfeito();
                    await window.BurgerClickerAudio.iniciarMusica();
                }
            } catch (erro) {
                console.warn("Burger Clicker: não foi possível iniciar o áudio agora.", erro);
            }

            screen.hidden = true;
            document.body.classList.remove("welcome-aberto");
            document.body.classList.add("jogo-iniciado");

            // Devolve o foco ao jogo para teclado/acessibilidade.
            const burger = document.getElementById("burgerBtn");
            if (burger) burger.focus({ preventScroll: true });
        };

        playBtn.addEventListener("click", jogar, { once: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarBoasVindas, { once: true });
    } else {
        iniciarBoasVindas();
    }
})();
