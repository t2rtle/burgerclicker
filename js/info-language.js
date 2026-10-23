/* =========================================================
   IDIOMAS — PÁGINAS INSTITUCIONAIS BURGER CLICKER
   Idioma padrão: Inglês (Estados Unidos)
========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'burgerClickerLanguage';
  const DEFAULT_LANGUAGE = 'en-US';

  const translations = {
    'en-US': {
      navLabel: 'Page navigation',
      navHome: '🍔 Home',
      navAbout: 'ℹ️ About',
      navPrivacy: '🔒 Privacy',
      navContact: '✉️ Contact',
      languageLabel: '🌐 Language',
      languageAria: 'Select language',
      languageEn: 'English (United States)',
      languagePtBR: 'Portuguese (Brazil)',
      languagePtPT: 'Portuguese (Portugal)',
      brand: '🍔 Burger Clicker',
      backGame: '🍔 Back to game',
      playGame: '🍔 Play Burger Clicker',
      contact: '✉️ Contact us',
      footerAbout: 'About',
      footerPrivacy: 'Privacy',
      footerContact: 'Contact',
      footerCopyright: 'Burger Clicker v1.0 · All rights reserved.',

      aboutTitle: 'About Burger Clicker',
      aboutLead: 'An incremental game that is easy to start, but full of paths to grow your restaurant.',
      aboutWhatTitle: '🎮 What is Burger Clicker?',
      aboutWhat: 'Burger Clicker is an incremental game created by <strong>Crabscary</strong>. The idea is to produce burgers, improve your operation, and turn a small production into a true food empire.',
      aboutHowTitle: '📈 How does it work?',
      aboutHow: '<li>🍔 Produce burgers by clicking and increasing your automatic production.</li><li>🏪 Buy employees, equipment, food trucks, restaurants, and franchises.</li><li>⬆️ Purchase upgrades to increase the efficiency of your operation.</li><li>⭐ Perform Rebirths and use prestige progression to reach new levels.</li><li>🐾 Find, equip, and evolve pets with their own rewards.</li><li>🏆 Complete achievements and unlock rewards throughout your progression.</li>',
      aboutExperienceTitle: '✨ Experience',
      aboutExperience: 'The game is designed to run directly in the browser and also offers installable app (PWA) features in compatible browsers. Progress and several preferences are stored locally on the device.',
      aboutGoal: '🍔 <strong>Goal:</strong> produce more and more, grow your restaurant, discover new possibilities, and try to beat your own progress.',
      aboutDevelopmentTitle: '👨‍💻 Development',
      aboutDeveloper: '<strong>Developer:</strong> Crabscary',
      aboutProject: '<strong>Project:</strong> Burger Clicker',
      aboutVersion: '<strong>Current version:</strong> 1.0',
      aboutDevelopmentNote: 'The project continues to receive improvements to its interface, systems, accessibility, and gameplay experience.',

      privacyTitle: 'Privacy Policy',
      privacyLead: 'Transparency about the data, storage, and technologies used by Burger Clicker.',
      privacyStorageTitle: '💾 Game storage',
      privacyStorage: 'Burger Clicker uses the browser\'s local storage, mainly <strong>localStorage</strong>, to keep the player\'s progress and preferences on this device.',
      privacyStorage2: 'These data are part of the game\'s operation and may be deleted when the site or browser data are removed.',
      privacyAdsTitle: '📢 Advertising',
      privacyAds: 'Burger Clicker may display advertising through <strong>Google AdSense</strong>. Advertising services may use cookies or similar technologies to serve and measure ads, according to the applicable settings and policies.',
      privacyAds2: 'Burger Clicker does not individually control the data processed by advertising providers. To understand how Google handles data related to advertising, please consult Google\'s own privacy and advertising policies.',
      privacyPersonalTitle: '🧑‍💻 Personal data',
      privacyPersonal: 'Burger Clicker does not directly request personal information to let you play. The game does not have a mandatory registration or player account system of its own.',
      privacyPersonal2: 'External features, such as advertising services or platforms accessed by the player, may have their own data collection and processing practices.',
      privacyCookiesTitle: '🍪 Cookies and preferences',
      privacyCookies: 'Cookies may be used by third-party services, including advertising. Cookie behavior depends on the service used, browser settings, and consent options available in your region.',
      privacyChangesTitle: '🔄 Changes to this policy',
      privacyChanges: 'This page may be updated when the game, its features, or the services it uses are modified. The version published on this page represents the policy currently presented by Burger Clicker.',
      privacyUpdated: 'Last updated: October 2026 · Burger Clicker v1.0',

      contactTitle: 'Contact',
      contactLead: 'Found a problem, have a suggestion, or want to send feedback about Burger Clicker?',
      contactDeveloperTitle: '👨‍💻 Developer',
      contactDeveloper: '<strong>Crabscary</strong> — creator and developer of Burger Clicker.',
      contactGithubTitle: '🐙 GitHub',
      contactGithub: 'The project and its source code can be followed on GitHub:',
      contactFeedbackTitle: '💡 Feedback and issues',
      contactFeedback: 'To report a bug, suggest an improvement, or share an idea, open an <strong>Issue on GitHub</strong>. This helps organize reports and track each improvement to the project.',
      contactIssues: '🐙 Open GitHub Issues',
      contactGameTitle: '🍔 About the game',
      contactGame: 'Before sending your feedback, you can also learn more about the project on the <a href="about.html" data-i18n="aboutLink">About</a> page or read the <a href="privacy.html" data-i18n="privacyLink">Privacy Policy</a>.',
      aboutLink: 'About',
      privacyLink: 'Privacy Policy'
    },

    'pt-BR': {
      navLabel: 'Navegação das páginas',
      navHome: '🍔 Principal', navAbout: 'ℹ️ Sobre', navPrivacy: '🔒 Privacidade', navContact: '✉️ Contato',
      languageLabel: '🌐 Idioma', languageAria: 'Selecionar idioma', languageEn: 'Inglês (Estados Unidos)', languagePtBR: 'Português (Brasil)', languagePtPT: 'Português (Portugal)',
      brand: '🍔 Burger Clicker', backGame: '🍔 Voltar ao jogo', playGame: '🍔 Jogar Burger Clicker', contact: '✉️ Entrar em contato', footerAbout: 'Sobre', footerPrivacy: 'Privacidade', footerContact: 'Contato', footerCopyright: 'Burger Clicker v1.0 · Todos os direitos reservados.',
      aboutTitle: 'Sobre o Burger Clicker', aboutLead: 'Um jogo incremental simples de começar, mas cheio de caminhos para evoluir seu restaurante.', aboutWhatTitle: '🎮 O que é o Burger Clicker?', aboutWhat: 'O Burger Clicker é um jogo incremental criado por <strong>Crabscary</strong>. A ideia é produzir hambúrgueres, melhorar sua operação e transformar uma pequena produção em um verdadeiro império gastronômico.', aboutHowTitle: '📈 Como funciona?', aboutHow: '<li>🍔 Produza hambúrgueres clicando e aumentando sua produção automática.</li><li>🏪 Compre funcionários, equipamentos, food trucks, lanchonetes e franquias.</li><li>⬆️ Adquira upgrades para aumentar a eficiência da sua operação.</li><li>⭐ Faça Rebirths e use a progressão de prestígio para alcançar novos patamares.</li><li>🐾 Encontre, equipe e evolua pets com recompensas próprias.</li><li>🏆 Complete conquistas e desbloqueie recompensas ao longo da progressão.</li>', aboutExperienceTitle: '✨ Experiência', aboutExperience: 'O jogo foi desenvolvido para funcionar diretamente no navegador e também possui recursos de aplicativo instalável (PWA) em navegadores compatíveis. O progresso e várias preferências são mantidos localmente no dispositivo.', aboutGoal: '🍔 <strong>Objetivo:</strong> produza cada vez mais, evolua seu restaurante, descubra novas possibilidades e tente superar seu próprio progresso.', aboutDevelopmentTitle: '👨‍💻 Desenvolvimento', aboutDeveloper: '<strong>Desenvolvedor:</strong> Crabscary', aboutProject: '<strong>Projeto:</strong> Burger Clicker', aboutVersion: '<strong>Versão atual:</strong> 1.0', aboutDevelopmentNote: 'O projeto continua recebendo melhorias de interface, sistemas, acessibilidade e experiência de jogo.',
      privacyTitle: 'Política de Privacidade', privacyLead: 'Transparência sobre os dados, armazenamento e tecnologias utilizadas no Burger Clicker.', privacyStorageTitle: '💾 Armazenamento do jogo', privacyStorage: 'O Burger Clicker utiliza o armazenamento local do navegador, principalmente <strong>localStorage</strong>, para manter o progresso e as preferências do jogador neste dispositivo.', privacyStorage2: 'Esses dados fazem parte do funcionamento do jogo e podem ser apagados quando os dados do site ou do navegador forem removidos.', privacyAdsTitle: '📢 Publicidade', privacyAds: 'O Burger Clicker pode exibir publicidade por meio do <strong>Google AdSense</strong>. Serviços de publicidade podem utilizar cookies ou tecnologias semelhantes para veicular e medir anúncios, de acordo com as configurações e políticas aplicáveis.', privacyAds2: 'O Burger Clicker não controla individualmente os dados tratados pelos provedores de publicidade. Para entender como o Google trata dados relacionados a anúncios, consulte as políticas de privacidade e publicidade do próprio Google.', privacyPersonalTitle: '🧑‍💻 Dados pessoais', privacyPersonal: 'O Burger Clicker não solicita diretamente informações pessoais para permitir que você jogue. O jogo não possui, por conta própria, um sistema de cadastro obrigatório ou uma conta de jogador.', privacyPersonal2: 'Recursos externos, como serviços de publicidade ou plataformas acessadas pelo jogador, podem possuir suas próprias práticas de coleta e tratamento de dados.', privacyCookiesTitle: '🍪 Cookies e preferências', privacyCookies: 'Cookies podem ser utilizados por serviços de terceiros, incluindo publicidade. O comportamento desses cookies depende do serviço utilizado, das configurações do navegador e das opções de consentimento disponíveis na sua região.', privacyChangesTitle: '🔄 Alterações desta política', privacyChanges: 'Esta página poderá ser atualizada quando o jogo, seus recursos ou os serviços utilizados forem modificados. A versão publicada nesta página representa a política atualmente apresentada pelo Burger Clicker.', privacyUpdated: 'Última atualização: outubro de 2026 · Burger Clicker v1.0',
      contactTitle: 'Contato', contactLead: 'Encontrou um problema, tem uma sugestão ou quer enviar um feedback sobre o Burger Clicker?', contactDeveloperTitle: '👨‍💻 Desenvolvedor', contactDeveloper: '<strong>Crabscary</strong> — criador e desenvolvedor do Burger Clicker.', contactGithubTitle: '🐙 GitHub', contactGithub: 'O projeto e seu código-fonte podem ser acompanhados pelo GitHub:', contactFeedbackTitle: '💡 Feedback e problemas', contactFeedback: 'Para relatar um erro, sugerir uma melhoria ou compartilhar uma ideia, abra uma <strong>Issue no GitHub</strong>. Isso ajuda a organizar os relatos e acompanhar cada melhoria do projeto.', contactIssues: '🐙 Abrir Issues no GitHub', contactGameTitle: '🍔 Sobre o jogo', contactGame: 'Antes de enviar seu feedback, você também pode conhecer mais sobre o projeto na página <a href="about.html" data-i18n="aboutLink">Sobre</a> ou consultar a <a href="privacy.html" data-i18n="privacyLink">Política de Privacidade</a>.', aboutLink: 'Sobre', privacyLink: 'Política de Privacidade'
    },

    'pt-PT': {
      navLabel: 'Navegação das páginas',
      navHome: '🍔 Principal', navAbout: 'ℹ️ Sobre', navPrivacy: '🔒 Privacidade', navContact: '✉️ Contacto',
      languageLabel: '🌐 Idioma', languageAria: 'Selecionar idioma', languageEn: 'Inglês (Estados Unidos)', languagePtBR: 'Português (Brasil)', languagePtPT: 'Português (Portugal)',
      brand: '🍔 Burger Clicker', backGame: '🍔 Voltar ao jogo', playGame: '🍔 Jogar Burger Clicker', contact: '✉️ Entrar em contacto', footerAbout: 'Sobre', footerPrivacy: 'Privacidade', footerContact: 'Contacto', footerCopyright: 'Burger Clicker v1.0 · Todos os direitos reservados.',
      aboutTitle: 'Sobre o Burger Clicker', aboutLead: 'Um jogo incremental simples de começar, mas cheio de caminhos para evoluir o seu restaurante.', aboutWhatTitle: '🎮 O que é o Burger Clicker?', aboutWhat: 'O Burger Clicker é um jogo incremental criado por <strong>Crabscary</strong>. A ideia é produzir hambúrgueres, melhorar a sua operação e transformar uma pequena produção num verdadeiro império gastronómico.', aboutHowTitle: '📈 Como funciona?', aboutHow: '<li>🍔 Produza hambúrgueres ao clicar e aumente a sua produção automática.</li><li>🏪 Compre funcionários, equipamentos, food trucks, restaurantes e franquias.</li><li>⬆️ Adquira upgrades para aumentar a eficiência da sua operação.</li><li>⭐ Faça Rebirths e utilize a progressão de prestígio para alcançar novos patamares.</li><li>🐾 Encontre, equipe e evolua pets com recompensas próprias.</li><li>🏆 Complete conquistas e desbloqueie recompensas ao longo da progressão.</li>', aboutExperienceTitle: '✨ Experiência', aboutExperience: 'O jogo foi desenvolvido para funcionar diretamente no navegador e também possui recursos de aplicação instalável (PWA) em navegadores compatíveis. O progresso e várias preferências são mantidos localmente no dispositivo.', aboutGoal: '🍔 <strong>Objetivo:</strong> produza cada vez mais, evolua o seu restaurante, descubra novas possibilidades e tente superar o seu próprio progresso.', aboutDevelopmentTitle: '👨‍💻 Desenvolvimento', aboutDeveloper: '<strong>Desenvolvedor:</strong> Crabscary', aboutProject: '<strong>Projeto:</strong> Burger Clicker', aboutVersion: '<strong>Versão atual:</strong> 1.0', aboutDevelopmentNote: 'O projeto continua a receber melhorias de interface, sistemas, acessibilidade e experiência de jogo.',
      privacyTitle: 'Política de Privacidade', privacyLead: 'Transparência sobre os dados, armazenamento e tecnologias utilizadas no Burger Clicker.', privacyStorageTitle: '💾 Armazenamento do jogo', privacyStorage: 'O Burger Clicker utiliza o armazenamento local do navegador, principalmente <strong>localStorage</strong>, para manter o progresso e as preferências do jogador neste dispositivo.', privacyStorage2: 'Estes dados fazem parte do funcionamento do jogo e podem ser apagados quando os dados do site ou do navegador forem removidos.', privacyAdsTitle: '📢 Publicidade', privacyAds: 'O Burger Clicker pode apresentar publicidade através do <strong>Google AdSense</strong>. Os serviços de publicidade podem utilizar cookies ou tecnologias semelhantes para apresentar e medir anúncios, de acordo com as definições e políticas aplicáveis.', privacyAds2: 'O Burger Clicker não controla individualmente os dados tratados pelos fornecedores de publicidade. Para compreender como a Google trata os dados relacionados com anúncios, consulte as políticas de privacidade e publicidade da própria Google.', privacyPersonalTitle: '🧑‍💻 Dados pessoais', privacyPersonal: 'O Burger Clicker não solicita diretamente informações pessoais para permitir que jogue. O jogo não possui, por si próprio, um sistema de registo obrigatório ou uma conta de jogador.', privacyPersonal2: 'Recursos externos, como serviços de publicidade ou plataformas acedidas pelo jogador, podem ter as suas próprias práticas de recolha e tratamento de dados.', privacyCookiesTitle: '🍪 Cookies e preferências', privacyCookies: 'Os cookies podem ser utilizados por serviços de terceiros, incluindo publicidade. O comportamento destes cookies depende do serviço utilizado, das definições do navegador e das opções de consentimento disponíveis na sua região.', privacyChangesTitle: '🔄 Alterações desta política', privacyChanges: 'Esta página poderá ser atualizada quando o jogo, os seus recursos ou os serviços utilizados forem modificados. A versão publicada nesta página representa a política atualmente apresentada pelo Burger Clicker.', privacyUpdated: 'Última atualização: outubro de 2026 · Burger Clicker v1.0',
      contactTitle: 'Contacto', contactLead: 'Encontrou um problema, tem uma sugestão ou quer enviar um feedback sobre o Burger Clicker?', contactDeveloperTitle: '👨‍💻 Desenvolvedor', contactDeveloper: '<strong>Crabscary</strong> — criador e desenvolvedor do Burger Clicker.', contactGithubTitle: '🐙 GitHub', contactGithub: 'O projeto e o seu código-fonte podem ser acompanhados pelo GitHub:', contactFeedbackTitle: '💡 Feedback e problemas', contactFeedback: 'Para comunicar um erro, sugerir uma melhoria ou partilhar uma ideia, abra uma <strong>Issue no GitHub</strong>. Isto ajuda a organizar os relatos e acompanhar cada melhoria do projeto.', contactIssues: '🐙 Abrir Issues no GitHub', contactGameTitle: '🍔 Sobre o jogo', contactGame: 'Antes de enviar o seu feedback, também pode conhecer melhor o projeto na página <a href="about.html" data-i18n="aboutLink">Sobre</a> ou consultar a <a href="privacy.html" data-i18n="privacyLink">Política de Privacidade</a>.', aboutLink: 'Sobre', privacyLink: 'Política de Privacidade'
    }
  };

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return translations[saved] ? saved : DEFAULT_LANGUAGE;
  }

  function applyLanguage(language, persist) {
    const lang = translations[language] ? language : DEFAULT_LANGUAGE;
    const dict = translations[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(dict, key)) element.innerHTML = dict[key];
    });

    const select = document.getElementById('languageSelector');
    if (select) select.value = lang;

    if (persist) localStorage.setItem(STORAGE_KEY, lang);
    document.dispatchEvent(new CustomEvent("burgerclicker:languagechange", { detail: lang }));
  }

  function init() {
    const select = document.getElementById('languageSelector');
    if (!select) return;
    select.addEventListener('change', () => applyLanguage(select.value, true));
    applyLanguage(getLanguage(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
