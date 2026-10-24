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
})();
