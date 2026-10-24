(() => {
    "use strict";

    const SAVE_KEY = "bc_contracts_v1";
    const $ = id => document.getElementById(id);

    const TEXT = {
        "pt-BR": {
            title: "📜 Contratos de Chef",
            subtitle: "Aceite pedidos especiais, cumpra metas e ganhe XP extra para subir de nível mais rápido.",
            clicks: "Pedido Relâmpago",
            clicksD: "Faça {n} cliques hoje.",
            burgers: "Cozinha em Alta",
            burgersD: "Produza {n} hambúrgueres hoje.",
            expansion: "Expansão Expressa",
            expansionD: "Compre {n} negócios hoje.",
            progress: "Progresso",
            reward: "Recompensa",
            claim: "Concluir contrato",
            claimed: "✅ Contrato concluído",
            locked: "Continue jogando para completar.",
            bonus: "🏅 Bônus de jornada",
            bonusReady: "Complete os 3 contratos para receber +150 XP bônus!",
            bonusDone: "Todos os contratos de hoje foram concluídos. Excelente trabalho, Chef!",
            total: "XP ganho hoje",
            completed: "Contratos concluídos",
            streak: "Sequência de dias",
            note: "Novos contratos aparecem todos os dias. O progresso é salvo neste dispositivo.",
            xp: "+{n} XP"
        },
        "pt-PT": {
            title: "📜 Contratos de Chef",
            subtitle: "Aceita pedidos especiais, cumpre metas e ganha XP extra para subir de nível mais depressa.",
            clicks: "Pedido Relâmpago",
            clicksD: "Faz {n} cliques hoje.",
            burgers: "Cozinha em Alta",
            burgersD: "Produz {n} hambúrgueres hoje.",
            expansion: "Expansão Expressa",
            expansionD: "Compra {n} negócios hoje.",
            progress: "Progresso",
            reward: "Recompensa",
            claim: "Concluir contrato",
            claimed: "✅ Contrato concluído",
            locked: "Continua a jogar para completar.",
            bonus: "🏅 Bónus de jornada",
            bonusReady: "Completa os 3 contratos para receber +150 XP de bónus!",
            bonusDone: "Todos os contratos de hoje foram concluídos. Excelente trabalho, Chef!",
            total: "XP ganho hoje",
            completed: "Contratos concluídos",
            streak: "Sequência de dias",
            note: "Novos contratos aparecem todos os dias. O progresso é guardado neste dispositivo.",
            xp: "+{n} XP"
        },
        "en-US": {
            title: "📜 Chef Contracts",
            subtitle: "Accept special orders, complete goals, and earn bonus XP to level up faster.",
            clicks: "Lightning Order",
            clicksD: "Make {n} clicks today.",
            burgers: "Kitchen Rush",
            burgersD: "Produce {n} burgers today.",
            expansion: "Express Expansion",
            expansionD: "Buy {n} businesses today.",
            progress: "Progress",
            reward: "Reward",
            claim: "Complete contract",
            claimed: "✅ Contract completed",
            locked: "Keep playing to complete it.",
            bonus: "🏅 Daily Bonus",
            bonusReady: "Complete all 3 contracts to receive +150 bonus XP!",
            bonusDone: "All contracts for today are complete. Excellent work, Chef!",
            total: "XP earned today",
            completed: "Contracts completed",
            streak: "Day streak",
            note: "New contracts appear every day. Progress is saved on this device.",
            xp: "+{n} XP"
        }
    };

    function lang() {
        return TEXT[$("languageSelector")?.value] || TEXT["pt-BR"];
    }

    function today() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    function readNum(key) {
        const value = Number(localStorage.getItem(key) || 0);
        return Number.isFinite(value) ? value : 0;
    }

    function load() {
        try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null") || {}; }
        catch { return {}; }
    }

    function save(state) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }

    function businessTotal() {
        return ["funcionarios", "chapas", "foodTrucks", "lanchonetes", "franquias"]
            .reduce((sum, key) => sum + readNum(key), 0);
    }

    function state() {
        const s = load();
        const day = today();
        if (s.day !== day) {
            s.day = day;
            s.start = {
                burgers: readNum("hamburgueresTotais"),
                clicks: readNum("cliquesTotais"),
                businesses: businessTotal()
            };
            s.claimed = [];
            s.xpToday = 0;
            s.streak = Math.max(1, Number(s.streak || 0) + (s.previousDay ? 1 : 0));
            s.previousDay = day;
        }
        s.start ||= { burgers: readNum("hamburgueresTotais"), clicks: readNum("cliquesTotais"), businesses: businessTotal() };
        s.claimed ||= [];
        s.xpToday ||= 0;
        s.streak = Math.max(1, Number(s.streak) || 1);
        save(s);
        return s;
    }

    function seed() {
        return Number(today().replaceAll("-", "")) % 3;
    }

    function contracts() {
        const n = seed();
        return [
            { id: "clicks", type: "clicks", goal: [100, 250, 500][n], reward: 25 },
            { id: "burgers", type: "burgers", goal: [5000, 25000, 100000][(n + 1) % 3], reward: 50 },
            { id: "expansion", type: "businesses", goal: [3, 7, 15][(n + 2) % 3], reward: 75 }
        ];
    }

    function value(contract, s) {
        const now = contract.type === "clicks" ? readNum("cliquesTotais") : contract.type === "burgers" ? readNum("hamburgueresTotais") : businessTotal();
        return Math.max(0, now - Number(s.start[contract.type] || 0));
    }

    function grantXP(amount) {
        if (typeof ganharXP === "function") ganharXP(amount);
        else {
            const xp = readNum("xp") + amount;
            localStorage.setItem("xp", String(xp));
        }
        if (typeof atualizarTela === "function") atualizarTela();
        if (typeof salvarJogo === "function") salvarJogo();
    }

    function claim(s, contract) {
        if (s.claimed.includes(contract.id)) return;
        if (value(contract, s) < contract.goal) return;
        s.claimed.push(contract.id);
        s.xpToday += contract.reward;
        grantXP(contract.reward);
        if (s.claimed.length === contracts().length && !s.bonusClaimed) {
            s.bonusClaimed = true;
            s.xpToday += 150;
            grantXP(150);
        }
        save(s);
        render();
    }

    function build() {
        if (!$('contratosPainel')) return;
        $("languageSelector")?.addEventListener("change", render);
        render();
        setInterval(render, 1500);
    }

    function render() {
        const panel = $("contratosPainel");
        if (!panel) return;
        const s = state();
        const t = lang();
        const list = contracts();
        panel.querySelector("[data-contract-title]").textContent = t.title;
        panel.querySelector("[data-contract-subtitle]").textContent = t.subtitle;
        panel.querySelector("[data-contract-xp]").textContent = String(s.xpToday);
        panel.querySelector("[data-contract-count]").textContent = `${s.claimed.length}/${list.length}`;
        panel.querySelector("[data-contract-streak]").textContent = `${s.streak} 🔥`;
        panel.querySelector("[data-contract-note]").textContent = t.note;

        const grid = panel.querySelector("[data-contract-grid]");
        grid.innerHTML = "";
        list.forEach(contract => {
            const current = value(contract, s);
            const done = current >= contract.goal;
            const claimed = s.claimed.includes(contract.id);
            const card = document.createElement("article");
            card.className = "contrato-card" + (done ? " concluido" : "") + (claimed ? " resgatado" : "");
            const title = contract.id === "clicks" ? t.clicks : contract.id === "burgers" ? t.burgers : t.expansion;
            const desc = (contract.id === "clicks" ? t.clicksD : contract.id === "burgers" ? t.burgersD : t.expansionD).replace("{n}", contract.goal.toLocaleString());
            card.innerHTML = `<h3>${title}</h3><p>${desc}</p><div class="contrato-progresso">${t.progress}: ${Math.min(current, contract.goal).toLocaleString()} / ${contract.goal.toLocaleString()}</div><div class="contrato-barra"><span style="width:${Math.min(100, current / contract.goal * 100)}%"></span></div><span class="contrato-recompensa">${t.reward}: ${t.xp.replace("{n}", contract.reward)}</span>`;
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = claimed ? t.claimed : done ? t.claim : t.locked;
            button.disabled = claimed || !done;
            button.addEventListener("click", () => claim(s, contract));
            card.appendChild(button);
            grid.appendChild(card);
        });

        const bonus = panel.querySelector("[data-contract-bonus]");
        bonus.innerHTML = `<strong>${t.bonus}</strong><p>${s.bonusClaimed ? t.bonusDone : t.bonusReady}</p>`;
    }

    window.BurgerClickerContracts = { render, state };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build, { once: true });
    else build();
})();
