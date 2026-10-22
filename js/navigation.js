"use strict";

(() => {
    const AREAS = [
        ["loja", "🏪 Loja", ".loja"],
        ["upgrades", "⬆️ Upgrades", ".upgrades"],
        ["rebirth", "⭐ Rebirth", ".prestige"],
        ["prestige", "🪙 Loja de Prestígio", ".prestige-shop-panel"],
        ["pets", "🐾 Pets", ".painel-pets"],
        ["estatisticas", "📊 Estatísticas", ".estatisticas"],
        ["conquistas", "🏆 Conquistas", ".conquistas"]
    ];

    function iniciarNavegacao() {
        const painel = document.querySelector(".painel");
        const configBtn = document.getElementById("configBtn");
        if (!painel || !configBtn) return;

        const nav = document.createElement("nav");
        nav.className = "bc-areas-nav";
        nav.setAttribute("aria-label", "Áreas do Burger Clicker");

        const titulo = document.createElement("p");
        titulo.className = "bc-areas-titulo";
        titulo.textContent = "📂 Menus do jogo";
        nav.appendChild(titulo);

        const botoes = [];
        const secoes = [];

        const abrirArea = (indice, foco = true) => {
            secoes.forEach((secao, i) => {
                const aberta = i === indice && secao.elemento.hidden;
                secao.elemento.hidden = !aberta;
                secao.botao.setAttribute("aria-expanded", aberta ? "true" : "false");
                secao.botao.classList.toggle("ativo", aberta);
            });

            if (foco && secoes[indice]?.elemento && !secoes[indice].elemento.hidden) {
                requestAnimationFrame(() => secoes[indice].elemento.scrollIntoView({ behavior: "smooth", block: "start" }));
            }
        };

        AREAS.forEach(([id, rotulo, seletor], indice) => {
            const elemento = document.querySelector(seletor);
            if (!elemento) return;

            elemento.classList.add("bc-area-conteudo");
            elemento.hidden = true;
            elemento.id = elemento.id || `bc-area-${id}`;

            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "bc-area-btn";
            botao.textContent = rotulo;
            botao.setAttribute("aria-controls", elemento.id);
            botao.setAttribute("aria-expanded", "false");
            botao.addEventListener("click", () => abrirArea(indice));

            nav.appendChild(botao);
            botoes.push(botao);
            secoes.push({ botao, elemento });
        });

        // O botão de configurações passa a fazer parte da mesma barra e fica
        // abaixo do painel do hambúrguer, junto dos demais menus.
        configBtn.classList.add("bc-area-btn", "bc-config-area-btn");
        configBtn.style.margin = "";
        nav.appendChild(configBtn);

        painel.insertAdjacentElement("afterend", nav);

        // A Loja abre primeiro para que o jogo continue apresentando seu fluxo
        // principal sem voltar a ocupar a página inteira.
        if (secoes.length) {
            secoes[0].elemento.hidden = false;
            secoes[0].botao.setAttribute("aria-expanded", "true");
            secoes[0].botao.classList.add("ativo");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarNavegacao, { once: true });
    } else {
        iniciarNavegacao();
    }
})();
