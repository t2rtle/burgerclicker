(() => {
"use strict";
const style=document.createElement("style");
style.id="burger-clicker-expansion-ui";
style.textContent=`
.bc-expansion-section{margin-top:18px;padding:18px;border:1px solid rgba(255,255,255,.18);border-radius:20px;background:rgba(255,255,255,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.bc-expansion-section h3{margin-top:0}.bc-item-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.bc-item-grid button{min-height:92px;text-align:left}.bc-item-grid button small{opacity:.82;line-height:1.35}.bc-ach-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:12px 0 16px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.08)}.bc-ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.bc-ach-card{display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:16px;border:1px solid rgba(255,255,255,.16);transition:.2s ease}.bc-ach-card.obtained{background:rgba(255,193,7,.12)}.bc-ach-card.locked{background:rgba(100,100,100,.12);filter:grayscale(1);opacity:.55}.bc-ach-icon{font-size:1.8rem;min-width:34px}.bc-ach-body h3{margin:0 0 5px;font-size:1rem}.bc-ach-body p{margin:0 0 8px}.bc-ach-body small{opacity:.85}.bc-ach-card.locked:hover{opacity:.72;filter:grayscale(.8)}
@media(max-width:600px){.bc-ach-head{flex-direction:column;align-items:flex-start}.bc-item-grid{grid-template-columns:1fr}.bc-ach-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);
})();
