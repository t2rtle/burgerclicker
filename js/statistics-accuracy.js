"use strict";

/* Ajusta métricas derivadas para que produção automática e eficiência
   sejam calculadas a partir do total produzido e da produção manual registrada. */
(() => {
    const KEY = "bc_statistics_v2";
    function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return {};}}
    function write(s){localStorage.setItem(KEY,JSON.stringify(s));}
    function num(v){v=Number(v);return Number.isFinite(v)?v:0;}
    setInterval(() => {
        const s=read();
        const total=num(typeof hamburgueresTotais!=="undefined"?hamburgueresTotais:0);
        const manual=Math.max(0,num(s.producaoManual));
        s.producaoAutomatica=Math.max(0,total-manual);
        s.ultimaSessao=Date.now();
        write(s);
    },1000);
})();
