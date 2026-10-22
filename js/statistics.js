"use strict";

/* Estatísticas avançadas do Burger Clicker. */
(() => {
    const KEY = "bc_statistics_v2";
    const base = {
        sessoes:0, primeiraSessao:0, ultimaSessao:0, tempoSessao:0,
        cliquesManuais:0, producaoManual:0, producaoAutomatica:0,
        maiorSaldo:0, maiorPPS:0, maiorClique:0, maiorCPS:0,
        comprasNegocios:0, comprasUpgrades:0, comprasExpansao:0,
        xpGanho:0, niveisGanhos:0, rebirthsHistorico:0, tokensGanhos:0,
        maiorNivel:1, maiorBonusPrestige:1, maiorMultiplicadorClique:1,
        maiorNegocios:0, petsAlimentados:0, maiorPets:0, maiorConquistas:0,
        ultimoRebirthEm:0, ultimoNivelEm:0
    };
    let s = (() => { try { return {...base, ...(JSON.parse(localStorage.getItem(KEY)||"{}"))}; } catch { return {...base}; } })();
    const now = Date.now(); if (!s.primeiraSessao) s.primeiraSessao = now; s.sessoes++; s.ultimaSessao = now;
    const snap = {
        total: n(typeof hamburgueresTotais!=="undefined"?hamburgueresTotais:0), clicks:n(typeof cliquesTotais!=="undefined"?cliquesTotais:0),
        manual:0, xp:n(typeof xp!=="undefined"?xp:0), nivel:n(typeof nivel!=="undefined"?nivel:1), rebirth:n(typeof rebirths!=="undefined"?rebirths:0),
        tokens:n(typeof prestigeTokensEarned!=="undefined"?prestigeTokensEarned:0), negocios:{funcionario:0,chapa:0,foodTruck:0,lanchonete:0,franquia:0}, upgrades:0
    };
    function n(v){v=Number(v);return Number.isFinite(v)?v:0;}
    function fmt(v){return typeof formatarNumero==="function"?formatarNumero(Math.round(n(v))):Math.round(n(v)).toLocaleString("pt-BR");}
    function tempo(v){v=Math.max(0,Math.floor(n(v)));const d=Math.floor(v/86400);v%=86400;const h=Math.floor(v/3600);v%=3600;const m=Math.floor(v/60);const sec=v%60;return d?`${d}d ${h}h ${m}min`:h?`${h}h ${m}min`:m?`${m}min ${sec}s`:`${sec}s`;}
    function pets(){try{return JSON.parse(localStorage.getItem("petColecao")||"[]").length;}catch{return 0;}}
    function ach(){try{return JSON.parse(localStorage.getItem("conquistas")||"[]").length;}catch{return 0;}}
    function exp(){try{const x=JSON.parse(localStorage.getItem("bc_expansion_state_v1")||"{}");return (x.shop?Object.values(x.shop).reduce((a,v)=>a+n(v),0):0)+(x.upgrades?Object.values(x.upgrades).filter(Boolean).length:0);}catch{return 0;}}
    function set(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}

    function ui(){
        const p=document.querySelector(".estatisticas"); if(!p||document.getElementById("estatisticasAvancadas"))return;
        const x=document.createElement("section");x.id="estatisticasAvancadas";x.className="estatisticas-avancadas";
        x.innerHTML=`<div class="estat-cabecalho-avancado"><div><h3>📈 Estatísticas detalhadas</h3><p>Um painel completo com seu histórico e desempenho.</p></div><button id="estatAtualizarBtn" type="button">🔄 Atualizar</button></div><div class="estat-grid">
        <article><h4>🍔 Produção</h4><p>Total produzido <b id="saTotal">0</b></p><p>Produção manual <b id="saManual">0</b></p><p>Produção automática <b id="saAuto">0</b></p><p>Saldo atual <b id="saSaldo">0</b></p><p>Maior saldo <b id="saMaiorSaldo">0</b></p><p>Maior clique <b id="saMaiorClique">0</b></p><p>Maior PPS <b id="saMaiorPPS">0</b></p></article>
        <article><h4>🖱️ Cliques</h4><p>Cliques totais <b id="saCliques">0</b></p><p>Nesta sessão <b id="saCliquesSessao">0</b></p><p>Máx. cliques/s <b id="saCPS">0</b></p><p>Média por clique <b id="saMedia">0</b></p><p>Cliques/minuto <b id="saCPM">0</b></p></article>
        <article><h4>🏪 Negócios</h4><p>Funcionários <b id="saFunc">0</b></p><p>Chapas <b id="saChapas">0</b></p><p>Food Trucks <b id="saTrucks">0</b></p><p>Lanchonetes <b id="saLanch">0</b></p><p>Franquias <b id="saFranq">0</b></p><p>Total atual <b id="saNegocios">0</b></p><p>Compras totais <b id="saCompras">0</b></p></article>
        <article><h4>⬆️ Progressão</h4><p>Nível atual <b id="saNivel">1</b></p><p>Maior nível <b id="saMaiorNivel">1</b></p><p>XP atual <b id="saXP">0</b></p><p>XP ganho rastreado <b id="saXPGanho">0</b></p><p>Upgrades comprados <b id="saUpgrades">0</b></p><p>Itens da expansão <b id="saExp">0</b></p></article>
        <article><h4>⭐ Rebirth & Prestígio</h4><p>Rebirths <b id="saRebirth">0</b></p><p>Tokens ganhos <b id="saTokens">0</b></p><p>Bônus atual/máximo <b id="saBonus">1x</b></p><p>Multiplicador de clique máximo <b id="saMult">1x</b></p><p>Último Rebirth <b id="saUltimoRebirth">—</b></p></article>
        <article><h4>🐾 Coleção</h4><p>Pets descobertos <b id="saPets">0</b></p><p>Pets disponíveis <b id="saPetsTotal">0</b></p><p>Pets alimentados <b id="saAlimentados">0</b></p><p>Conquistas obtidas <b id="saAch">0</b></p><p>Conquistas no sistema <b id="saAchTotal">100+</b></p></article>
        <article><h4>⏱️ Tempo</h4><p>Tempo total do jogo <b id="saTempo">0</b></p><p>Nesta sessão <b id="saSessao">0</b></p><p>Sessões iniciadas <b id="saSessoes">0</b></p><p>Primeira sessão <b id="saPrimeira">—</b></p><p>Dias desde o início <b id="saDias">0</b></p></article>
        <article><h4>📊 Desempenho</h4><p>Eficiência automática <b id="saEficiencia">0%</b></p><p>Maior quantidade de negócios <b id="saMaiorNeg">0</b></p><p>Hambúrgueres nesta run <b id="saRun">0</b></p><p>Última atividade <b id="saUltima">—</b></p><p>Estado salvo <b id="saEstado">Ativo</b></p></article></div>`;
        p.appendChild(x);document.getElementById("estatAtualizarBtn")?.addEventListener("click",render);
    }

    function rastrear(){
        const bs=["funcionarios","chapas","foodTrucks","lanchonetes","franquias"], nomes=["funcionario","chapa","foodTruck","lanchonete","franquia"];
        bs.forEach((k,i)=>{const v=n(typeof window[k]!=="undefined"?window[k]:({funcionarios:typeof funcionarios!=="undefined"?funcionarios:0,chapas:typeof chapas!=="undefined"?chapas:0,foodTrucks:typeof foodTrucks!=="undefined"?foodTrucks:0,lanchonetes:typeof lanchonetes!=="undefined"?lanchonetes:0,franquias:typeof franquias!=="undefined"?franquias:0}[k]));if(v>snap.negocios[nomes[i]])s.comprasNegocios+=v-snap.negocios[nomes[i]];snap.negocios[nomes[i]]=v;});
        const flags=["upgradeClique2x","upgradeClique5x","upgradeFuncionario","upgradeChapa","upgradeGlobal"];
        flags.forEach(k=>{const v=typeof window[k]!=="undefined"?window[k]:(typeof globalThis[k]!=="undefined"?globalThis[k]:false);if(v&&!snap[k])s.comprasUpgrades++;snap[k]=!!v;});
        const T=n(typeof hamburgueresTotais!=="undefined"?hamburgueresTotais:0), manual=s.producaoManual;
        if(T>snap.total){s.producaoAutomatica+=Math.max(0,(T-snap.total)-Math.max(0,s.producaoManual-manual));} snap.total=T;
        const X=n(typeof xp!=="undefined"?xp:0);if(X>snap.xp)s.xpGanho+=X-snap.xp;snap.xp=X;
        const L=n(typeof nivel!=="undefined"?nivel:1);if(L>snap.nivel){s.niveisGanhos+=L-snap.nivel;s.ultimoNivelEm=Date.now();}snap.nivel=L;s.maiorNivel=Math.max(s.maiorNivel,L);
        const R=n(typeof rebirths!=="undefined"?rebirths:0);if(R>snap.rebirth){s.ultimoRebirthEm=Date.now();}s.rebirthsHistorico=Math.max(s.rebirthsHistorico,R);snap.rebirth=R;
        const TK=n(typeof prestigeTokensEarned!=="undefined"?prestigeTokensEarned:0);s.tokensGanhos=Math.max(s.tokensGanhos,TK);snap.tokens=TK;
        const p=n(typeof calcularPPS==="function"?calcularPPS():0),saldo=n(typeof hamburgueres!=="undefined"?hamburgueres:0),m=n(typeof multiplicadorClique!=="undefined"?multiplicadorClique:1),petsNow=pets(),a=ach();
        s.maiorSaldo=Math.max(s.maiorSaldo,saldo);s.maiorPPS=Math.max(s.maiorPPS,p);s.maiorNivel=Math.max(s.maiorNivel,L);s.maiorBonusPrestige=Math.max(s.maiorBonusPrestige,typeof bonusPrestige==="function"?n(bonusPrestige()):1);s.maiorMultiplicadorClique=Math.max(s.maiorMultiplicadorClique,m);s.maiorNegocios=Math.max(s.maiorNegocios,Object.values(snap.negocios).reduce((a,b)=>a+b,0));s.maiorPets=Math.max(s.maiorPets,petsNow);s.maiorConquistas=Math.max(s.maiorConquistas,a);s.tempoSessao++;s.ultimaSessao=Date.now();
    }
    function render(){
        rastrear();const T=n(typeof hamburgueresTotais!=="undefined"?hamburgueresTotais:0),C=n(typeof cliquesTotais!=="undefined"?cliquesTotais:0),bal=n(typeof hamburgueres!=="undefined"?hamburgueres:0),L=n(typeof nivel!=="undefined"?nivel:1),R=n(typeof rebirths!=="undefined"?rebirths:0),TK=n(typeof prestigeTokensEarned!=="undefined"?prestigeTokensEarned:0),p=pets(),a=ach(),run=n(typeof runHamburgueres!=="undefined"?runHamburgueres:0),pps=n(typeof calcularPPS==="function"?calcularPPS():0),b=typeof bonusPrestige==="function"?n(bonusPrestige()):1;
        const N=Object.values(snap.negocios).reduce((a,v)=>a+v,0),auto=s.producaoAutomatica,eff=T?auto/T:0,startClicks=Number(sessionStorage.getItem("bcStatsStartClicks")||C);
        set("saTotal",fmt(T));set("saManual",fmt(s.producaoManual));set("saAuto",fmt(auto));set("saSaldo",fmt(bal));set("saMaiorSaldo",fmt(s.maiorSaldo));set("saMaiorClique",fmt(s.maiorClique));set("saMaiorPPS",fmt(s.maiorPPS));set("saCliques",fmt(C));set("saCliquesSessao",fmt(Math.max(0,C-startClicks)));set("saCPS",fmt(s.maiorCPS));set("saMedia",fmt(C?T/C:0));set("saCPM",fmt(C?C/Math.max(1,(n(typeof tempoJogado!=="undefined"?tempoJogado:1)/60)):0));set("saFunc",fmt(snap.negocios.funcionario));set("saChapas",fmt(snap.negocios.chapa));set("saTrucks",fmt(snap.negocios.foodTruck));set("saLanch",fmt(snap.negocios.lanchonete));set("saFranq",fmt(snap.negocios.franquia));set("saNegocios",fmt(N));set("saCompras",fmt(s.comprasNegocios));set("saNivel",fmt(L));set("saMaiorNivel",fmt(s.maiorNivel));set("saXP",fmt(typeof xp!=="undefined"?xp:0));set("saXPGanho",fmt(s.xpGanho));set("saUpgrades",fmt(s.comprasUpgrades));set("saExp",fmt(exp()));set("saRebirth",fmt(R));set("saTokens",fmt(TK));set("saBonus",b.toFixed(2)+"x");set("saMult",s.maiorMultiplicadorClique.toFixed(2)+"x");set("saUltimoRebirth",s.ultimoRebirthEm?new Date(s.ultimoRebirthEm).toLocaleString("pt-BR"):"—");set("saPets",fmt(p));set("saPetsTotal",typeof PET_CATALOG!=="undefined"?fmt(PET_CATALOG.length):"—");set("saAlimentados",fmt(s.petsAlimentados));set("saAch",fmt(a));set("saTempo",tempo(n(typeof tempoJogado!=="undefined"?tempoJogado:0)));set("saSessao",tempo(s.tempoSessao));set("saSessoes",fmt(s.sessoes));set("saPrimeira",new Date(s.primeiraSessao).toLocaleString("pt-BR"));set("saDias",fmt(Math.max(1,Math.ceil((Date.now()-s.primeiraSessao)/86400000))));set("saEficiencia",(eff*100).toFixed(1)+"%");set("saMaiorNeg",fmt(s.maiorNegocios));set("saRun",fmt(run));set("saUltima",new Date(s.ultimaSessao).toLocaleString("pt-BR"));
        s.ultimaSessao=Date.now();localStorage.setItem(KEY,JSON.stringify(s));
    }
    document.addEventListener("click",e=>{const a=e.target instanceof Element?e.target:null;if(a?.closest("#burgerBtn")){const g=n(typeof calcularPoderClique==="function"?calcularPoderClique():0);s.cliquesManuais++;s.producaoManual+=g;s.maiorClique=Math.max(s.maiorClique,g);}},true);
    try{if(!sessionStorage.getItem("bcStatsStartClicks"))sessionStorage.setItem("bcStatsStartClicks",String(snap.clicks));}catch{}
    ui();render();
    setInterval(()=>{render();},1000);
    setInterval(()=>{s.maiorCPS=Math.max(s.maiorCPS,s.cliquesManuais-snap.clicks);snap.clicks=s.cliquesManuais;localStorage.setItem(KEY,JSON.stringify(s));},1000);
    window.addEventListener("beforeunload",()=>localStorage.setItem(KEY,JSON.stringify(s)));
})();
