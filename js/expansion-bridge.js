(() => {
"use strict";
// The core game uses global lexical variables (let/const), so expose the
// business counts as read-only window properties for the expansion's generic
// achievement condition evaluator.
for (const key of ["funcionarios","chapas","foodTrucks","lanchonetes","franquias"]) {
  if (!(key in window)) {
    try { Object.defineProperty(window,key,{configurable:true,get:()=>Number(localStorage.getItem(key)||0)}); } catch {}
  }
}

// Keep the new UI modular without changing the existing index markup.
function carregarAsset(tipo, src) {
  if (document.querySelector(`[data-bc-asset="${src}"]`)) return;
  const node = document.createElement(tipo === "css" ? "link" : "script");
  node.dataset.bcAsset = src;
  if (tipo === "css") {
    node.rel = "stylesheet";
    node.href = src;
  } else {
    node.src = src;
    node.defer = true;
  }
  document.head.appendChild(node);
}

carregarAsset("css", "css/game-menu.css");
carregarAsset("js", "js/game-menu.js");
})();
