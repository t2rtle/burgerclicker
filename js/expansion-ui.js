(() => {
"use strict";
if (document.getElementById("burger-clicker-expansion-ui")) return;
const style = document.createElement("style");
style.id = "burger-clicker-expansion-ui";
style.textContent = `
/* Layout fluido: nenhum texto deve ampliar o cartão ou sobrepor os vizinhos. */
.bc-expansion-section{margin-top:18px;padding:clamp(12px,2.5vw,18px);min-width:0;max-width:100%;border:1px solid rgba(255,255,255,.18);border-radius:20px;background:rgba(255,255,255,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.bc-expansion-section h3{margin-top:0;line-height:1.25;overflow-wrap:anywhere}
.bc-item-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;min-width:0}
.bc-item-grid button{min-width:0;max-width:100%;min-height:92px;height:auto;text-align:left;white-space:normal;overflow-wrap:anywhere;word-break:normal;line-height:1.35;font-size:clamp(.82rem,1.2vw + .55rem,1rem);padding:clamp(10px,2vw,16px)}
.bc-item-grid button *{max-width:100%;white-space:normal;overflow-wrap:anywhere}
.bc-item-grid button small{display:block;opacity:.82;line-height:1.4;font-size:.85em}
.bc-ach-head{display:flex;justify-content:space-between;gap:12px;align-items:center;min-width:0;flex-wrap:wrap;margin:12px 0 16px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.08)}
.bc-ach-head>*{min-width:0;max-width:100%;overflow-wrap:anywhere}
.bc-ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px;min-width:0}
.bc-ach-card{display:flex;gap:clamp(8px,1.5vw,12px);align-items:flex-start;min-width:0;max-width:100%;padding:clamp(10px,2vw,14px);border-radius:16px;border:1px solid rgba(255,255,255,.16);transition:background .2s ease,border-color .2s ease}
.bc-ach-card.obtained{background:rgba(255,193,7,.12)}
.bc-ach-card.locked{background:rgba(100,100,100,.12);filter:grayscale(1);opacity:.55}
.bc-ach-icon{flex:0 0 1.8rem;min-width:0;font-size:1.5rem;line-height:1.3;text-align:center}
.bc-ach-body{flex:1 1 auto;min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:normal}
.bc-ach-body h3{margin:0 0 5px;font-size:clamp(.9rem,1vw + .55rem,1rem);line-height:1.3;overflow-wrap:anywhere}
.bc-ach-body p{margin:0 0 8px;font-size:clamp(.82rem,.9vw + .5rem,.95rem);line-height:1.45;overflow-wrap:anywhere}
.bc-ach-body small{display:block;opacity:.85;font-size:.82em;line-height:1.4;overflow-wrap:anywhere}
.bc-ach-card.locked:hover{opacity:.72;filter:grayscale(.8)}
/* Pedidos diários e pesquisas: integrados às áreas existentes da Loja e Upgrades. */
.bc-contract-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:10px}
.bc-contract-card{min-width:0;padding:13px;border:1px solid rgba(255,255,255,.16);border-radius:15px;background:rgba(255,255,255,.055)}
.bc-contract-card h4{margin:0 0 6px;line-height:1.3}
.bc-contract-card p{margin:0 0 9px;font-size:.9rem;opacity:.8}
.bc-contract-progress-text{font-size:.8rem;font-variant-numeric:tabular-nums;margin-bottom:6px}
.bc-contract-track{height:7px;border-radius:999px;overflow:hidden;background:rgba(120,100,80,.18);margin-bottom:8px}
.bc-contract-track span{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#c97831,#f4bf63);transition:width .2s ease}
.bc-contract-reward{display:block;margin-bottom:9px;opacity:.8}
.bc-contract-card button{width:100%;min-height:40px}
.bc-contract-card.pronto{border-color:rgba(210,150,55,.52);background:rgba(255,193,7,.08)}
.bc-contract-card.concluido{opacity:.7}
.bc-burger-lab{margin-top:18px;background:rgba(255,255,255,.065)}
.bc-burger-lab>p{margin-top:-4px;opacity:.8}
html.tema-escuro .bc-contract-card{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.035)}
/* Compatibilidade com telas estreitas, zoom e nomes muito longos. */
@media(max-width:600px){.bc-ach-head{flex-direction:column;align-items:stretch}.bc-item-grid,.bc-ach-grid{grid-template-columns:minmax(0,1fr)}.bc-expansion-section{padding:12px}.bc-ach-card{gap:9px}}
@media(prefers-reduced-motion:reduce){.bc-ach-card{transition:none}}
`;
document.head.appendChild(style);
})();