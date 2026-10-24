/* =========================================================
   CONFIGURAÇÕES GLOBAIS — BURGER CLICKER
   Aplica as preferências salvas pelo menu de Configurações
   em qualquer página do site.
========================================================= */
(() => {
    'use strict';

    const KEYS = {
        som: 'bc_config_som',
        musica: 'bc_config_musica',
        animacoes: 'bc_config_animacoes',
        temaEscuro: 'bc_config_tema_escuro',
        vibracao: 'bc_config_vibracao',
        volumeMusica: 'bc_config_volume_musica',
        volumeEfeitos: 'bc_config_volume_efeitos'
    };

    const readBoolean = (key, fallback) => {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value === 'true';
    };

    const readNumber = (key, fallback) => {
        const value = Number(localStorage.getItem(key));
        return Number.isFinite(value) ? value : fallback;
    };

    function applyTheme() {
        document.documentElement.classList.toggle('tema-escuro', readBoolean(KEYS.temaEscuro, false));
    }

    function applyAnimations() {
        document.documentElement.classList.toggle('sem-animacoes', !readBoolean(KEYS.animacoes, true));
    }

    function applyAudio() {
        const effectsEnabled = readBoolean(KEYS.som, true);
        const musicEnabled = readBoolean(KEYS.musica, true);
        const effectsVolume = Math.max(0, Math.min(1, readNumber(KEYS.volumeEfeitos, 1)));
        const musicVolume = Math.max(0, Math.min(1, readNumber(KEYS.volumeMusica, 0.5)));

        document.querySelectorAll('audio').forEach(audio => {
            const isMusic = audio.id === 'musicaFundo' || audio.dataset.audioType === 'music';
            const enabled = isMusic ? musicEnabled : effectsEnabled;
            audio.muted = !enabled;
            audio.volume = isMusic ? musicVolume : effectsVolume;
            if (!enabled && !audio.paused) audio.pause();
        });
    }

    function applyAll() {
        applyTheme();
        applyAnimations();
        applyAudio();
        window.dispatchEvent(new CustomEvent('burgerclicker:settings-applied', {
            detail: {
                som: readBoolean(KEYS.som, true),
                musica: readBoolean(KEYS.musica, true),
                animacoes: readBoolean(KEYS.animacoes, true),
                temaEscuro: readBoolean(KEYS.temaEscuro, false),
                vibracao: readBoolean(KEYS.vibracao, true),
                volumeMusica: Math.max(0, Math.min(1, readNumber(KEYS.volumeMusica, 0.5))),
                volumeEfeitos: Math.max(0, Math.min(1, readNumber(KEYS.volumeEfeitos, 1)))
            }
        }));
    }

    window.BurgerClickerSettings = Object.freeze({
        keys: Object.freeze({ ...KEYS }),
        apply: applyAll,
        isVibrationEnabled: () => readBoolean(KEYS.vibracao, true),
        vibrate: pattern => {
            if (!readBoolean(KEYS.vibracao, true)) return false;
            if (typeof navigator.vibrate !== 'function') return false;
            return navigator.vibrate(pattern);
        }
    });

    // Aplicação imediata ao carregar a página e sincronização entre abas/janelas.
    applyAll();
    window.addEventListener('storage', event => {
        if (Object.values(KEYS).includes(event.key)) applyAll();
    });

    // A página principal pode alterar as configurações sem recarregar.
    window.addEventListener('burgerclicker:settings-changed', applyAll);
})();
