"use strict";

const CONFIG = {
    versao: 4,
    crescimentoCusto: 1.15,
    limiteOfflineSegundos: 8 * 60 * 60,
    custoInicialRebirth: 1_000_000,
    multiplicadorRebirth: 1.5,
    bonusPorToken: 0.05
};

function carregarNumero(chave, padrao = 0) {
    const salvo = localStorage.getItem(chave);
    // Number(null) vira 0; verificar a ausência antes evita ignorar padrões
    // importantes, especialmente ultimoSave no primeiro acesso ao jogo.
    if (salvo === null || salvo.trim() === "") return padrao;
    const valor = Number(salvo);
    return Number.isFinite(valor) ? valor : padrao;
}
function carregarBooleano(chave) {
    return localStorage.getItem(chave) === "true";
}
function carregarArray(chave) {
    try {
        const valor = JSON.parse(localStorage.getItem(chave) || "[]");
        return Array.isArray(valor) ? valor : [];
    } catch { return []; }
}
function carregarObjeto(chave, padrao = {}) {
    try {
        const valor = JSON.parse(localStorage.getItem(chave) || "null");
        return valor && typeof valor === "object" && !Array.isArray(valor) ? valor : padrao;
    } catch { return padrao; }
}

let hamburgueres = Math.max(0, Math.round(carregarNumero("hamburgueres")));
let hamburgueresTotais = Math.max(0, Math.round(carregarNumero("hamburgueresTotais")));
let runHamburgueres = Math.max(0, Math.round(carregarNumero("runHamburgueres", hamburgueres)));
let cliquesTotais = Math.max(0, Math.floor(carregarNumero("cliquesTotais")));
let tempoJogado = Math.max(0, Math.floor(carregarNumero("tempoJogado")));
let ultimoSave = carregarNumero("ultimoSave", Date.now());

let funcionarios = Math.max(0, Math.floor(carregarNumero("funcionarios")));
let chapas = Math.max(0, Math.floor(carregarNumero("chapas")));
let foodTrucks = Math.max(0, Math.floor(carregarNumero("foodTrucks")));
let lanchonetes = Math.max(0, Math.floor(carregarNumero("lanchonetes")));
let franquias = Math.max(0, Math.floor(carregarNumero("franquias")));

const NEGOCIOS = {
    funcionario: { nome: "Funcionário", emoji: "👨‍🍳", custoBase: 15, producao: 0.1 },
    chapa: { nome: "Chapa Industrial", emoji: "🔥", custoBase: 100, producao: 1 },
    foodTruck: { nome: "Food Truck", emoji: "🚚", custoBase: 1100, producao: 8 },
    lanchonete: { nome: "Lanchonete", emoji: "🍔", custoBase: 12000, producao: 47 },
    franquia: { nome: "Franquia", emoji: "🌎", custoBase: 130000, producao: 260 }
};

function calcularCustoNegocio(tipo) {
    const dados = NEGOCIOS[tipo];
    if (!dados) return Infinity;
    const quantidade = {
        funcionario: funcionarios, chapa: chapas, foodTruck: foodTrucks,
        lanchonete: lanchonetes, franquia: franquias
    }[tipo];
    const desconto = typeof descontoNegocioPrestigio === "function" ? descontoNegocioPrestigio() : 1;
    return Math.max(1, Math.ceil(dados.custoBase * Math.pow(CONFIG.crescimentoCusto, quantidade) * desconto));
}

let custoFuncionario = calcularCustoNegocio("funcionario");
let custoChapa = calcularCustoNegocio("chapa");
let custoFoodTruck = calcularCustoNegocio("foodTruck");
let custoLanchonete = calcularCustoNegocio("lanchonete");
let custoFranquia = calcularCustoNegocio("franquia");

let xp = Math.max(0, carregarNumero("xp"));
let nivel = Math.max(1, Math.floor(carregarNumero("nivel", 1)));
let xpProximoNivel = Math.max(100, carregarNumero("xpProximoNivel", 100));

let prestigeTokens = Math.max(0, Math.floor(carregarNumero("prestigeTokens")));
let prestigeTokensEarned = Math.max(prestigeTokens, Math.floor(carregarNumero("prestigeTokensEarned", prestigeTokens)));
let prestigeUpgrades = carregarObjeto("prestigeUpgrades", {});
let rebirths = Math.max(0, Math.floor(carregarNumero("rebirths")));
let requisitoRebirth = Math.max(CONFIG.custoInicialRebirth, carregarNumero("requisitoRebirth", CONFIG.custoInicialRebirth));
function calcularRequisitoRebirth() {
    return Math.ceil(CONFIG.custoInicialRebirth * Math.pow(CONFIG.multiplicadorRebirth, rebirths));
}
let bonusGlobal = Math.max(1, carregarNumero("bonusGlobal", 1));
function bonusPrestige() {
    // O bônus é baseado no total conquistado, não no saldo disponível.
    // Gastar fichas na loja nunca reduz o poder permanente do jogador.
    return 1 + prestigeTokensEarned * CONFIG.bonusPorToken;
}

let multiplicadorClique = Math.max(1, carregarNumero("multiplicadorClique", 1));
let upgradeClique2x = carregarBooleano("upgradeClique2x");
let upgradeClique5x = carregarBooleano("upgradeClique5x");
let upgradeFuncionario = carregarBooleano("upgradeFuncionario");
let upgradeChapa = carregarBooleano("upgradeChapa");
let upgradeGlobal = carregarBooleano("upgradeGlobal");

const UPGRADES = {
    clique2x: { nome: "🖱️ Clique Duplo", custo: 500, descricao: "Dobra o poder do clique." },
    clique5x: { nome: "🖱️ Clique Mestre", custo: 5000, descricao: "Multiplica o poder do clique por 5." },
    funcionario: { nome: "👨‍🍳 Funcionários Motivados", custo: 2500, descricao: "Dobra a produção dos funcionários." },
    chapa: { nome: "🔥 Chapas Turbo", custo: 15000, descricao: "Dobra a produção das chapas." },
    global: { nome: "📺 Marketing Global", custo: 50000, descricao: "Multiplica a produção global por 1,5." }
};

let conquistas = carregarArray("conquistas");

// Pets são identificados por ID estável; os nomes personalizados ficam salvos por pet.
const PET_CATALOG = [
    ["porco","🐷","Porco","rebirth",15,5],["vaca","🐮","Vaca","global",12,4],
    ["caranguejo","🦀","Caranguejo","click",10,3],["papagaio","🦜","Papagaio","global",15,5],
    ["cachorro","🐶","Cachorro","click",10,3],["gato","🐱","Gato","global",10,3],
    ["rato","🐭","Rato","discount",8,2],["hamster","🐹","Hamster","xp",10,3],
    ["coelho","🐰","Coelho","offline",10,3],["raposa","🦊","Raposa","click",12,4],
    ["urso","🐻","Urso","global",14,4],["panda","🐼","Panda","offline",12,4],
    ["coala","🐨","Coala","xp",12,4],["tigre","🐯","Tigre","click",15,5],
    ["leao","🦁","Leão","rebirth",12,4],["vaca-malhada","🐄","Vaca malhada","global",13,4],
    ["porco-focinho","🐽","Focinho de porco","rebirth",10,3],["sapo","🐸","Sapo","xp",10,3],
    ["macaco","🐵","Macaco","click",12,4],["gorila","🦍","Gorila","global",15,5],
    ["orangotango","🦧","Orangotango","offline",14,4],["galinha","🐔","Galinha","global",10,3],
    ["pinguim","🐧","Pinguim","offline",12,4],["pintinho","🐤","Pintinho","xp",8,2],
    ["pato","🦆","Pato","discount",10,3],["aguia","🦅","Águia","click",15,5],
    ["coruja","🦉","Coruja","offline",12,4],["morcego","🦇","Morcego","offline",12,4],
    ["lobo","🐺","Lobo","rebirth",15,5],["javali","🐗","Javali","rebirth",14,4],
    ["cavalo","🐴","Cavalo","global",12,4],["unicórnio","🦄","Unicórnio","xp",18,6],
    ["abelha","🐝","Abelha","global",10,3],["lagarta","🐛","Lagarta","xp",8,2],
    ["borboleta","🦋","Borboleta","global",10,3],["caracol","🐌","Caracol","offline",8,2],
    ["besouro","🐞","Joaninha","discount",8,2],["formiga","🐜","Formiga","discount",10,3],
    ["aranha","🕷️","Aranha","click",12,4],["escorpiao","🦂","Escorpião","rebirth",14,4],
    ["tartaruga","🐢","Tartaruga","offline",12,4],["cobra","🐍","Cobra","click",13,4],
    ["lagarto","🦎","Lagarto","xp",10,3],["dinossauro","🦖","T-Rex","global",18,6],
    ["dino","🦕","Dinossauro","offline",16,5],["polvo","🐙","Polvo","global",14,4],
    ["lula","🦑","Lula","click",12,4],["camarao","🦐","Camarão","discount",10,3],
    ["lagosta","🦞","Lagosta","rebirth",15,5],["baleia","🐳","Baleia","global",18,6],
    ["baleia-azul","🐋","Baleia","global",18,6],["golfinho","🐬","Golfinho","click",14,4],
    ["peixe","🐟","Peixe","offline",10,3],["peixe-tropical","🐠","Peixe tropical","global",12,4],
    ["baiacu","🐡","Baiacu","rebirth",12,4],["tubarao","🦈","Tubarão","rebirth",16,5],
    ["foca","🦭","Foca","offline",12,4],["crocodilo","🐊","Crocodilo","rebirth",15,5],
    ["elefante","🐘","Elefante","global",18,6],["mamute","🦣","Mamute","global",18,6],
    ["rinoceronte","🦏","Rinoceronte","rebirth",16,5],["hipopotamo","🦛","Hipopótamo","global",16,5],
    ["girafa","🦒","Girafa","offline",12,4],["zebra","🦓","Zebra","click",12,4],
["camelo","🐪","Camelo","offline",12,4],
    ["dromedario","🐫","Dromedário","offline",12,4],["lhama","🦙","Lhama","xp",12,4],
    ["bode","🐐","Bode","rebirth",12,4],["ovelha","🐑","Ovelha","global",10,3],
    ["carneiro","🐏","Carneiro","rebirth",12,4],["veado","🦌","Veado","click",12,4],
    ["bisao","🦬","Bisão","global",15,5],["rato-campo","🐀","Rato","discount",8,2],
    ["esquilo","🐿️","Esquilo","discount",10,3],["castor","🦫","Castor","offline",12,4],
    ["lontra","🦦","Lontra","global",12,4],["guaxinim","🦝","Guaxinim","discount",12,4],
    ["doninha","🦨","Cangambá","discount",10,3],["texugo","🦡","Texugo","rebirth",12,4],
    ["cisne","🦢","Cisne","global",12,4],["flamingo","🦩","Flamingo","global",12,4],
    ["pavao","🦚","Pavão","xp",14,4],["papagaio2","🦜","Papagaio","global",15,5],
    ["dodo","🦤","Dodô","rebirth",15,5],["penas","🪶","Pena misteriosa","xp",8,2],
    ["asa","🪽","Asa mágica","click",15,5],["medusa","🪼","Água-viva","offline",12,4]
].map(([id, emoji, nome, efeito, base, incremento]) => ({ id, emoji, nome, efeito, base, incremento }));

let petColecao = carregarArray("petColecao").filter(p => p && typeof p.id === "string" && PET_CATALOG.some(c => c.id === p.id));
let petAtivoId = localStorage.getItem("petAtivoId") || "";
let petNomes = carregarObjeto("petNomes", {});
let petNiveis = carregarObjeto("petNiveis", {});
if (!petColecao.some(p => p.id === petAtivoId)) petAtivoId = petColecao[0]?.id || "";

const contador = document.getElementById("contador");
const pps = document.getElementById("pps");
const burgerBtn = document.getElementById("burgerBtn");
const listaConquistas = document.getElementById("listaConquistas");
const prestigeTokensTexto = document.getElementById("prestigeTokens");
const prestigeTokensEarnedTexto = document.getElementById("prestigeTokensEarned");
const prestigeBonusTexto = document.getElementById("prestigeBonus");
const rebirthBtn = document.getElementById("rebirthBtn");
const requisitoRebirthTexto = document.getElementById("requisitoRebirth");
const funcionarioBtn = document.getElementById("funcionarioBtn");
const chapaBtn = document.getElementById("chapaBtn");
const foodTruckBtn = document.getElementById("foodTruckBtn");
const lanchoneteBtn = document.getElementById("lanchoneteBtn");
const franquiaBtn = document.getElementById("franquiaBtn");
const funcionarioCusto = document.getElementById("funcionarioCusto");
const chapaCusto = document.getElementById("chapaCusto");
const foodTruckCusto = document.getElementById("foodTruckCusto");
const lanchoneteCusto = document.getElementById("lanchoneteCusto");
const franquiaCusto = document.getElementById("franquiaCusto");
const upgradeClique2xBtn = document.getElementById("upgradeClique2xBtn");
const upgradeClique5xBtn = document.getElementById("upgradeClique5xBtn");
const upgradeFuncionarioBtn = document.getElementById("upgradeFuncionarioBtn");
const upgradeChapaBtn = document.getElementById("upgradeChapaBtn");
const upgradeGlobalBtn = document.getElementById("upgradeGlobalBtn");
const nivelTexto = document.getElementById("nivel");
const xpTexto = document.getElementById("xp");
const estatTotal = document.getElementById("estatTotal");
const estatCliques = document.getElementById("estatCliques");
const estatTempo = document.getElementById("estatTempo");
const estatRebirth = document.getElementById("estatRebirth");
const funcionariosQtd = document.getElementById("funcionariosQtd");
const chapasQtd = document.getElementById("chapasQtd");
const foodTruckQtd = document.getElementById("foodTruckQtd");
const lanchoneteQtd = document.getElementById("lanchoneteQtd");
const franquiaQtd = document.getElementById("franquiaQtd");

// Pet UI
const petAtivoEmoji = document.getElementById("petAtivoEmoji");
const petAtivoNome = document.getElementById("petAtivoNome");
const petAtivoBonus = document.getElementById("petAtivoBonus");
const petNomeInput = document.getElementById("petNomeInput");
const petSalvarNomeBtn = document.getElementById("petSalvarNomeBtn");
const petSelecionar = document.getElementById("petSelecionar");
const petEquiparBtn = document.getElementById("petEquiparBtn");
const petNivelTexto = document.getElementById("petNivel");
const petRecompensaTexto = document.getElementById("petRecompensa");
const petCustoTexto = document.getElementById("petCusto");
const petAlimentarBtn = document.getElementById("petAlimentarBtn");
const petColecaoElemento = document.getElementById("petColecao");
const petQuantidadeTexto = document.getElementById("petQuantidade");
