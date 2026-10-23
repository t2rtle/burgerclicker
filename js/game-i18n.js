/* Burger Clicker localization layer. Keep source code and repository documentation in English. */
(() => {
  'use strict';
  const STORAGE_KEY = 'burgerClickerLanguage';
  const DEFAULT_LANGUAGE = 'en-US';
  const supported = new Set(['en-US', 'pt-BR', 'pt-PT']);
  let language = supported.has(localStorage.getItem(STORAGE_KEY)) ? localStorage.getItem(STORAGE_KEY) : DEFAULT_LANGUAGE;

  const en = {
    'Principal':'Home','Sobre':'About','Privacidade':'Privacy','Contato':'Contact','Contacto':'Contact',
    'Configurações':'Settings','Abrir configurações':'Open settings','Fechar configurações':'Close settings','Menu de configurações':'Settings menu',
    'Personalize sua experiência no Burger Clicker. As opções ficam salvas neste dispositivo.':'Customize your Burger Clicker experience. Your options are saved on this device.',
    'Experiência':'Experience','Som dos efeitos':'Sound effects','Música de fundo':'Background music','Animações':'Animations','Tema escuro':'Dark theme','Vibração':'Vibration',
    'Volume da música':'Music volume','Volume dos efeitos':'Effects volume','Diagnóstico de áudio':'Audio diagnostics',
    'Use estes testes para identificar se o navegador encontra os arquivos e consegue reproduzi-los.':'Use these tests to check whether the browser can find and play the audio files.',
    'Pronto para diagnosticar.':'Ready to run diagnostics.','Verificar arquivos':'Check files','Testar efeito':'Test effect','Testar música':'Test music',
    'Backup':'Backup','O jogo cria backups automáticos periódicos e também antes de resetar ou restaurar um progresso.':'The game creates periodic automatic backups and another backup before resetting or restoring progress.',
    'Criar e baixar backup agora':'Create and download backup now','Restaurar arquivo de backup':'Restore backup file','Restaurar último backup automático':'Restore latest automatic backup',
    'Backup automático: aguardando o primeiro backup.':'Automatic backup: waiting for the first backup.',
    'Guarde também um arquivo baixado em um local seguro. O backup automático fica no armazenamento deste navegador e pode ser perdido se os dados do site forem apagados.':'Keep a downloaded copy in a safe place too. The automatic backup is stored in this browser and may be lost if website data is cleared.',
    'Progresso':'Progress','Use esta opção para começar novamente do zero. Um backup automático é criado antes da exclusão.':'Use this option to start over from scratch. An automatic backup is created before progress is deleted.',
    'Resetar todo o progresso':'Reset all progress','Aplicativo':'App','Instale o Burger Clicker quando o navegador oferecer suporte. O diagnóstico abaixo verifica manifesto, ícones, segurança, Service Worker, cache e armazenamento neste dispositivo.':'Install Burger Clicker when your browser supports it. The diagnostics below check the manifest, icons, security, Service Worker, cache, and storage on this device.',
    'Instalar aplicativo':'Install app','Abrir app':'Open app','Executar diagnóstico PWA':'Run PWA diagnostics','Copiar relatório':'Copy report',
    'Verificando disponibilidade da instalação...':'Checking installation availability...','Pronto para verificar a instalação do aplicativo.':'Ready to check app installation.',
    'Jogar':'Play','JOGAR':'PLAY','Bem-vindo de volta! Confira as novidades antes de começar a sua fábrica de hambúrgueres.':'Welcome back! Check out what is new before starting your burger factory.',
    'Sistema completo de progressão com níveis, XP, negócios e upgrades.':'Complete progression system with levels, XP, businesses, and upgrades.',
    'Rebirth com fichas, bônus permanentes e Loja de Prestígio.':'Rebirth with tokens, permanent bonuses, and the Prestige Shop.',
    'Sistema de pets com coleção, equipamento, nomes e evolução.':'Pet system with collection, equipping, names, and leveling.',
    'Menu de Configurações com áudio, volumes, animações, tema, vibração e instalação PWA.':'Settings menu with audio, volume, animations, theme, vibration, and PWA installation.',
    'Backups automáticos, backup manual, restauração e reset seguro do progresso.':'Automatic and manual backups, restore, and safe progress reset.',
    'PWA preparado para instalação como aplicativo em navegadores compatíveis.':'PWA ready to install as an app in compatible browsers.',
    'Sistema de áudio atualizado: efeitos nos botões e música de fundo em looping.':'Updated audio system: button sound effects and looping background music.',
    'O botão Jogar libera o áudio durante uma interação permitida pelo navegador.':'The Play button enables audio during a browser-approved interaction.',
    'Clique em':'Click','para entrar no jogo e permitir que a música e os efeitos sonoros sejam iniciados pelo navegador.':'to enter the game and allow the browser to start the music and sound effects.',
    'Hambúrgueres':'Burgers','Produção:':'Production:','por segundo':'per second','Level':'Level','XP:':'XP:',
    'CENTRAL DE OPERAÇÕES':'OPERATIONS CENTER','Seu restaurante':'Your restaurant','Barraca de hambúrgueres':'Burger stand',
    'Por clique':'Per click','Produção real':'Actual production','Produção total':'Total production',
    'Progresso até o próximo Rebirth':'Progress to next Rebirth','Próxima compra sugerida':'Suggested next purchase','Carregando recomendações…':'Loading recommendations…',
    'Seu Pet':'Your Pet','Nenhum pet equipado':'No pet equipped','Faça Rebirth para tentar encontrar seu primeiro pet!':'Perform a Rebirth to try to find your first pet!',
    'Nome personalizado do pet equipado':'Custom name for equipped pet','Ex.: Bolinha, Rei do Hambúrguer...':'e.g. Bubbles, Burger King...',
    'Salvar nome':'Save name','Trocar pet equipado':'Change equipped pet','Nenhum pet disponível':'No pets available','Equipar':'Equip',
    'Nível de alimentação:':'Feeding level:','Recompensa:':'Reward:','Custo para alimentar:':'Feeding cost:','Alimentar e evoluir':'Feed and level up',
    'Coleção de pets':'Pet collection','Pets novos podem ser encontrados ao fazer Rebirth. Cada descoberta é aleatória e não repete um pet que você já possui. Dê um nome, equipe outro pet quando quiser e alimente-o para aumentar sua recompensa sem limite.':'New pets can be discovered by performing Rebirths. Each discovery is random and will not duplicate a pet you already own. Give your pet a name, equip another whenever you like, and feed it to increase its reward without a limit.',
    'Loja':'Store','Funcionário':'Employee','Funcionários':'Employees','Possui:':'Owned:','Custo:':'Cost:','Chapa Industrial':'Industrial Griddle','Food Truck':'Food Truck','Lanchonete':'Diner','Franquia':'Franchise',
    'Upgrades':'Upgrades','Clique Duplo':'Double Click','Clique Mestre':'Master Click','Funcionários Motivados':'Motivated Employees','Chapas Turbo':'Turbo Griddles','Marketing Global':'Global Marketing',
    'Estatísticas':'Statistics','Hambúrgueres Produzidos:':'Burgers Produced:','Cliques Totais:':'Total Clicks:','Tempo Jogado:':'Time Played:','Rebirths:':'Rebirths:','Próximo Rebirth:':'Next Rebirth:',
    'Fazer Rebirth':'Perform Rebirth','Fichas disponíveis:':'Available tokens:','Total de fichas conquistadas:':'Total tokens earned:','Multiplicador Global permanente:':'Permanent global multiplier:',
    'Reseta o progresso mas concede bônus permanentes e pode revelar um novo pet.':'Resets progress but grants permanent bonuses and may reveal a new pet.',
    'Loja de Prestígio':'Prestige Shop','Gaste fichas de prestígio em melhorias permanentes. O Rebirth continua reiniciando dinheiro, negócios, nível e upgrades comuns — as melhorias desta loja e o multiplicador conquistado permanecem.':'Spend prestige tokens on permanent upgrades. Rebirth still resets burgers, businesses, levels, and regular upgrades — upgrades from this shop and your earned multiplier remain.',
    'Saldo disponível:':'Available balance:','Conquistas':'Achievements','Menus do jogo':'Game menus','Áreas do Burger Clicker':'Burger Clicker sections',
    'Nível máximo':'Max level','Comprar':'Buy','Nível':'Level','Melhoria maximizada.':'Upgrade maxed out.','Nível atual:':'Current level:','Próximo nível custa':'Next level costs','fichas de prestígio.':'prestige tokens.',
    'Sem bônus':'No bonus','de produção global':'global production','de ganho de Rebirth':'Rebirth gains','de hambúrgueres por clique':'burgers per click','de produção offline':'offline production','de XP recebido':'XP gained','no custo de alimentação':'off feeding costs',
    'Nível ':'Level ',' min':' min','Pronto':'Ready','Restaurar':'Restore','Cancelar':'Cancel','Confirmar':'Confirm','Erro':'Error','Sucesso':'Success',

    '🍳 Grelha Dupla':'🍳 Double Grill','🍟 Fritadeira Turbo':'🍟 Turbo Fryer','🔥 Forno Industrial':'🔥 Industrial Oven','📦 Linha de Montagem':'📦 Assembly Line','🧑‍💼 Gerente de Turno':'🧑‍💼 Shift Manager','🏭 Cozinha Automatizada':'🏭 Automated Kitchen','🧪 Laboratório de Sabores':'🧪 Flavor Lab','🌐 Rede Nacional':'🌐 National Network','✈️ Franquia Internacional':'✈️ International Franchise','🏗️ Megafábrica Automatizada':'🏗️ Automated Megafactory','🛰️ Cozinha Orbital':'🛰️ Orbital Kitchen','🌀 Portal Gastronômico':'🌀 Gastronomic Portal','🌌 Império Multiversal':'🌌 Multiverse Empire','💫 Singularidade Burger':'💫 Burger Singularity',
    '🖱️ Clique Crocante':'🖱️ Crunchy Click','👆 Clique Gigante':'👆 Giant Click','💥 Clique Supremo':'💥 Supreme Click','⚡ Produção Turbo':'⚡ Turbo Production','🏭 Superfábrica':'🏭 Superfactory','🌎 Expansão de Franquias':'🌎 Franchise Expansion','📚 Academia Burger':'📚 Burger Academy','🎓 Universidade Burger':'🎓 Burger University','🤝 Negociação em Massa':'🤝 Bulk Negotiation','📜 Contratos Globais':'📜 Global Contracts','🧠 Engenharia do Clique':'🧠 Click Engineering','⚛️ Clique Quântico':'⚛️ Quantum Click','🚀 Reatores de Produção':'🚀 Production Reactors','🌋 Núcleo de Antimatéria':'🌋 Antimatter Core','🧬 Instituto de Evolução':'🧬 Evolution Institute','🪐 Conhecimento Cósmico':'🪐 Cosmic Knowledge','💹 Mercado de Futuros':'💹 Futures Market','⭐ Catalisador de Renascimento':'⭐ Rebirth Catalyst','🌠 Ciclo Eterno':'🌠 Eternal Cycle',
    '🥬 Primeiro lote':'🥬 First Batch','Produza':'Produce','hambúrgueres':'burgers','hambúrguer':'burger','no total.':'in total.','hoje.':'today.','🛎️ Atendimento rápido':'🛎️ Fast Service','🔥 Hora de pico':'🔥 Rush Hour',
    'Produção':'Production','Desconto em negócios':'Business discount','Clique':'Click','Rebirth':'Rebirth','XP recebida':'XP gained','Negócios custam':'Businesses cost','menos.':'less.','de produção por unidade.':'production per unit.','de força do clique.':'click power.','de produção automática.':'automatic production.','de XP recebida.':'XP gained.','de fichas de Rebirth recebidas.':'Rebirth tokens earned.',
    'Porco':'Pig','Vaca':'Cow','Caranguejo':'Crab','Papagaio':'Parrot','Cachorro':'Dog','Gato':'Cat','Rato':'Mouse','Hamster':'Hamster','Coelho':'Rabbit','Raposa':'Fox','Urso':'Bear','Panda':'Panda','Coala':'Koala','Tigre':'Tiger','Leão':'Lion','Vaca malhada':'Spotted Cow','Focinho de porco':'Pig Snout','Sapo':'Frog','Macaco':'Monkey','Gorila':'Gorilla','Orangotango':'Orangutan','Galinha':'Chicken','Pinguim':'Penguin','Pintinho':'Chick','Pato':'Duck','Águia':'Eagle','Coruja':'Owl','Morcego':'Bat','Lobo':'Wolf','Javali':'Wild Boar','Cavalo':'Horse','Unicórnio':'Unicorn','Abelha':'Bee','Lagarta':'Caterpillar','Borboleta':'Butterfly','Caracol':'Snail','Joaninha':'Ladybug','Formiga':'Ant','Aranha':'Spider','Escorpião':'Scorpion','Tartaruga':'Turtle','Cobra':'Snake','Lagarto':'Lizard','Dinossauro':'Dinosaur','Polvo':'Octopus','Lula':'Squid','Camarão':'Shrimp','Lagosta':'Lobster','Baleia':'Whale','Golfinho':'Dolphin','Peixe':'Fish','Peixe tropical':'Tropical Fish','Baiacu':'Pufferfish','Tubarão':'Shark','Foca':'Seal','Crocodilo':'Crocodile','Elefante':'Elephant','Mamute':'Mammoth','Rinoceronte':'Rhinoceros','Hipopótamo':'Hippopotamus','Girafa':'Giraffe','Zebra':'Zebra','Camelo':'Camel','Dromedário':'Dromedary','Lhama':'Llama','Bode':'Goat','Ovelha':'Sheep','Carneiro':'Ram','Veado':'Deer','Bisão':'Bison','Esquilo':'Squirrel','Castor':'Beaver','Lontra':'Otter','Guaxinim':'Raccoon','Cangambá':'Skunk','Texugo':'Badger','Cisne':'Swan','Flamingo':'Flamingo','Pavão':'Peacock','Dodô':'Dodo','Pena misteriosa':'Mysterious Feather','Asa mágica':'Magic Wing','Água-viva':'Jellyfish',
    'Nível de alimentação:':'Feeding level:','Nível de ':'Feeding level: ','Custo para alimentar':'Feeding cost','Recompensa':'Reward','Nível atual':'Current level','Produção real':'Actual production','Produção total':'Total production','hambúrgueres por clique':'burgers per click','produzidos':'produced','Fichas':'Tokens','Bônus':'Bonus','bônus':'bonus','Desbloqueado':'Unlocked','Bloqueado':'Locked','Concluído':'Completed','Concluída':'Completed','Conquista':'Achievement','Recompensa de conquista':'Achievement reward','Requisito':'Requirement','Requisitos':'Requirements','Contrato diário':'Daily contract','Contratos diários':'Daily contracts','Resgatar':'Claim','Resgatado':'Claimed','Disponível':'Available','Indisponível':'Unavailable','Progresso':'Progress','Faltam':'Remaining','Restantes':'remaining','Você precisa de':'You need','Você ganhou':'You earned','Você recebeu':'You received','Não foi possível':'Could not','foi salvo':'was saved','foi restaurado':'was restored','foi criado':'was created','Arquivo inválido':'Invalid file','Backup restaurado':'Backup restored','Backup criado':'Backup created','Falha ao':'Failed to','Atenção':'Warning','Pronto para':'Ready to','Carregando':'Loading','Resetando...':'Resetting...'

    'Arte 1':'Artwork 1','Arte 2':'Artwork 2','Sobre o jogo':'About the game','Política de Privacidade':'Privacy Policy','Última atualização: outubro de 2026 · Burger Clicker v1.0':'Last updated: October 2026 · Burger Clicker v1.0'
  };
  const ptPT = {
    'Principal':'Principal','Sobre':'Sobre','Privacidade':'Privacidade','Contato':'Contacto','Configurações':'Definições',
    'Abrir configurações':'Abrir definições','Fechar configurações':'Fechar definições','Menu de configurações':'Menu de definições',
    'Personalize sua experiência no Burger Clicker. As opções ficam salvas neste dispositivo.':'Personalize a sua experiência no Burger Clicker. As opções ficam guardadas neste dispositivo.',
    'Experiência':'Experiência','Som dos efeitos':'Som dos efeitos','Música de fundo':'Música de fundo','Tema escuro':'Tema escuro',
    'Resetar todo o progresso':'Repor todo o progresso','Instalar aplicativo':'Instalar aplicação','Abrir app':'Abrir aplicação',
    'Verificando disponibilidade da instalação...':'A verificar a disponibilidade da instalação...',
    'Bem-vindo de volta! Confira as novidades antes de começar a sua fábrica de hambúrgueres.':'Bem-vindo de volta! Consulte as novidades antes de começar a sua fábrica de hambúrgueres.',
    'Seu restaurante':'O seu restaurante','Seu Pet':'O seu animal de estimação','Nenhum pet equipado':'Nenhum animal de estimação equipado',
    'Faça Rebirth para tentar encontrar seu primeiro pet!':'Faça um Rebirth para tentar encontrar o seu primeiro animal de estimação!',
    'Nome personalizado do pet equipado':'Nome personalizado do animal de estimação equipado','Salvar nome':'Guardar nome',
    'Trocar pet equipado':'Trocar o animal de estimação equipado','Nenhum pet disponível':'Nenhum animal de estimação disponível',
    'Equipar':'Equipar','Recompensa:':'Recompensa:','Custo para alimentar:':'Custo para alimentar:',
    'Alimentar e evoluir':'Alimentar e evoluir','Coleção de pets':'Coleção de animais de estimação',
    'Pets novos podem ser encontrados ao fazer Rebirth. Cada descoberta é aleatória e não repete um pet que você já possui. Dê um nome, equipe outro pet quando quiser e alimente-o para aumentar sua recompensa sem limite.':'Pode descobrir novos animais de estimação ao fazer Rebirth. Cada descoberta é aleatória e não repete um animal que já possui. Dê-lhe um nome, equipe outro quando quiser e alimente-o para aumentar a recompensa sem limite.',
    'Loja':'Loja','Funcionário':'Funcionário','Possui:':'Possui:','Custo:':'Custo:','Lanchonete':'Hamburgueria',
    'Estatísticas':'Estatísticas','Hambúrgueres Produzidos:':'Hambúrgueres produzidos:','Cliques Totais:':'Total de cliques:',
    'Tempo Jogado:':'Tempo de jogo:','Próximo Rebirth:':'Próximo Rebirth:','Fazer Rebirth':'Fazer Rebirth',
    'Fichas disponíveis:':'Fichas disponíveis:','Total de fichas conquistadas:':'Total de fichas obtidas:',
    'Reseta o progresso mas concede bônus permanentes e pode revelar um novo pet.':'Repõe o progresso, mas concede bónus permanentes e pode revelar um novo animal de estimação.',
    'Menus do jogo':'Menus do jogo','Nível máximo':'Nível máximo','Comprar':'Comprar','Nível atual:':'Nível atual:',
    'Pronto para diagnosticar.':'Pronto para executar o diagnóstico.','Aplicativo':'Aplicação'
  };

  const phrases = language === 'en-US' ? en : language === 'pt-PT' ? ptPT : {};
  const entries = Object.entries(phrases).sort((a,b)=>b[0].length-a[0].length);
  function translateText(value) {
    if (!value || !value.trim()) return value;
    let result = value;
    for (const [from,to] of entries) {
      if (result.includes(from)) result = result.split(from).join(to);
    }
    return result;
  }
  const originalText = new WeakMap();
  const lastAppliedText = new WeakMap();
  const originalAttributes = new WeakMap();
  let writingTranslation = false;
  function translateElement(el) {
    if (!(el instanceof Element)) return;
    let savedAttributes = originalAttributes.get(el);
    if (!savedAttributes) { savedAttributes = {}; originalAttributes.set(el, savedAttributes); }
    for (const attr of ['aria-label','title','placeholder','alt']) {
      if (el.hasAttribute(attr)) {
        if (!(attr in savedAttributes)) savedAttributes[attr] = el.getAttribute(attr);
        const original = savedAttributes[attr];
        const translated = translateText(original);
        if (translated !== el.getAttribute(attr)) el.setAttribute(attr, translated);
      }
    }
    if (el.hasAttribute('data-i18n')) return;
    if (el.matches('script,style,textarea, input[type="text"], input[type="file"]')) return;
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        const translated = translateText(originalText.get(node));
        if (translated !== node.nodeValue) {
          writingTranslation = true;
          lastAppliedText.set(node, translated);
          node.nodeValue = translated;
          writingTranslation = false;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
    }
  }
  function apply(nextLanguage) {
    language = supported.has(nextLanguage) ? nextLanguage : DEFAULT_LANGUAGE;
    document.documentElement.lang = language;
    translateElement(document.body);
  }
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData' && record.target.nodeType === Node.TEXT_NODE && !writingTranslation) {
        const node = record.target;
        const value = node.nodeValue;
        if (lastAppliedText.has(node) && lastAppliedText.get(node) === value) continue;
        originalText.set(node, value);
        const translated = translateText(value);
        if (translated !== value) {
          writingTranslation = true;
          lastAppliedText.set(node, translated);
          node.nodeValue = translated;
          writingTranslation = false;
        } else {
          lastAppliedText.delete(node);
        }
      }
      record.addedNodes?.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
        else if (node.nodeType === Node.TEXT_NODE) {
          originalText.set(node, node.nodeValue);
          const translated = translateText(node.nodeValue);
          if (translated !== node.nodeValue) {
            writingTranslation = true;
            lastAppliedText.set(node, translated);
            node.nodeValue = translated;
            writingTranslation = false;
          }
        }
      });
    }
  });
  function init() {
    apply(language);
    observer.observe(document.body, {subtree:true,childList:true,characterData:true});
    const select = document.getElementById('languageSelector');
    if (select) select.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEY, select.value);
      apply(select.value);
    });
    window.BurgerClickerI18n = {setLanguage:apply,getLanguage:()=>language,translate:translateText};
  }
  document.addEventListener('burgerclicker:languagechange', event => apply(event.detail));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();