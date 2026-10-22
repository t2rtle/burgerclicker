"use strict";

/* Burger Clicker — Estatísticas avançadas.
 * Mantém métricas históricas separadas do progresso principal para que
 * Rebirth/reset não apague os dados da conta sem que o jogador peça.
 */
(() => {
    const STORAGE_KEY = "bc_statistics_v2";
    const defaultStats = {
        sessoes: 0, primeiraSessao: 0, ultimaSessao: 0,
        cliquesManuais: 0, hamburgueresManuais: 0, hamburgueresAutomaticos: 0,
        maiorSaldo: 0, maiorPPS: 0, maiorClique: 0,
        comprasNegocios: 0, comprasUpgrades: 0, comprasExpansao: 0,
        hamburgueresGastosEstimados: 0, xpGanho: 0, niveisGanhos: 0,
        rebirthsFeitos: 0, tokensGanhos: 0, tokensGastos: 0,
        petsDescobertos: 0, petsAlimentados: 0, conquistasDesbloqueadas: 0,
        tempoOnline: 0, tempoNestaSessao: 0,
        maiorNivel: 1, maiorMultiplicadorClique: 1, maiorBonusPrestige: 1,
        maiorQuantidadeNegocios: 0, maiorQuantidadeFuncionarios: 0,
        maiorQuantidadeChapas: 0, maiorQuantidadeFoodTrucks: 0,
        maiorQuantidadeLanchonetes: 0, maiorQuantidadeFranquias: 0,
        ultimoRebirthEm: 0, ultimoNivelEm: 0,
        cliquesPorSegundoMax: 0, cliquesNoUltimoMinuto: 0,
        segundosAtivos: 0, diasJogados: 0
    };

    function carregar() {
        try {
            const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            return Object.assign({}, defaultStats, salvo && typeof salvo === "object" ? salvo : {});
        } catch { return Object.assign({}, defaultStats); }
    }
    let stats = carregar();
    const agora = Date.now();
    if (!stats.primeiraSessao) stats.primeiraSessao = agora;
    stats.sessoes++;
    stats.ultimaSessao = agora;

    const snapshot = {
        cliques: Number(typeof cliquesTotais !== "undefined" ? cliquesTotais : 0),
        total: Number(typeof hamburgueresTotais !== "undefined" ? hamburgueresTotais : 0),
        xp: Number(typeof xp !== "undefined" ? xp : 0),
        nivel: Number(typeof nivel !== "undefined" ? nivel : 1),
        rebirths: Number(typeof rebirths !== "undefined" ? rebirths : 0),
        tokens: Number(typeof prestigeTokensEarned !== "undefined" ? prestigeTokensEarned : 0),
        pets: 0, conquistas: 0,
        negocios: { funcionario: 0, chapa: 0, foodTruck: 0, lanchonete: 0, franquia: 0 },
        upgrades: 0, expansao: 0,
        saldo: Number(typeof hamburgueres !== "undefined" ? hamburgueres : 0),
        tempo: Number(typeof tempoJogado !== "undefined" ? tempoJogado : 0),
        inicioSegundo: Math.floor(Date.now() / 1000),
        cliquesSegundo: 0
    };

    function salvar() {
        stats.ultimaSessao = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
    function num(valor) { return Number.isFinite(Number(valor)) ? Number(valor) : 0; }
    function fmt(valor) {
        if (typeof formatarNumero === "function") return formatarNumero(Math.round(num(valor)));
        return Math.round(num(valor)).toLocaleString("pt-BR");
    }
    function pct(valor) { return (num(valor) * 100).toFixed(1) + "%"; }
    function duracao(segundos) {
        segundos = Math.max(0, Math.floor(num(segundos)));
        const d = Math.floor(segundos / 86400); segundos %= 86400;
        const h = Math.floor(segundos / 3600); segundos %= 3600;
        const m = Math.floor(segundos / 60); const s = segundos % 60;
        if (d) return `${d}d ${h}h ${m}min`;
        if (h) return `${h}h ${m}min`;
        if (m) return `${m}min ${s}s`;
        return `${s}s`;
    }
    function lerExpansion() {
        try { return JSON.parse(localStorage.getItem("bc_expansion_state_v1") || "{}"); } catch { return {}; }
    }
    function contarPets() {
        try { return JSON.parse(localStorage.getItem("petColecao") || "[]").length; } catch { return 0; }
    }
    function contarConquistas() {
        try { return JSON.parse(localStorage.getItem("conquistas") || "[]").length; } catch { return 0; }
    }
    function contarExpansion() {
        const e = lerExpansion();
        let n = 0;
        if (e.shop && typeof e.shop === "object") n += Object.values(e.shop).reduce((a, v) => a + num(v), 0);
        if (e.upgrades && typeof e.upgrades === "object") n += Object.values(e.upgrades).filter(Boolean).length;
        return n;
    }

    function injetarInterface() {
        const painel = document.querySelector(".estatisticas");
        if (!painel || document.getElementById("estatisticasAvancadas")) return;
        const bloco = document.createElement("section");
        bloco.id = "estatisticasAvancadas";
        bloco.className = "estatisticas-avancadas";
        bloco.innerHTML = `
            <div class="estat-cabecalho-avancado">
                <div><h3>📈 Estatísticas detalhadas</h3><p>Seu histórico completo de produção, progressão, economia e atividade.</p></div>
                <button id="estatAtualizarBtn" type="button">🔄 Atualizar</button>
            </div>
            <div class="estat-grid">
                <article><h4>🍔 Produção</h4><p>Total produzido <b id="saTotal">0</b></p><p>Produção manual <b id="saManual">0</b></p><p>Produção automática <b id="saAuto">0</b></p><p>Saldo atual <b id="saSaldo">0</b></p><p>Maior saldo <b id="saMaiorSaldo">0</b></p><p>Maior clique <b id="saMaiorClique">0</b></p><p>Maior produção/s <b id="saMaiorPPS">0</b></p></article>
                <article><h4>🖱️ Cliques</h4><p>Cliques totais <b id="saCliques">0</b></p><p>Cliques nesta sessão <b id="saCliquesSessao">0</b></p><p>Máx. cliques/s <b id="saCPS">0</b></p><p>Produção média por clique <b id="saMediaClique">0</b></p><p>Cliques por minuto <b id="saCPM">0</b></p></article>
                <article><h4>🏪 Negócios</h4><p>Funcionários <b id="saFunc">0</b></p><p>Chapas <b id="saChapas">0</b></p><p>Food Trucks <b id="saTrucks">0</b></p><p>Lanchonetes <b id="saLanch">0</b></p><p>Franquias <b id="saFranq">0</b></p><p>Total de negócios <b id="saNegocios">0</b></p><p>Compras de negócios <b id="saComprasNeg">0</b></p></article>
                <article><h4>⬆️ Progressão</h4><p>Nível atual <b id="saNivel">1</b></p><p>Maior nível <b id="saMaiorNivel">1</b></p><p>XP atual <b id="saXP">0</b></p><p>XP total ganho <b id="saXPGanho">0</b></p><p>Upgrades comprados <b id="saUpgrades">0</b></p><p>Itens da expansão <b id="saExpansao">0</b></p></article>
                <article><h4>⭐ Rebirth & Prestígio</h4><p>Rebirths <b id="saRebirth">0</b></p><p>Tokens conquistados <b id="saTokens">0</b></p><p>Tokens gastos <b id="saTokensGastos">0</b></p><p>Bônus máximo <b id="saBonus">1x</b></p><p>Último Rebirth <b id="saUltimoRebirth">—</b></p></article>
                <article><h4>🐾 Coleção</h4><p>Pets descobertos <b id="saPets">0</b></p><p>Pets disponíveis <b id="saPetsTotal">0</b></p><p>Pets alimentados <b id="saAlimentos">0</b></p><p>Conquistas obtidas <b id="saConquistas">0</b></p><p>Conquistas rastreadas <b id="saConquistasTotal">0</b></p></article>
                <article><h4>⏱️ Tempo</h4><p>Tempo total jogado <b id="saTempo">0</b></p><p>Nesta sessão <b id="saSessao">0</b></p><p>Sessões iniciadas <b id="saSessoes">0</b></p><p>Segundos ativos <b id="saAtivos">0</b></p><p>Primeira sessão <b id="saPrimeira">—</b></p></article>
                <article><h4>📊 Desempenho</h4><p>Eficiência automática <b id="saEficiencia">0%</b></p><p>Multiplicador de clique máximo <b id="saMultClique">1x</b></p><p>Maior quantidade de negócios <b id="saMaiorNegocios">0</b></p><p>Hambúrgueres nesta run <b id="saRun">0</b></p><p>Data da última atividade <b id="saUltima">—</b></p></article>
            </div>`;
        painel.appendChild(bloco);
        document.getElementById("estatAtualizarBtn")?.addEventListener("click", atualizar);
    }

    function atualizar() {
        const negocios = {
            funcionario: num(typeof funcionarios !== "undefined" ? funcionarios : 0),
            chapa: num(typeof chapas !== "undefined" ? chapas : 0),
            foodTruck: num(typeof foodTrucks !== "undefined" ? foodTrucks : 0),
            lanchonete: num(typeof lanchonetes !== "undefined" ? lanchonetes : 0),
            franquia: num(typeof franquias !== "undefined" ? franquias : 0)
        };
        const totalNegocios = Object.values(negocios).reduce((a, b) => a + b, 0);
        const total = num(typeof hamburgueresTotais !== "undefined" ? hamburgueresTotais : 0);
        const saldo = num(typeof hamburgueres !== "undefined" ? hamburgueres : 0);
        const cliques = num(typeof cliquesTotais !== "undefined" ? cliquesTotais : 0);
        const tempo = num(typeof tempoJogado !== "undefined" ? tempoJogado : 0);
        const nivelAtual = num(typeof nivel !== "undefined" ? nivel : 1);
        const rebirthAtual = num(typeof rebirths !== "undefined" ? rebirths : 0);
        const tokens = num(typeof prestigeTokensEarned !== "undefined" ? prestigeTokensEarned : 0);
        const bonus = typeof bonusPrestige === "function" ? num(bonusPrestige()) : 1;
        const ppsAtual = typeof calcularPPS === "function" ? num(calcularPPS()) : 0;
        const multClique = num(typeof multiplicadorClique !== "undefined" ? multiplicadorClique : 1);
        const pets = contarPets();
        const conquistasAtuais = contarConquistas();
        const expItens = contarExpansion();

        stats.maiorSaldo = Math.max(stats.maiorSaldo, saldo);
        stats.maiorPPS = Math.max(stats.maiorPPS, ppsAtual);
        stats.maiorNivel = Math.max(stats.maiorNivel, nivelAtual);
        stats.maiorBonusPrestige = Math.max(stats.maiorBonusPrestige, bonus);
        stats.maiorMultiplicadorClique = Math.max(stats.maiorMultiplicadorClique, multClique);
        stats.maiorQuantidadeNegocios = Math.max(stats.maiorQuantidadeNegocios, totalNegocios);
        stats.maiorQuantidadeFuncionarios = Math.max(stats.maiorQuantidadeFuncionarios, negocios.funcionario);
        stats.maiorQuantidadeChapas = Math.max(stats.maiorQuantidadeChapas, negocios.chapa);
        stats.maiorQuantidadeFoodTrucks = Math.max(stats.maiorQuantidadeFoodTrucks, negocios.foodTruck);
        stats.maiorQuantidadeLanchonetes = Math.max(stats.maiorQuantidadeLanchonetes, negocios.lanchonete);
        stats.maiorQuantidadeFranquias = Math.max(stats.maiorQuantidadeFranquias, negocios.franquia);
        stats.petsDescobertos = Math.max(stats.petsDescobertos, pets);
        stats.conquistasDesbloqueadas = Math.max(stats.conquistasDesbloqueadas, conquistasAtuais);
        stats.tempoOnline++;
        stats.tempoNestaSessao++;
        stats.segundosAtivos++;
        stats.diasJogados = Math.max(1, Math.ceil((Date.now() - stats.primeiraSessao) / 86400000));

        const deltaTotal = total - snapshot.total;
        if (deltaTotal > 0) {
            const manualDelta = Math.max(0, stats.hamburgueresManuais - snapshot.cliques); // corrigido abaixo pelo listener
            const autoDelta = Math.max(0, deltaTotal - Math.max(0, manualDelta));
            stats.hamburgueresAutomaticos += autoDelta;
        }
        if (cliques > snapshot.cliques) stats.cliquesNoUltimoMinuto += cliques - snapshot.cliques;
        stats.rebirthsFeitos = Math.max(stats.rebirthsFeitos, rebirthAtual);
        stats.tokensGanhos = Math.max(stats.tokensGanhos, tokens);
        snapshot.total = total; snapshot.cliques = cliques; snapshot.xp = num(typeof xp !== "undefined" ? xp : 0);
        snapshot.nivel = nivelAtual; snapshot.rebirths = rebirthAtual; snapshot.tokens = tokens;
        snapshot.saldo = saldo; snapshot.tempo = tempo;

        const set = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };
        set("saTotal", fmt(total)); set("saManual", fmt(stats.hamburgueresManuais)); set("saAuto", fmt(stats.hamburgueresAutomaticos));
        set("saSaldo", fmt(saldo)); set("saMaiorSaldo", fmt(stats.maiorSaldo)); set("saMaiorClique", fmt(stats.maiorClique)); set("saMaiorPPS", fmt(stats.maiorPPS));
        set("saCliques", fmt(cliques)); set("saCliquesSessao", fmt(Math.max(0, cliques - (Number(sessionStorage.getItem("bcStatsStartClicks")) || cliques))));
        set("saCPS", fmt(stats.cliquesPorSegundoMax)); set("saMediaClique", fmt(cliques ? total / cliques : 0)); set("saCPM", fmt(stats.cliquesNoUltimoMinuto));
        set("saFunc", fmt(negocios.funcionario)); set("saChapas", fmt(negocios.chapa)); set("saTrucks", fmt(negocios.foodTruck)); set("saLanch", fmt(negocios.lanchonete)); set("saFranq", fmt(negocios.franquia)); set("saNegocios", fmt(totalNegocios)); set("saComprasNeg", fmt(stats.comprasNegocios));
        set("saNivel", fmt(nivelAtual)); set("saMaiorNivel", fmt(stats.maiorNivel)); set("saXP", fmt(typeof xp !== "undefined" ? xp : 0)); set("saXPGanho", fmt(stats.xpGanho)); set("saUpgrades", fmt(stats.comprasUpgrades)); set("saExpansao", fmt(expItens));
        set("saRebirth", fmt(rebirthAtual)); set("saTokens", fmt(tokens)); set("saTokensGastos", fmt(stats.tokensGastos)); set("saBonus", bonus.toFixed(2) + "x"); set("saUltimoRebirth", stats.ultimoRebirthEm ? new Date(stats.ultimoRebirthEm).toLocaleString("pt-BR") : "—");
        set("saPets", fmt(pets)); set("saPetsTotal", typeof PET_CATALOG !== "undefined" ? fmt(PET_CATALOG.length) : "—"); set("saAlimentos", fmt(stats.petsAlimentados)); set("saConquistas", fmt(conquistasAtuais)); set("saConquistasTotal", "100+");
        set("saTempo", duracao(tempo)); set("saSessao", duracao(stats.tempoNestaSessao)); set("saSessoes", fmt(stats.sessoes)); set("saAtivos", duracao(stats.segundosAtivos)); set("saPrimeira", new Date(stats.primeiraSessao).toLocaleString("pt-BR"));
        set("saEficiencia", pct(total ? stats.hamburgueresAutomaticos / total : 0)); set("saMultClique", stats.maiorMultiplicadorClique.toFixed(2) + "x"); set("saMaiorNegocios", fmt(stats.maiorQuantidadeNegocios)); set("saRun", fmt(typeof runHamburgueres !== "undefined" ? runHamburgueres : 0)); set("saUltima", new Date(stats.ultimaSessao).toLocaleString("pt-BR"));
    }

    function registrarClique() {
        const ganho = typeof calcularPoderClique === "function" ? num(calcularPoderClique()) : 0;
        stats.cliquesManuais++;
        stats.hamburgueresManuais += ganho;
        stats.maiorClique = Math.max(stats.maiorClique, ganho);
        snapshot.cliquesSegundo++;
    }
    function detectarMudancas() {
        const negocios = ["funcionarios", "chapas", "foodTrucks", "lanchonetes", "franquias"];
        negocios.forEach(k => {
            const atual = num(typeof window[k] !== "undefined" ? window[k] : 0);
            if (atual > num(snapshot.negocios[k])) stats.comprasNegocios += atual - num(snapshot.negocios[k]);
            snapshot.negocios[k] = atual;
        });
        const upgradesNormais = ["upgradeClique2x", "upgradeClique5x", "upgradeFuncionario", "upgradeChapa", "upgradeGlobal"];
        upgradesNormais.forEach(k => { if (typeof window[k] === "boolean" && window[k] && !snapshot[k]) stats.comprasUpgrades++; snapshot[k] = typeof window[k] === "boolean" ? window[k] : snapshot[k]; });
        const novoNivel = num(typeof nivel !== "undefined" ? nivel : 1);
        if (novoNivel > snapshot.nivel) { stats.niveisGanhos += novoNivel - snapshot.nivel; stats.ultimoNivelEm = Date.now(); }
        const novoRebirth = num(typeof rebirths !== "undefined" ? rebirths : 0);
        if (novoRebirth > snapshot.rebirths) { stats.ultimoRebirthEm = Date.now(); }
        const novoTokens = num(typeof prestigeTokensEarned !== "undefined" ? prestigeTokensEarned : 0);
        if (novoTokens > snapshot.tokens) stats.tokensGanhos += novoTokens - snapshot.tokens;
        const novoXp = num(typeof xp !== "undefined" ? xp : 0);
        if (novoXp > snapshot.xp) stats.xpGanho += novoXp - snapshot.xp;
        snapshot.nivel = novoNivel; snapshot.rebirths = novoRebirth; snapshot.tokens = novoTokens; snapshot.xp = novoXp;
    }

    try {
        if (!sessionStorage.getItem("bcStatsStartClicks")) sessionStorage.setItem("bcStatsStartClicks", String(num(typeof cliquesTotais !== "undefined" ? cliquesTotais : 0)));
    } catch {}
    document.addEventListener("click", event => {
        const alvo = event.target instanceof Element ? event.target : null;
        if (alvo?.closest("#burgerBtn")) registrarClique();
    }, true);

    injetarInterface();
    atualizar();
    setInterval(() => { detectarMudancas(); atualizar(); salvar(); }, 1000);
    setInterval(() => {
        stats.cliquesPorSegundoMax = Math.max(stats.cliquesPorSegundoMax, snapshot.cliquesSegundo);
        snapshot.cliquesSegundo = 0;
        salvar();
    }, 1000);
    setInterval(() => { stats.cliquesNoUltimoMinuto = 0; }, 60000);
    window.addEventListener("beforeunload", salvar);
})();
