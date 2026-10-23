(() => {
    "use strict";

    const CARD_SELECTOR = ".bc-ach-card";

    function limparTexto(valor) {
        return String(valor || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function prepararConquista(card) {
        if (!(card instanceof Element) || !card.matches(CARD_SELECTOR)) return;

        const titulo = limparTexto(card.querySelector("h3"));
        const descricao = limparTexto(card.querySelector("p"));
        const recompensa = limparTexto(card.querySelector("small"));
        const obtida = card.classList.contains("obtained");

        if (!titulo && !descricao && !recompensa) return;

        const nome = titulo || "🏆 Conquista";
        const partes = [];

        if (descricao) {
            partes.push("🎯 Desafio: " + descricao);
        }

        if (recompensa) {
            partes.push("🎁 Recompensa: " + recompensa);
        }

        partes.push(
            obtida
                ? "✅ Esta conquista já foi obtida. O bônus correspondente está registrado no seu progresso."
                : "🔒 Ainda não obtida. Complete o desafio para desbloquear a recompensa."
        );

        card.dataset.tooltipTitle = nome;
        card.dataset.tooltip = partes.join("\n\n");
        delete card.dataset.tooltipAuto;
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", nome + ". " + partes.join(" "));
    }

    function prepararTodas() {
        document.querySelectorAll(CARD_SELECTOR).forEach(prepararConquista);
    }

    prepararTodas();

    const observador = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type !== "childList") continue;

            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) continue;

                if (node.matches(CARD_SELECTOR)) {
                    prepararConquista(node);
                }

                node.querySelectorAll?.(CARD_SELECTOR).forEach(prepararConquista);
            }
        }
    });

    observador.observe(document.body, { childList: true, subtree: true });

    // Recalcula as informações quando o estado da conquista muda.
    // Isso mantém a tooltip correta após desbloqueios sem duplicar elementos.
    const classeObservador = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                prepararConquista(mutation.target);
            }
        }
    });

    classeObservador.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
        subtree: true
    });
})();
