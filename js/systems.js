"use strict";

function definirTexto(elemento, valor) {
    if (!elemento) return;
    const texto = String(valor);
    if (elemento.textContent !== texto) elemento.textContent = texto;
}
function definirHTML(elemento, valor) {
    if (!elemento) return;
    const html = String(valor);
    if (elemento.innerHTML !== html) elemento.innerHTML = html;
}

function formatarNumero(numero) {
    if (!Number.isFinite(numero)) return "0";
    const absoluto = Math.abs(numero);
    if (absoluto >= 1e15) return (numero / 1e15).toFixed(2) + "Qa";
    if (absoluto >= 1e12) return (numero / 1e12).toFixed(2) + "T";
    if (absoluto >= 1e9) return (numero / 1e9).toFixed(2) + "B";
    if (absoluto >= 1e6) return (numero / 1e6).toFixed(2) + "M";
    if (absoluto >= 1e3) return (numero / 1e3).toFixed(2) + "K";
    return numero < 100 ? Number(numero.toFixed(1)).toString() : Math.floor(numero).toString();
}

// =====================
// LOJA DE PRESTÍGIO
// =====================
// Todos os níveis abaixo são permanentes e NÃO são apagados pelo Rebirth.
const PRESTIGE_UPGRADES = {
    producao: { nome: "🍳 Cozinha lendária", descricao: "+10% de produção global por nível.", max: 10, custo: 3, crescimento: 1.65 },
    clique: { nome: "👆 Dedos de ouro", descricao: "+15% de força dos cliques por nível.", max: 10, custo: 1, crescimento: 1.6 },
    offline: { nome: "🌙 Turno noturno", descricao: "+15% de produção enquanto você está fora por nível.", max: 5, custo: 5, crescimento: 1.8 },
    limiteOffline: { nome: "⏳ Expediente estendido", descricao: "+2 horas ao limite de produção offline por nível.", max: 6, custo: 6, crescimento: 1.9 },
    descontoNegocios: { nome: "🏷️ Compras em atacado", descricao: "Negócios custam 3% menos por nível.", max: 10, custo: 4, crescimento: 1.7 },
    descontoUpgrades: { nome: "🧾 Cupons especiais", descricao: "Upgrades comuns custam 5% menos por nível.", max: 8, custo: 5, crescimento: 1.75 },
    ganhoRebirth: { nome: "⭐ Renascimento aprimorado", descricao: "+10% de fichas recebidas em cada Rebirth por nível.", max: 10, custo: 8, crescimento: 1.8 },
    pets: { nome: "🐾 Laço extraordinário", descricao: "+5% de força para os efeitos dos pets por nível.", max: 10, custo: 7, crescimento: 1.75 },
    experiencia: { nome: "🧪 Aprendizado acelerado", descricao: "+10% de XP recebida por nível.", max: 10, custo: 4, crescimento: 1.7 },
    inicio: { nome: "🎁 Estoque inicial", descricao: "Comece cada Rebirth com +100 hambúrgueres por nível.", max: 10, custo: 3, crescimento: 1.65 },
    multiplicador: { nome: "💎 Essência dourada", descricao: "+5% à produção e à força dos cliques por nível, além dos bônus específicos.", max: 10, custo: 10, crescimento: 1.9 },
    tokens: { nome: "🪙 Investimento astral", descricao: "+5% de fichas de Rebirth por nível.", max: 10, custo: 12, crescimento: 1.9 }
};

function nivelUpgradePrestigio(chave) {
    return Math.max(0, Math.min(PRESTIGE_UPGRADES[chave]?.max || 0, Math.floor(Number(prestigeUpgrades[chave]) || 0)));
}
function custoUpgradePrestigio(chave) {
    const u = PRESTIGE_UPGRADES[chave];
    if (!u) return Infinity;
    const nivel = nivelUpgradePrestigio(chave);
    return Math.ceil(u.custo * Math.pow(u.crescimento, nivel));
}
function descontoNegocioPrestigio() {
    return Math.max(0.7, 1 - nivelUpgradePrestigio("descontoNegocios") * 0.03);
}
function custoUpgradeNormal(custo) {
    return Math.max(1, Math.ceil(custo * Math.max(0.6, 1 - nivelUpgradePrestigio("descontoUpgrades") * 0.05)));
}

function criarLojaPrestigio() {
    const loja = document.getElementById("prestigeShop");

    // Evita erros caso o contêiner não exista no HTML.
    if (!loja) {
        console.error('Loja de Prestígio: elemento "#prestigeShop" não encontrado.');
        return;
    }

    // Cria os 12 cards a partir do catálogo existente.
    loja.innerHTML = "";

    for (const [chave, u] of Object.entries(PRESTIGE_UPGRADES)) {
        const card = document.createElement("article");
        card.className = "prestige-upgrade-card";

        const titulo = document.createElement("h3");
        titulo.textContent = u.nome;

        const descricao = document.createElement("p");
        descricao.textContent = u.descricao;

        const nivelTexto = document.createElement("p");
        nivelTexto.className = "prestige-upgrade-level";
        nivelTexto.dataset.prestigeUpgradeLevel = chave;

        const botao = document.createElement("button");
        botao.type = "button";
        botao.dataset.prestigeUpgrade = chave;
        botao.addEventListener("click", () => comprarUpgradePrestigio(chave));

        card.append(titulo, descricao, nivelTexto, botao);
        loja.appendChild(card);
    }

    // Atualiza níveis, custos, botões e saldo após criar os cards.
    atualizarLojaPrestigio();
}

function atualizarLojaPrestigio() {
    const saldo = document.getElementById("prestigeShopSaldo");

    if (saldo) {
        saldo.textContent = formatarNumero(prestigeTokens);
    }

    const loja = document.getElementById("prestigeShop");
    if (!loja) return;

    // Atualiza o nível visível de cada melhoria.
    for (const textoNivel of loja.querySelectorAll("[data-prestige-upgrade-level]")) {
        const chave = textoNivel.dataset.prestigeUpgradeLevel;
        const u = PRESTIGE_UPGRADES[chave];

        if (!u) continue;

        const nivel = nivelUpgradePrestigio(chave);
        textoNivel.textContent = `Nível ${nivel}/${u.max}`;
    }

    // Atualiza os botões de compra.
    for (const botao of loja.querySelectorAll("button[data-prestige-upgrade]")) {
        const chave = botao.dataset.prestigeUpgrade;
        const u = PRESTIGE_UPGRADES[chave];

        if (!u) continue;

        const nivel = nivelUpgradePrestigio(chave);
        const maximo = nivel >= u.max;
        const custo = custoUpgradePrestigio(chave);

        botao.disabled = maximo || prestigeTokens < custo;

        if (maximo) {
            botao.textContent = "✅ Nível máximo";
        } else {
            botao.textContent = `Comprar\nCusto: 🪙 ${formatarNumero(custo)}`;
        }

        botao.dataset.tooltipTitle = u.nome;
        botao.dataset.tooltip =
            `${u.descricao} Nível atual: ${nivel}/${u.max}. ` +
            (
                maximo
                    ? "Melhoria maximizada."
                    : "Próximo nível custa " +
                      formatarNumero(custo) +
                      " fichas de prestígio."
            );
    }
}

function comprarUpgradePrestigio(chave) {
    const u = PRESTIGE_UPGRADES[chave];
    if (!u) return;
    const nivel = nivelUpgradePrestigio(chave);
    const custo = custoUpgradePrestigio(chave);
    if (nivel >= u.max || prestigeTokens < custo) return;
    prestigeTokens -= custo;
    prestigeUpgrades[chave] = nivel + 1;
    salvarJogo();
    atualizarTela();
    atualizarLojaPrestigio();
}

function petAtual() {
    return petColecao.find(p => p.id === petAtivoId) || null;
}
function dadosPet(petOrId) {
    const id = typeof petOrId === "string" ? petOrId : petOrId?.id;
    return PET_CATALOG.find(p => p.id === id) || null;
}
function nivelPet(petOrId) {
    const id = typeof petOrId === "string" ? petOrId : petOrId?.id;
    return Math.max(0, Math.floor(Number(petNiveis[id]) || 0));
}
function porcentagemPet(petOrId) {
    const dados = dadosPet(petOrId);
    if (!dados) return 0;
    return dados.base + nivelPet(petOrId) * dados.incremento;
}
function custoAlimentarPet(petOrId) {
    const nivel = nivelPet(petOrId);
    // A cada alimentação o custo dobra; a progressão não tem teto.
    const custo = 1000 * Math.pow(2, nivel);
    return Number.isFinite(custo) ? custo : Number.MAX_VALUE;
}
function textoEfeitoPet(petOrId) {
    const dados = dadosPet(petOrId);
    if (!dados) return "Sem bônus";
    const pct = porcentagemPet(petOrId);
    const descricoes = {
        global: `+${formatarNumero(pct)}% de produção global`,
        rebirth: `+${formatarNumero(pct)}% de ganho de Rebirth`,
        click: `+${formatarNumero(pct)}% de hambúrgueres por clique`,
        offline: `+${formatarNumero(pct)}% de produção offline`,
        xp: `+${formatarNumero(pct)}% de XP recebido`,
        discount: `-${formatarNumero(Math.min(pct, 95))}% no custo de alimentação`
    };
    return descricoes[dados.efeito] || `+${formatarNumero(pct)}% de bônus`;
}
function multiplicadorPet(efeito) {
    const pet = petAtual();
    const dados = pet ? dadosPet(pet) : null;
    if (!dados || dados.efeito !== efeito) return 1;
    return (1 + porcentagemPet(pet) / 100) * (1 + nivelUpgradePrestigio("pets") * 0.05);
}
function descontoAlimentacaoPet() {
    const pet = petAtual();
    const dados = pet ? dadosPet(pet) : null;
    if (!dados || dados.efeito !== "discount") return 1;
    return Math.max(0.05, 1 - Math.min(porcentagemPet(pet), 95) / 100);
}

function calcularPPS() {
    const producaoFuncionario = funcionarios * NEGOCIOS.funcionario.producao * (upgradeFuncionario ? 2 : 1);
    const producaoChapa = chapas * NEGOCIOS.chapa.producao * (upgradeChapa ? 2 : 1);
    const producaoFoodTruck = foodTrucks * NEGOCIOS.foodTruck.producao;
    const producaoLanchonete = lanchonetes * NEGOCIOS.lanchonete.producao;
    const producaoFranquia = franquias * NEGOCIOS.franquia.producao;
    const base = producaoFuncionario + producaoChapa + producaoFoodTruck + producaoLanchonete + producaoFranquia;
    return Math.max(0, base * bonusGlobal * bonusPrestige() *
        (1 + nivelUpgradePrestigio("producao") * 0.10) *
        (1 + nivelUpgradePrestigio("multiplicador") * 0.05) * multiplicadorPet("global"));
}
function calcularPoderClique() {
    const bonusNivel = Math.floor((nivel - 1) / 5);
    return Math.max(1, Math.round(multiplicadorClique * (1 + bonusNivel) * bonusPrestige() *
        (1 + nivelUpgradePrestigio("clique") * 0.15) *
        (1 + nivelUpgradePrestigio("multiplicador") * 0.05) * multiplicadorPet("click")));
}
function ganharXP(valor) {
    xp += valor * multiplicadorPet("xp") * (1 + nivelUpgradePrestigio("experiencia") * 0.10);
    while (xp >= xpProximoNivel) {
        xp -= xpProximoNivel;
        nivel++;
        xpProximoNivel = Math.ceil(xpProximoNivel * 1.25);
        showRandomFloatText("⬆️ Nível " + nivel + "!");
    }
}
function showRandomFloatText(message = "+1 🍔") {
    const text = document.createElement("div");
    text.className = "floatText";
    text.textContent = message;
    const effects = ["fx-dourado", "fx-verde", "fx-vermelho", ""];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    if (effect) text.classList.add(effect);
    const marginX = Math.min(140, window.innerWidth * 0.16);
    const marginY = Math.min(120, window.innerHeight * 0.18);
    text.style.left = (marginX + Math.random() * Math.max(1, window.innerWidth - marginX * 2)) + "px";
    text.style.top = (marginY + Math.random() * Math.max(1, window.innerHeight - marginY * 2)) + "px";
    text.style.setProperty("--float-rotation", (Math.random() * 16 - 8) + "deg");
    text.style.setProperty("--float-size", (0.9 + Math.random() * 0.3).toString());
    document.body.appendChild(text);
    window.setTimeout(() => text.remove(), 1300);
}


/* =========================================================
   SISTEMA DE CONQUISTAS E TOOLTIPS
========================================================= */

// Descrições individuais das conquistas.
// Os requisitos correspondem às condições de desbloqueio
// definidas em verificarConquistas().

const descricoesConquistas = {
    "Primeiro Hambúrguer": {
        titulo: "🏆 Primeiro Hambúrguer",
        descricao:
            "Como desbloquear: produza pelo menos 1 hambúrguer no total.\n\n" +
            "O que faz: registra seu primeiro marco no jogo. " +
            "Não concede bônus extra diretamente."
    },

    "Chapeiro": {
        titulo: "🏆 Chapeiro",
        descricao:
            "Como desbloquear: produza pelo menos 100 hambúrgueres no total.\n\n" +
            "O que faz: registra seu progresso de produção. " +
            "Não concede bônus extra diretamente."
    },

    "Magnata Burger": {
        titulo: "🏆 Magnata Burger",
        descricao:
            "Como desbloquear: produza pelo menos 10.000 hambúrgueres no total.\n\n" +
            "O que faz: registra esse marco de produção. " +
            "Não concede bônus extra diretamente."
    },

    "Milionário do Hambúrguer": {
        titulo: "🏆 Milionário do Hambúrguer",
        descricao:
            "Como desbloquear: produza pelo menos 1.000.000 de hambúrgueres no total.\n\n" +
            "O que faz: registra sua marca de produção milionária. " +
            "Não concede bônus extra diretamente."
    },

    "Dedo de Ouro": {
        titulo: "🏆 Dedo de Ouro",
        descricao:
            "Como desbloquear: alcance pelo menos 100 cliques totais.\n\n" +
            "O que faz: registra seu marco de cliques. " +
            "Não concede bônus extra diretamente."
    },

    "Mestre do Clique": {
        titulo: "🏆 Mestre do Clique",
        descricao:
            "Como desbloquear: alcance pelo menos 1.000 cliques totais.\n\n" +
            "O que faz: registra sua dedicação aos cliques. " +
            "Não concede bônus extra diretamente."
    },

    "Chefe de Equipe": {
        titulo: "🏆 Chefe de Equipe",
        descricao:
            "Como desbloquear: tenha pelo menos 10 funcionários.\n\n" +
            "O que faz: registra o tamanho da sua equipe. " +
            "Os funcionários ajudam na produção automática, " +
            "mas a conquista não adiciona um bônus próprio."
    },

    "Mestre da Chapa": {
        titulo: "🏆 Mestre da Chapa",
        descricao:
            "Como desbloquear: tenha pelo menos 10 chapas industriais.\n\n" +
            "O que faz: registra sua expansão de produção. " +
            "A conquista não adiciona um bônus próprio."
    },

    "Primeiro Food Truck": {
        titulo: "🏆 Primeiro Food Truck",
        descricao:
            "Como desbloquear: adquira pelo menos 1 Food Truck.\n\n" +
            "O que faz: registra sua primeira expansão móvel. " +
            "Não concede bônus extra diretamente."
    },

    "Dono de Lanchonete": {
        titulo: "🏆 Dono de Lanchonete",
        descricao:
            "Como desbloquear: adquira pelo menos 1 lanchonete.\n\n" +
            "O que faz: registra a aquisição do seu estabelecimento. " +
            "Não concede bônus extra diretamente."
    },

    "Empresário Global": {
        titulo: "🏆 Empresário Global",
        descricao:
            "Como desbloquear: adquira pelo menos 1 franquia.\n\n" +
            "O que faz: registra seu marco empresarial. " +
            "Não concede bônus extra diretamente."
    },

    "Recomeço": {
        titulo: "🏆 Recomeço",
        descricao:
            "Como desbloquear: realize pelo menos 1 Rebirth.\n\n" +
            "O que faz: registra seu primeiro renascimento. " +
            "O Rebirth possui seus próprios benefícios, " +
            "mas esta conquista não adiciona um bônus extra."
    },

    "Magnata Renascido": {
        titulo: "🏆 Magnata Renascido",
        descricao:
            "Como desbloquear: realize pelo menos 5 Rebirths.\n\n" +
            "O que faz: registra seu progresso em renascimentos. " +
            "Não concede bônus extra diretamente."
    },

    "Melhor Amigo": {
        titulo: "🏆 Melhor Amigo",
        descricao:
            "Como desbloquear: obtenha pelo menos 1 pet.\n\n" +
            "O que faz: registra sua primeira aquisição de pet. " +
            "Os pets podem oferecer seus próprios bônus, " +
            "mas esta conquista não adiciona um bônus extra."
    },

    "Colecionador de Pets": {
        titulo: "🏆 Colecionador de Pets",
        descricao:
            "Como desbloquear: tenha pelo menos 10 pets na coleção.\n\n" +
            "O que faz: registra seu progresso como colecionador. " +
            "Não concede bônus extra diretamente."
    },

    "Arca do Burger": {
        titulo: "🏆 Arca do Burger",
        descricao:
            "Como desbloquear: obtenha todos os pets disponíveis no catálogo.\n\n" +
            "O que faz: registra a conclusão da coleção de pets. " +
            "Não concede bônus extra diretamente."
    }
};


/* Aplica os dados da tooltip em um elemento de conquista. */

function prepararTooltipConquista(elemento, nome) {
    if (!elemento) return;

    const dados = descricoesConquistas[nome];

    elemento.classList.add("conquista");

    if (dados) {
        elemento.dataset.tooltipTitle = dados.titulo;
        elemento.dataset.tooltip = dados.descricao;
    } else {
        elemento.dataset.tooltipTitle = "🏆 " + nome;
        elemento.dataset.tooltip =
            "Conquista desbloqueada: " + nome + ".\n\n" +
            "Este marco registra seu progresso no jogo. " +
            "Não há bônus adicional configurado para esta conquista.";
    }

    // Marca a origem dos dados para integração com tooltip.js.
    // O tooltip.js reconhecerá estes atributos como personalizados.
    delete elemento.dataset.tooltipAuto;
}


/* Desbloqueia uma conquista nova. */

function desbloquearConquista(nome) {
    if (conquistas.includes(nome)) return;

    conquistas.push(nome);

    localStorage.setItem(
        "conquistas",
        JSON.stringify(conquistas)
    );

    const elemento = document.createElement("div");

    elemento.className = "conquista";
    elemento.textContent = "🏆 " + nome;

    prepararTooltipConquista(elemento, nome);

    listaConquistas.appendChild(elemento);

    showRandomFloatText("🏆 Conquista desbloqueada!");
}


/* Renderiza as conquistas já desbloqueadas e salvas. */

function renderizarConquistas() {
    listaConquistas.innerHTML = "";

    for (const nome of conquistas) {
        const elemento = document.createElement("div");

        elemento.className = "conquista";
        elemento.textContent = "🏆 " + nome;

        prepararTooltipConquista(elemento, nome);

        listaConquistas.appendChild(elemento);
    }
}


/* Verifica os requisitos para desbloquear conquistas. */

function verificarConquistas() {
    const marcos = [
        [hamburgueresTotais >= 1, "Primeiro Hambúrguer"],
        [hamburgueresTotais >= 100, "Chapeiro"],
        [hamburgueresTotais >= 10000, "Magnata Burger"],
        [hamburgueresTotais >= 1000000, "Milionário do Hambúrguer"],

        [cliquesTotais >= 100, "Dedo de Ouro"],
        [cliquesTotais >= 1000, "Mestre do Clique"],

        [funcionarios >= 10, "Chefe de Equipe"],
        [chapas >= 10, "Mestre da Chapa"],

        [foodTrucks >= 1, "Primeiro Food Truck"],
        [lanchonetes >= 1, "Dono de Lanchonete"],
        [franquias >= 1, "Empresário Global"],

        [rebirths >= 1, "Recomeço"],
        [rebirths >= 5, "Magnata Renascido"],

        [petColecao.length >= 1, "Melhor Amigo"],
        [petColecao.length >= 10, "Colecionador de Pets"],
        [
            petColecao.length >= PET_CATALOG.length,
            "Arca do Burger"
        ]
    ];

    for (const [condicao, nome] of marcos) {
        if (condicao) {
            desbloquearConquista(nome);
        }
    }
}


function calcularGanhoPrestige() {
    const base = Math.max(1, Math.floor(Math.sqrt(runHamburgueres / 1_000_000)));
    const bonusTokens = 1 + nivelUpgradePrestigio("tokens") * 0.05;
    const bonusRebirth = 1 + nivelUpgradePrestigio("ganhoRebirth") * 0.10;
    return Math.max(1, Math.floor(base * multiplicadorPet("rebirth") * bonusTokens * bonusRebirth));
}

function iniciarOffline() {
    const agora = Date.now();
    const limiteOffline = CONFIG.limiteOfflineSegundos + nivelUpgradePrestigio("limiteOffline") * 2 * 60 * 60;
    const segundosOffline = Math.max(0, Math.min(limiteOffline, Math.floor((agora - ultimoSave) / 1000)));
    const ganhoOffline = Math.max(0, Math.round(calcularPPS() * segundosOffline *
        multiplicadorPet("offline") * (1 + nivelUpgradePrestigio("offline") * 0.15)));
    if (segundosOffline > 5 && ganhoOffline > 0) {
        hamburgueres += ganhoOffline;
        hamburgueresTotais += ganhoOffline;
        runHamburgueres += ganhoOffline;
        alert("Enquanto você estava fora, produziu " + formatarNumero(ganhoOffline) +
            " hambúrgueres!\n\nTempo contabilizado: " + Math.floor(segundosOffline / 60) + " minutos.");
    }
    ultimoSave = agora;
}

// =====================
// SISTEMA DE PETS
// =====================

function salvarEstadoPets() {
    localStorage.setItem("petColecao", JSON.stringify(petColecao));
    localStorage.setItem("petAtivoId", petAtivoId);
    localStorage.setItem("petNomes", JSON.stringify(petNomes));
    localStorage.setItem("petNiveis", JSON.stringify(petNiveis));
    localStorage.setItem("prestigeUpgrades", JSON.stringify(prestigeUpgrades));
    localStorage.setItem("prestigeTokensEarned", String(prestigeTokensEarned));
}
function nomePet(pet) {
    const nome = String(petNomes[pet.id] ?? "").trim();
    return nome || pet.nome;
}
function descobrirPetAleatorio() {
    const idsPossuidos = new Set(petColecao.map(p => p.id));
    const disponiveis = PET_CATALOG.filter(p => !idsPossuidos.has(p.id));
    if (disponiveis.length === 0) return null;
    const novo = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    petColecao.push({ id: novo.id });
    petAtivoId = novo.id;
    if (!(novo.id in petNiveis)) petNiveis[novo.id] = 0;
    salvarEstadoPets();
    renderizarPets();
    return novo;
}
function renderizarPets() {
    const ativo = petAtual();
    definirTexto(petAtivoEmoji, ativo ? dadosPet(ativo).emoji : "🐾");
    definirTexto(petAtivoNome, ativo ? `${nomePet(dadosPet(ativo))} (${dadosPet(ativo).nome})` : "Nenhum pet equipado");
    definirTexto(petAtivoBonus, ativo ? textoEfeitoPet(ativo) : "Faça Rebirth para tentar encontrar seu primeiro pet!");
    petSelecionar.innerHTML = "";
    if (!petColecao.length) {
        const opcao = document.createElement("option");
        opcao.value = "";
        opcao.textContent = "Nenhum pet disponível";
        petSelecionar.appendChild(opcao);
    } else {
        for (const pet of petColecao) {
            const dados = dadosPet(pet);
            const opcao = document.createElement("option");
            opcao.value = pet.id;
            opcao.textContent = `${dados.emoji} ${nomePet(dados)} — ${textoEfeitoPet(pet)}`;
            petSelecionar.appendChild(opcao);
        }
        petSelecionar.value = petAtivoId;
    }
    // Nunca sobrescreva o texto enquanto a pessoa está digitando.
    if (document.activeElement !== petNomeInput) {
        const valorNome = ativo ? String(petNomes[ativo.id] ?? "") : "";
        if (petNomeInput.value !== valorNome) petNomeInput.value = valorNome;
    }
    petNomeInput.disabled = !ativo;
    petSalvarNomeBtn.disabled = !ativo;
    petSelecionar.disabled = !petColecao.length;
    petEquiparBtn.disabled = !petColecao.length || petSelecionar.value === petAtivoId;
    definirTexto(petQuantidadeTexto, `${petColecao.length}/${PET_CATALOG.length}`);
    petColecaoElemento.innerHTML = "";
    for (const pet of petColecao) {
        const dados = dadosPet(pet);
        const card = document.createElement("article");
        card.className = "pet-card" + (pet.id === petAtivoId ? " pet-equipado" : "");
        const emoji = document.createElement("div");
        emoji.className = "pet-card-emoji";
        emoji.textContent = dados.emoji;
        const nome = document.createElement("h4");
        nome.textContent = nomePet(dados);
        const original = document.createElement("p");
        original.textContent = dados.nome;
        const bonus = document.createElement("p");
        bonus.textContent = textoEfeitoPet(pet);
        const nivel = document.createElement("p");
        nivel.textContent = `Alimentações: ${nivelPet(pet)}`;
        const equipar = document.createElement("button");
        equipar.type = "button";
        equipar.textContent = pet.id === petAtivoId ? "✅ Equipado" : "🎒 Equipar";
        equipar.disabled = pet.id === petAtivoId;
        equipar.addEventListener("click", () => equiparPet(pet.id));
        card.append(emoji, nome, original, bonus, nivel, equipar);
        petColecaoElemento.appendChild(card);
    }
    if (ativo) {
        const nivel = nivelPet(ativo);
        const custoBase = custoAlimentarPet(ativo);
        const custoReal = Math.max(1, Math.ceil(custoBase * descontoAlimentacaoPet()));
        definirTexto(petNivelTexto, `Alimentações: ${nivel}`);
        definirTexto(petRecompensaTexto, `Recompensa atual: ${textoEfeitoPet(ativo)}`);
        definirTexto(petCustoTexto, `Próxima alimentação: ${formatarNumero(custoReal)} 🍔`);
        petAlimentarBtn.disabled = hamburgueres < custoReal;
        definirTexto(petAlimentarBtn, `🍔 Alimentar (${formatarNumero(custoReal)} 🍔)`);
    } else {
        definirTexto(petNivelTexto, "Alimentações: —");
        definirTexto(petRecompensaTexto, "Recompensa: —");
        definirTexto(petCustoTexto, "Obtenha um pet por Rebirth para alimentá-lo.");
        petAlimentarBtn.disabled = true;
        definirTexto(petAlimentarBtn, "🍔 Alimentar e evoluir");
    }
}

function atualizarEstadoBotoesPet() {
    const ativo = petAtual();
    if (!ativo) {
        petAlimentarBtn.disabled = true;
        petEquiparBtn.disabled = !petColecao.length || !petSelecionar.value || petSelecionar.value === petAtivoId;
        return;
    }
    const custoReal = Math.max(1, Math.ceil(custoAlimentarPet(ativo) * descontoAlimentacaoPet()));
    petAlimentarBtn.disabled = hamburgueres < custoReal;
    petEquiparBtn.disabled = !petColecao.length || !petSelecionar.value || petSelecionar.value === petAtivoId;
}

function equiparPet(id) {
    if (!petColecao.some(p => p.id === id)) return;
    petAtivoId = id;
    salvarEstadoPets();
    renderizarPets();
    atualizarTela();
}
function salvarNomePet() {
    const pet = petAtual();
    if (!pet) return;
    // Qualquer texto permitido; somente remove espaços externos.
    petNomes[pet.id] = petNomeInput.value.trim();
    salvarEstadoPets();
    renderizarPets();
    showRandomFloatText("✏️ Nome do pet salvo!");
}
function alimentarPet() {
    const pet = petAtual();
    if (!pet) return;
    const custo = Math.max(1, Math.ceil(custoAlimentarPet(pet) * descontoAlimentacaoPet()));
    if (hamburgueres < custo) return;
    hamburgueres -= custo;
    petNiveis[pet.id] = nivelPet(pet) + 1;
    salvarEstadoPets();
    renderizarPets();
    showRandomFloatText("❤️ " + nomePet(dadosPet(pet)) + " evoluiu!");
    atualizarTela();
}
petSalvarNomeBtn.addEventListener("click", salvarNomePet);
petEquiparBtn.addEventListener("click", () => equiparPet(petSelecionar.value));
petSelecionar.addEventListener("change", () => {
    petEquiparBtn.disabled = !petSelecionar.value || petSelecionar.value === petAtivoId;
});
petAlimentarBtn.addEventListener("click", alimentarPet);
