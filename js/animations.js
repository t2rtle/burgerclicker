/* Burger Clicker motion system: reveal-on-scroll, subtle idle states and click feedback. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const animationsEnabled = () => !root.classList.contains("sem-animacoes") && !reduceMotion;

  function setupReveal() {
    const targets = $$(".painel, .bc-smart-dashboard, .painel-pets, .loja, .upgrades, .estatisticas, .prestige, .conquistas, .prestige-shop-panel, footer");
    targets.forEach(el => {
      if (el.closest("#welcomeScreen, #configModal") || el.dataset.bcReveal === "done") return;
      el.dataset.bcReveal = "done";
      el.classList.add("bc-reveal");
    });
    if (!animationsEnabled()) {
      targets.forEach(el => { if (el.classList.contains("bc-reveal")) el.classList.add("is-visible"); });
      root.classList.remove("bc-reveal-ready");
      return;
    }
    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }
    root.classList.add("bc-reveal-ready");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });
    targets.forEach(el => {
      if (el.classList.contains("bc-reveal")) {
        if (el.getBoundingClientRect().top < window.innerHeight * .94) el.classList.add("is-visible");
        else observer.observe(el);
      }
    });
  }

  function setupIdle() {
    if (!animationsEnabled()) return;
    const dashboard = $(".bc-smart-dashboard");
    const pet = $(".pet-ativo-card");
    if (dashboard) dashboard.classList.add("bc-idle-glow");
    if (pet) pet.classList.add("bc-idle-float");
  }

  function setupBurgerFeedback() {
    const burger = $("#burgerBtn");
    if (!burger) return;
    burger.addEventListener("click", () => {
      if (!animationsEnabled()) return;
      burger.classList.remove("bc-burger-pop");
      void burger.offsetWidth;
      burger.classList.add("bc-burger-pop");
      window.setTimeout(() => burger.classList.remove("bc-burger-pop"), 390);
      const rect = burger.getBoundingClientRect();
      const particles = ["🍔", "✨", "+1", "🍟", "⭐"];
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement("span");
        particle.className = "bc-click-particle";
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = (rect.left + rect.width * (.28 + Math.random() * .44)) + "px";
        particle.style.top = (rect.top + rect.height * .35) + "px";
        particle.style.setProperty("--bc-dx", ((Math.random() - .5) * 72) + "px");
        document.body.appendChild(particle);
        particle.addEventListener("animationend", () => particle.remove(), { once: true });
      }
    }, { passive: true });
  }

  function init() {
    root.classList.add("bc-motion-ready");
    setupReveal();
    setupIdle();
    setupBurgerFeedback();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  const animationToggle = $("#configAnimacoes");
  animationToggle?.addEventListener("change", () => {
    window.setTimeout(() => {
      if (animationsEnabled()) {
        root.classList.add("bc-motion-ready");
        setupReveal();
        setupIdle();
      } else {
        root.classList.remove("bc-reveal-ready");
        $$(".bc-reveal").forEach(el => el.classList.add("is-visible"));
        $$(".bc-idle-float, .bc-idle-glow").forEach(el => el.classList.remove("bc-idle-float", "bc-idle-glow"));
      }
    }, 0);
  });
})();
