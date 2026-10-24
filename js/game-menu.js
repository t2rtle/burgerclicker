(() => {
"use strict";
if (window.BurgerClickerGameMenu) return;

const SAVE_KEY = "bc_game_menu_v1";
const DAY_KEY = "day";
const $ = id => document.getElementById(id);

const I18N = {
  "pt-BR": {
    menu:"🎮 Menu de Jogo", config:"⚙️ Configurações", title:"🎮 Menu de Jogo", subtitle:"Missões, desafios e sua evolução como mestre da cozinha.", close:"✖️", missions:"📜 Missões do dia", stars:"Estrelas de Chef", rank:"Patente", streak:"Sequência", rankName:["Novato","Cozinheiro","Chef","Mestre da Chapa","Lenda do Burger"], rankText:"Complete missões para ganhar Estrelas de Chef. A cada patente, você recebe uma recompensa permanente!", reward:"🎁 Recompensa", claim:"Resgatar", claimed:"✅ Resgatada", progress:"Progresso", locked:"Complete a missão para liberar a recompensa.", rewardStars:"+{n} Estrela(s)", bonus:"+{n}% de bônus permanente de produção", streakBonus:"Sequência atual: {n} dia(s)", mission1:"Grande produção", mission1d:"Produza {n} hambúrgueres no total.", mission2:"Mãos rápidas", mission2d:"Faça {n} cliques no total.", mission3:"Expansão", mission3d:"Tenha {n} funcionários contratados.", refresh:"As missões renovam todos os dias.",
  },
  "pt-PT": {
    menu:"🎮 Menu de Jogo", config:"⚙️ Definições", title:"🎮 Menu de Jogo", subtitle:"Missões, desafios e a tua evolução como mestre da cozinha.", close:"✖️", missions:"📜 Missões do dia", stars:"Estrelas de Chef", rank:"Patente", streak:"Sequência", rankName:["Novato","Cozinheiro","Chef","Mestre da Chapa","Lenda do Burger"], rankText:"Completa missões para ganhar Estrelas de Chef. A cada patente, recebes uma recompensa permanente!", reward:"🎁 Recompensa", claim:"Resgatar", claimed:"✅ Resgatada", progress:"Progresso", locked:"Completa a missão para libertar a recompensa.", rewardStars:"+{n} Estrela(s)", bonus:"+{n}% de bónus permanente de produção", streakBonus:"Sequência atual: {n} dia(s)", mission1:"Grande produção", mission1d:"Produz {n} hambúrgueres no total.", mission2:"Mãos rápidas", mission2d:"Faz {n} cliques no total.", mission3:"Expansão", mission3d:"Tem {n} funcionários contratados.", refresh:"As missões renovam todos os dias."
  },
  "en-US": {
    menu:"🎮 Game Menu", config:"⚙️ Settings", title:"🎮 Game Menu", subtitle:"Missions, challenges, and your progress as a kitchen master.", close:"✖️", missions:"📜 Daily Missions", stars:"Chef Stars", rank:"Rank", streak:"Streak", rankName:["Rookie","Cook","Chef","Grill Master","Burger Legend"], rankText:"Complete missions to earn Chef Stars. Each new rank grants a permanent reward!", reward:"🎁 Reward", claim:"Claim", claimed:"✅ Claimed", progress:"Progress", locked:"Complete the mission to unlock the reward.", rewardStars:"+{n} Star(s)", bonus:"+{n}% permanent production bonus", streakBonus:"Current streak: {n} day(s)", mission1:"Big Production", mission1d:"Produce {n} burgers in total.", mission2:"Quick Hands", mission2d:"Make {n} clicks in total.", mission3:"Expansion", mission3d:"Hire {n} employees.", refresh:"Missions refresh every day."
  }
};

function lang() { return I18N[$("languageSelector")?.value] || I18N["pt-BR"]; }
function today() { return new Date().toISOString().slice(0,10); }
function load() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null") || {}; } catch { return {}; }
}
function save(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }
function readNum(key) { const n = Number(localStorage.getItem(key) || 0); return Number.isFinite(n) ? n : 0; }

function normalizeState() {
  const s = load();
  if (s.day !== today()) {
    s.day = today();
    s.claimed = [];
    s.dayStarted = { burgers: readNum("hamburgueresTotais") || readNum("hamburgueres"), clicks: readNum("cliquesTotais"), employees: readNum("funcionarios") };
    s.missions = null;
    if (s.lastDay && new Date(s.lastDay + "T00:00:00").getTime() === new Date(Date.now() - 86400000).setHours(0,0,0,0)) s.streak = (s.streak || 0) + 1;
    else if (!s.lastDay) s.streak = 1;
    else s.streak = 1;
    s.lastDay = s.day;
  }
  s.stars = Math.max(0, Number(s.stars) || 0);
  s.streak = Math.max(1, Number(s.streak) || 1);
  s.claimed ||= [];
  s.dayStarted ||= { burgers:0, clicks:0, employees:0 };
  if (!s.missions) {
    const seed = Number(s.day.replaceAll("-","")) % 3;
    const burgerGoals = [5000,25000,100000];
    const clickGoals = [100,250,500];
    const employeeGoals = [3,7,15];
    s.missions = [
      { id:"production", type:"burgers", goal:burgerGoals[seed], reward:3 },
      { id:"clicks", type:"clicks", goal:clickGoals[(seed+1)%3], reward:2 },
      { id:"employees", type:"employees", goal:employeeGoals[(seed+2)%3], reward:2 }
    ];
  }
  save(s);
  return s;
}

function currentValue(m, s) {
  const total = m.type === "burgers" ? (readNum("hamburgueresTotais") || readNum("hamburgueres")) : m.type === "clicks" ? readNum("cliquesTotais") : readNum("funcionarios");
  const start = m.type === "burgers" ? (s.dayStarted.burgers || 0) : m.type === "clicks" ? (s.dayStarted.clicks || 0) : (s.dayStarted.employees || 0);
  return Math.max(0, total - start);
}

function rankInfo(stars) {
  if (stars >= 50) return { rank:4, bonus:10 };
  if (stars >= 25) return { rank:3, bonus:6 };
  if (stars >= 10) return { rank:2, bonus:3 };
  if (stars >= 5) return { rank:1, bonus:1 };
  return { rank:0, bonus:0 };
}

function rewardClaim(s, mission) {
  if (s.claimed.includes(mission.id)) return;
  s.claimed.push(mission.id);
  s.stars += mission.reward;

  // Recompensa direta compatível com o armazenamento atual do jogo.
  const burgersKey = localStorage.getItem("hamburgueresTotais") !== null ? "hamburgueresTotais" : "hamburgueres";
  const burgers = Number(localStorage.getItem(burgersKey) || 0);
  localStorage.setItem(burgersKey, String(Math.max(0, burgers) + mission.reward * 1000));

  // A patente é permanente e fica registrada separadamente para não interferir no save existente.
  const info = rankInfo(s.stars);
  s.rank = info.rank;
  s.productionBonus = info.bonus;
  save(s);
  render();
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function build() {
  const configBtn = $("configBtn");
  const headerLang = document.querySelector(".info-language");
  if (!configBtn || !headerLang) return;

  const actions = el("div", "bc-top-actions");
  actions.setAttribute("aria-label", "Game controls");
  headerLang.appendChild(actions);
  actions.appendChild(configBtn);

  const anchor = el("div", "bc-game-menu-anchor");
  const menuBtn = el("button", "bc-game-menu-button", "🎮 Menu de Jogo");
  menuBtn.id = "gameMenuBtn";
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-haspopup", "dialog");
  anchor.appendChild(menuBtn);
  const modal = $("configModal");
  if (modal?.parentNode) modal.parentNode.insertBefore(anchor, modal);

  const overlay = el("section", "bc-game-menu-modal");
  overlay.id = "gameMenuModal";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Game Menu");
  const panel = el("div", "bc-game-menu-panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "gameMenuTitle");
  const head = el("div", "bc-game-menu-head");
  const headingBox = el("div");
  headingBox.appendChild(el("h2", "", "🎮 Menu de Jogo"));
  headingBox.firstChild.id = "gameMenuTitle";
  headingBox.appendChild(el("p", "", "Missões, desafios e sua evolução como mestre da cozinha."));
  head.appendChild(headingBox);
  const close = el("button", "", "✖️");
  close.id = "gameMenuCloseBtn";
  close.type = "button";
  close.setAttribute("aria-label", "Fechar Menu de Jogo");
  head.appendChild(close);
  panel.appendChild(head);

  const summary = el("div", "bc-menu-summary");
  ["stars","rank","streak"].forEach(key => {
    const stat = el("div", "bc-menu-stat");
    const label = el("span"); label.dataset.menuKey = key;
    const value = el("strong"); value.id = "bcMenuStat" + key;
    stat.append(label,value); summary.appendChild(stat);
  });
  panel.appendChild(summary);
  const missionsTitle = el("h3", "", "📜 Missões do dia");
  missionsTitle.id = "bcMenuMissionsTitle";
  panel.appendChild(missionsTitle);
  const grid = el("div", "bc-mission-grid"); grid.id = "bcMissionGrid"; panel.appendChild(grid);
  const rank = el("div", "bc-menu-rank"); rank.id = "bcMenuRank"; panel.appendChild(rank);
  const refresh = el("p", "", "As missões renovam todos os dias."); refresh.id = "bcMenuRefresh"; panel.appendChild(refresh);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  menuBtn.addEventListener("click", () => { normalizeState(); overlay.hidden = false; document.body.classList.add("config-modal-aberto"); close.focus(); render(); });
  close.addEventListener("click", closeMenu);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeMenu(); });
  $("languageSelector")?.addEventListener("change", () => { render(); });

  // Reorganiza a tela inicial: Jogar fica imediatamente depois do subtítulo.
  const welcome = $("welcomeScreen");
  const box = welcome?.querySelector(".welcome-caixa");
  const play = $("welcomePlayBtn");
  const subtitle = welcome?.querySelector(".welcome-subtitulo");
  if (box && play && subtitle) box.insertBefore(play, subtitle.nextSibling);

  render();
}

function closeMenu() {
  const overlay = $("gameMenuModal");
  if (!overlay) return;
  overlay.hidden = true;
  if (!$("configModal") || $("configModal").hidden) document.body.classList.remove("config-modal-aberto");
  $("gameMenuBtn")?.focus();
}

function render() {
  const s = normalizeState();
  const t = lang();
  const info = rankInfo(s.stars);
  const labels = document.querySelectorAll(".bc-menu-stat [data-menu-key]");
  labels.forEach(node => { node.textContent = t[node.dataset.menuKey] || node.dataset.menuKey; });
  $("bcMenuStatstars").textContent = String(s.stars);
  $("bcMenuStatrank").textContent = t.rankName[info.rank];
  $("bcMenuStatstreak").textContent = String(s.streak) + " 🔥";
  $("gameMenuBtn").textContent = t.menu;
  $("configBtn").textContent = t.config;
  $("gameMenuTitle").textContent = t.title;
  $("gameMenuTitle")?.nextElementSibling && ($("gameMenuTitle").nextElementSibling.textContent = t.subtitle);
  $("gameMenuCloseBtn").textContent = t.close;
  $("bcMenuMissionsTitle").textContent = t.missions;
  $("bcMenuRefresh").textContent = t.refresh;
  const rank = $("bcMenuRank");
  rank.innerHTML = `<strong>🏆 ${t.rank}: ${t.rankName[info.rank]}</strong><p>${t.rankText} ${info.bonus ? t.bonus.replace("{n}",info.bonus) : t.locked}</p>`;

  const grid = $("bcMissionGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const defs = s.missions || [];
  defs.forEach(m => {
    const value = currentValue(m,s);
    const done = value >= m.goal;
    const claimed = s.claimed.includes(m.id);
    const card = el("article", "bc-mission-card" + (claimed ? " done" : ""));
    const title = m.id === "production" ? t.mission1 : m.id === "clicks" ? t.mission2 : t.mission3;
    const goalText = m.id === "production" ? t.mission1d.replace("{n}",m.goal.toLocaleString()) : m.id === "clicks" ? t.mission2d.replace("{n}",m.goal.toLocaleString()) : t.mission3d.replace("{n}",m.goal.toLocaleString());
    card.appendChild(el("h3","",title));
    card.appendChild(el("p","",goalText));
    const progress = el("div","bc-mission-progress",`${t.progress}: ${Math.min(value,m.goal).toLocaleString()} / ${m.goal.toLocaleString()}`);
    card.appendChild(progress);
    const track = el("div","bc-mission-track"); const bar = el("span"); bar.style.width = Math.min(100,(value/m.goal)*100)+"%"; track.appendChild(bar); card.appendChild(track);
    card.appendChild(el("span","bc-mission-reward",`${t.reward}: ${t.rewardStars.replace("{n}",m.reward)} + ${m.reward*1000} 🍔`));
    const button = el("button","",claimed ? t.claimed : done ? t.claim : t.locked);
    button.type="button"; button.disabled = claimed || !done;
    button.addEventListener("click",()=>rewardClaim(s,m));
    card.appendChild(button); grid.appendChild(card);
  });
}

window.BurgerClickerGameMenu = { render, normalizeState };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build, {once:true}); else build();
})();
