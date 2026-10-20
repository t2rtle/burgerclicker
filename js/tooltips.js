
(() => {
    "use strict";

    // Evita inicializar o sistema duas vezes.
    if (window.__burgerTooltipsInitialized) return;
    window.__burgerTooltipsInitialized = true;

    const INTERVALO_ATUALIZACAO = 150;
    const MAXIMO_TEXTO_DINAMICO = 180;

    const dicasPorId = {
        burgerBtn: ["Produzir hambúrgueres", "Clique para ganhar hambúrgueres manualmente."],
        contador: ["Seu saldo", "Mostra quantos hambúrgueres você tem disponíveis para gastar."],
        pps: ["Produção automática", "Quantidade de hambúrgueres produzidos automaticamente por segundo."],
        nivel: ["Nível do jogador", "Suba de nível acumulando experiência ao jogar."],
        xp: ["Experiência", "Acompanhe sua experiência atual e quanto falta para o próximo nível."],
        petAtivoCard: ["Pet equipado", "Veja o companheiro ativo e o bônus que ele oferece."],
        petAtivoEmoji: ["Seu pet", "Este é o animal que está equipado no momento."],
        petAtivoNome: ["Nome do pet", "Mostra o nome personalizado do seu companheiro."],
        petAtivoBonus: ["Bônus do pet", "Veja o efeito que este pet adiciona ao seu jogo."],
        petNomeInput: ["Nome personalizado", "Digite o novo nome do pet equipado e depois salve."],
        petSalvarNomeBtn: ["Salvar nome", "Salva o nome personalizado do pet equipado."],
        petSelecionar: ["Escolher pet", "Selecione um dos pets que você já descobriu."],
        petEquiparBtn: ["Equipar pet", "Troca seu companheiro ativo pelo pet selecionado."],
        petNivel: ["Nível de alimentação", "Mostra quantas vezes o pet já foi alimentado."],
        petRecompensa: ["Recompensa do pet", "Mostra o bônus atual concedido pelo pet equipado."],
        petCusto: ["Custo de alimentação", "Mostra quantos hambúrgueres são necessários para a próxima alimentação."],
        petAlimentarBtn: ["Alimentar e evoluir", "Gaste hambúrgueres para aumentar permanentemente o bônus deste pet."],
        petQuantidade: ["Coleção de pets", "Quantidade de animais descobertos em relação ao total disponível."],
        petColecao: ["Seus pets descobertos", "Consulte os animais que você possui, seus bônus e equipe outro companheiro."],
        funcionarioBtn: ["Funcionário", "Contrate funcionários para aumentar sua produção automática."],
        chapaBtn: ["Chapa Industrial", "Compre chapas industriais para ampliar a produção de hambúrgueres."],
        foodTruckBtn: ["Food Truck", "Adquira food trucks para gerar ainda mais hambúrgueres automaticamente."],
        lanchoneteBtn: ["Lanchonete", "Construa lanchonetes para expandir seu negócio e sua produção."],
        franquiaBtn: ["Franquia", "Invista em franquias para impulsionar sua produção automática."],
        upgradeClique2xBtn: ["Clique Duplo", "Melhora a quantidade de hambúrgueres recebida por clique."],
        upgradeClique5xBtn: ["Clique Mestre", "Aprimora ainda mais o poder dos seus cliques."],
        upgradeFuncionarioBtn: ["Funcionários Motivados", "Aumenta a eficiência dos funcionários contratados."],
        upgradeChapaBtn: ["Chapas Turbo", "Melhora a produção das chapas industriais."],
        upgradeGlobalBtn: ["Marketing Global", "Aumenta a produção global do seu império de hambúrgueres."],
        estatTotal: ["Hambúrgueres produzidos", "Total acumulado de hambúrgueres produzidos durante sua partida."],
        estatCliques: ["Cliques totais", "Quantidade de vezes que você clicou para produzir hambúrgueres."],
        estatTempo: ["Tempo jogado", "Tempo total registrado de jogo."],
        estatRebirth: ["Rebirths realizados", "Número de renascimentos feitos durante sua jornada."],
        requisitoRebirth: ["Próximo Rebirth", "Mostra a meta de hambúrgueres necessária para fazer outro Rebirth."],
        rebirthBtn: ["Fazer Rebirth", "Reinicie parte do progresso para receber benefícios permanentes e tentar descobrir um pet novo."],
        prestigeTokens: ["Fichas disponíveis", "Fichas que você ainda pode gastar na Loja de Prestígio."],
        prestigeTokensEarned: ["Total de fichas conquistadas", "Todas as fichas recebidas em Rebirths. Esse total não diminui quando você compra melhorias e mantém o multiplicador permanente."],
        prestigeBonus: ["Multiplicador global", "Bônus permanente que aumenta seus ganhos. Esse multiplicador é calculado com todas as fichas conquistadas, mesmo as que você gastar na loja."],
        prestigeShopTitle: ["Loja de Prestígio", "Troque fichas de prestígio por melhorias permanentes. Os níveis comprados não são apagados pelo Rebirth."],
        prestigeShopSaldo: ["Fichas disponíveis", "Saldo de fichas que você ainda pode gastar. O bônus permanente é baseado no total de fichas conquistadas, não neste saldo."],
        prestigeShop: ["Melhorias permanentes", "Cada melhoria tem níveis, custo crescente e um limite máximo. Todas sobrevivem ao Rebirth."],
        listaConquistas: ["Conquistas", "Acompanhe os desafios concluídos e os marcos alcançados durante sua partida."],
        petTitulo: ["Sistema de pets", "Descubra animais com Rebirth, personalize seus nomes e aumente seus bônus alimentando-os."]
    };

    /* =====================================================
       DESCRIÇÕES INDIVIDUAIS DAS CONQUISTAS
    ===================================================== */

    const dicasConquistas = {
        "Primeiro Hambúrguer": [
            "🏆 Primeiro Hambúrguer",
            "Como desbloquear: produza pelo menos 1 hambúrguer no total. " +
            "Efeito: registra seu primeiro marco no jogo. " +
            "Não concede bônus extra diretamente."
        ],

        "Chapeiro": [
            "🏆 Chapeiro",
            "Como desbloquear: produza pelo menos 100 hambúrgueres no total. " +
            "Efeito: registra seu progresso de produção. " +
            "Não concede bônus extra diretamente."
        ],

        "Magnata Burger": [
            "🏆 Magnata Burger",
            "Como desbloquear: produza pelo menos 10.000 hambúrgueres no total. " +
            "Efeito: registra esse marco de produção. " +
            "Não concede bônus extra diretamente."
        ],

        "Milionário do Hambúrguer": [
            "🏆 Milionário do Hambúrguer",
            "Como desbloquear: produza pelo menos 1.000.000 de hambúrgueres no total. " +
            "Efeito: registra sua marca de produção milionária. " +
            "Não concede bônus extra diretamente."
        ],

        "Dedo de Ouro": [
            "🏆 Dedo de Ouro",
            "Como desbloquear: alcance pelo menos 100 cliques totais. " +
            "Efeito: registra seu marco de cliques. " +
            "Não concede bônus extra diretamente."
        ],

        "Mestre do Clique": [
            "🏆 Mestre do Clique",
            "Como desbloquear: alcance pelo menos 1.000 cliques totais. " +
            "Efeito: registra sua dedicação aos cliques. " +
            "Não concede bônus extra diretamente."
        ],

        "Chefe de Equipe": [
            "🏆 Chefe de Equipe",
            "Como desbloquear: tenha pelo menos 10 funcionários. " +
            "Efeito: registra o tamanho da sua equipe. " +
            "Os funcionários contribuem para a produção automática, mas a conquista em si não adiciona um bônus extra."
        ],

        "Mestre da Chapa": [
            "🏆 Mestre da Chapa",
            "Como desbloquear: tenha pelo menos 10 chapas industriais. " +
            "Efeito: registra sua expansão de produção. " +
            "As chapas contribuem para a produção conforme as regras do jogo, mas a conquista em si não adiciona um bônus extra."
        ],

        "Primeiro Food Truck": [
            "🏆 Primeiro Food Truck",
            "Como desbloquear: adquira pelo menos 1 Food Truck. " +
            "Efeito: registra sua primeira expansão móvel. " +
            "Não concede bônus extra diretamente."
        ],

        "Dono de Lanchonete": [
            "🏆 Dono de Lanchonete",
            "Como desbloquear: adquira pelo menos 1 lanchonete. " +
            "Efeito: registra a aquisição do seu estabelecimento. " +
            "Não concede bônus extra diretamente."
        ],

        "Empresário Global": [
            "🏆 Empresário Global",
            "Como desbloquear: adquira pelo menos 1 franquia. " +
            "Efeito: registra seu marco empresarial. " +
            "Não concede bônus extra diretamente."
        ],

        "Recomeço": [
            "🏆 Recomeço",
            "Como desbloquear: realize pelo menos 1 Rebirth. " +
            "Efeito: registra seu primeiro renascimento. " +
            "O Rebirth possui seus próprios benefícios permanentes; a conquista não concede bônus adicional."
        ],

        "Magnata Renascido": [
            "🏆 Magnata Renascido",
            "Como desbloquear: realize pelo menos 5 Rebirths. " +
            "Efeito: registra seu progresso em renascimentos. " +
            "Não concede bônus extra diretamente."
        ],

        "Melhor Amigo": [
            "🏆 Melhor Amigo",
            "Como desbloquear: obtenha pelo menos 1 pet. " +
            "Efeito: registra sua primeira aquisição de pet. " +
            "Os pets podem oferecer bônus conforme suas próprias mecânicas, mas a conquista não adiciona um bônus extra."
        ],

        "Colecionador de Pets": [
            "🏆 Colecionador de Pets",
            "Como desbloquear: tenha pelo menos 10 pets na coleção. " +
            "Efeito: registra seu progresso como colecionador. " +
            "Não concede bônus extra diretamente."
        ],

        "Arca do Burger": [
            "🏆 Arca do Burger",
            "Como desbloquear: obtenha todos os pets disponíveis no catálogo do jogo. " +
            "Efeito: registra a conclusão da coleção. " +
            "Não concede bônus extra diretamente."
        ]
    };

    const dicasPorTexto = [
        [/^🍔\s*Burger Clicker/i, ["Burger Clicker", "Construa seu império produzindo hambúrgueres e melhorando seu negócio."]],
        [/^🏪\s*Loja/i, ["Loja", "Compre negócios e contrate funcionários para gerar hambúrgueres automaticamente."]],
        [/^⬆️\s*Upgrades/i, ["Upgrades", "Adquira melhorias para fortalecer cliques, negócios e produção global."]],
        [/^📊\s*Estatísticas/i, ["Estatísticas", "Confira os números e o progresso da sua partida."]],
        [/^⭐\s*Rebirth/i, ["Rebirth", "Troque parte do progresso atual por bônus permanentes e novas possibilidades."]],
        [/^🏆\s*Conquistas/i, ["Conquistas", "Desbloqueie marcos especiais enquanto avança no jogo."]],
        [/^🐾\s*Seu Pet/i, ["Seu pet", "Gerencie seu companheiro, troque seu nome e melhore seu bônus."]],
        [/^📚\s*Coleção de pets/i, ["Coleção de pets", "Descubra animais novos fazendo Rebirth e complete sua coleção."]],
        [/^Desenvolvido|^Por Crabscary/i, ["Créditos do jogo", "Informações sobre a criação e a versão do Burger Clicker."]]
    ];

    const seletores = [
        "button", "input", "select", "textarea", "img",
        "h1", "h2", "h3", "h4", "label", "p",
        ".painel", ".loja", ".upgrades", ".estatisticas",
        ".prestige", ".conquistas", ".painel-pets",
        ".pet-ativo-card", ".pet-card",
        "#listaConquistas > *", "span[id]"
    ].join(",");

    let tooltip = null;
    let alvoAtual = null;

    let mouseX = 0;
    let mouseY = 0;

    // mouse: segue o cursor.
    // elemento: acompanha o elemento durante scroll e foco por teclado/toque.
    let modoPosicao = "mouse";
    let tipoPonteiro = "mouse";

    let ultimaDescricao = "";
    let rafPendente = false;
    let intervaloAtualizacao = null;
    let observador = null;

    /* =====================================================
       FUNÇÕES AUXILIARES
    ===================================================== */

    function textoLimpo(el) {
        if (!(el instanceof Element)) return "";

        return (el.innerText || el.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function limitarTexto(texto, limite = MAXIMO_TEXTO_DINAMICO) {
        if (texto.length <= limite) return texto;

        return texto.slice(0, limite).trimEnd() + "…";
    }

    function obterConteudoAtual(el) {
        if (!(el instanceof Element)) return "";

        if (el.matches("input, textarea")) {
            if (el.type === "password") return "";

            return String(el.value || "").trim();
        }

        if (el.matches("select")) {
            const opcao = el.selectedOptions && el.selectedOptions[0];

            return opcao
                ? String(opcao.textContent || "").trim()
                : "";
        }

        return textoLimpo(el);
    }

    function descricaoComValorAtual(el, descricaoBase) {
        const descricao = String(descricaoBase || "").trim();

        if (!(el instanceof Element)) return descricao;

        // Não adiciona o texto completo de uma lista de conquistas.
        if (el.matches("#listaConquistas > *")) {
            return descricao;
        }

        // Inputs e seletores: apresenta o valor escolhido/digitado.
        // Outros elementos: apresenta seu texto visível atualizado.
        const atual = obterConteudoAtual(el);

        if (!atual) return descricao;

        const conteudo = limitarTexto(atual);

        // Evita repetir a mesma informação.
        if (
            descricao === atual ||
            descricao.includes("Conteúdo atual: " + conteudo)
        ) {
            return descricao;
        }

        return descricao
            ? descricao + "\n\nConteúdo atual: " + conteudo
            : "Conteúdo atual: " + conteudo;
    }

    function elementoElegivel(el) {
        if (!(el instanceof Element)) return false;

        if (el.id === "burgerTooltip") return false;
        if (el.closest("#burgerTooltip")) return false;

        if (el.matches("script,style,link,meta,title,head,noscript")) {
            return false;
        }

        return true;
    }

    function alvoVisivel(el) {
        if (!(el instanceof Element) || !el.isConnected) return false;

        const r = el.getBoundingClientRect();

        return (
            r.width > 0 &&
            r.height > 0 &&
            r.bottom > 0 &&
            r.right > 0 &&
            r.top < window.innerHeight &&
            r.left < window.innerWidth
        );
    }

    function obterDimensoesTela() {
        return {
            largura: document.documentElement.clientWidth || window.innerWidth,
            altura: document.documentElement.clientHeight || window.innerHeight
        };
    }

    function limitar(valor, minimo, maximo) {
        return Math.max(minimo, Math.min(valor, maximo));
    }

    /* =====================================================
       IDENTIFICAÇÃO DAS CONQUISTAS
    ===================================================== */

    function obterNomeConquista(el) {
        return textoLimpo(el)
            .replace(/^🏆\s*/, "")
            .trim();
    }

    /* =====================================================
       DESCOBERTA DA DICA DO ELEMENTO
    ===================================================== */

    function dicaDoElemento(el) {
        if (!(el instanceof Element)) return null;

        // Preserva dicas personalizadas diretamente no HTML.
        // Dicas geradas pelo próprio script podem ser recalculadas.
        if (
            el.dataset.tooltip &&
            el.dataset.tooltipAuto !== "true"
        ) {
            return [
                el.dataset.tooltipTitle || "Informação",
                el.dataset.tooltip
            ];
        }

        if (el.id && dicasPorId[el.id]) {
            return dicasPorId[el.id];
        }

        if (el.matches("img")) {
            const alt = el.getAttribute("alt") || "Ilustração do jogo";

            if (alt === "Arte 1") {
                return [
                    "Ilustração do Burger Clicker",
                    "Arte decorativa que compõe o visual desta seção do jogo."
                ];
            }

            if (alt === "Arte 2") {
                return [
                    "Ilustração da loja",
                    "Imagem decorativa da área onde você compra negócios e melhorias."
                ];
            }

            return [
                alt,
                "Imagem ilustrativa do Burger Clicker."
            ];
        }

        if (el.matches("button")) {
            const t = textoLimpo(el)
                .replace(/\d[\d.,]*/g, "número")
                .slice(0, 80);

            if (/Equipar/i.test(t)) return dicasPorId.petEquiparBtn;
            if (/Alimentar/i.test(t)) return dicasPorId.petAlimentarBtn;
            if (/Salvar nome/i.test(t)) return dicasPorId.petSalvarNomeBtn;
            if (/Funcionário/i.test(t)) return dicasPorId.funcionarioBtn;
            if (/Chapa Industrial/i.test(t)) return dicasPorId.chapaBtn;
            if (/Food Truck/i.test(t)) return dicasPorId.foodTruckBtn;
            if (/Lanchonete/i.test(t)) return dicasPorId.lanchoneteBtn;
            if (/Franquia/i.test(t)) return dicasPorId.franquiaBtn;
            if (/Clique Duplo/i.test(t)) return dicasPorId.upgradeClique2xBtn;
            if (/Clique Mestre/i.test(t)) return dicasPorId.upgradeClique5xBtn;
            if (/Funcionários Motivados/i.test(t)) return dicasPorId.upgradeFuncionarioBtn;
            if (/Chapas Turbo/i.test(t)) return dicasPorId.upgradeChapaBtn;
            if (/Marketing Global/i.test(t)) return dicasPorId.upgradeGlobalBtn;

            return [
                t || "Botão",
                "Clique para usar esta opção do jogo."
            ];
        }

        if (el.matches("input")) {
            if (el.id && dicasPorId[el.id]) {
                return dicasPorId[el.id];
            }

            return [
                el.placeholder || "Campo de texto",
                "Digite ou edite esta informação."
            ];
        }

        if (el.matches("textarea")) {
            return [
                el.placeholder || "Campo de texto",
                "Digite ou edite esta informação."
            ];
        }

        if (el.matches("select")) {
            if (el.id && dicasPorId[el.id]) {
                return dicasPorId[el.id];
            }

            return [
                "Lista de opções",
                "Abra a lista e escolha a opção desejada."
            ];
        }

        if (el.matches("label")) {
            return [
                textoLimpo(el) || "Campo",
                "Este texto identifica a opção ou o campo relacionado."
            ];
        }

        if (el.matches(".pet-card")) {
            return [
                "Pet da coleção",
                "Veja o nome, o bônus e o nível deste animal; use o botão para equipá-lo."
            ];
        }

        if (el.matches("#listaConquistas > *")) {
            const nome = obterNomeConquista(el);

            if (dicasConquistas[nome]) {
                return dicasConquistas[nome];
            }

            return [
                "🏆 " + (nome || "Conquista"),
                "Esta conquista registra um marco do seu progresso. " +
                "Consulte o nome para identificar o desafio concluído. " +
                "Não há bônus extra definido para esta conquista."
            ];
        }

        const txt = textoLimpo(el);

        if (txt) {
            for (const [regex, dica] of dicasPorTexto) {
                if (regex.test(txt)) return dica;
            }

            if (el.matches("h1,h2,h3,h4")) {
                return [
                    txt.slice(0, 70),
                    "Título desta área do Burger Clicker."
                ];
            }

            if (el.matches("p")) {
                return [
                    txt.slice(0, 70),
                    "Informação e instruções sobre esta parte do jogo."
                ];
            }

            if (el.matches("span[id]")) {
                return [
                    txt.slice(0, 70),
                    "Valor atualizado que acompanha seu progresso no jogo."
                ];
            }

            if (
                el.matches(
                    ".painel,.loja,.upgrades,.estatisticas," +
                    ".prestige,.conquistas,.painel-pets"
                )
            ) {
                return [
                    txt.slice(0, 70),
                    "Área do jogo com informações e opções relacionadas."
                ];
            }
        }

        return null;
    }

    function prepararElemento(el) {
        if (!(el instanceof Element)) return;

        // Nunca substitui uma tooltip escrita manualmente no HTML.
        if (
            el.dataset.tooltip &&
            el.dataset.tooltipAuto !== "true"
        ) {
            return;
        }

        const dica = dicaDoElemento(el);

        if (!dica) return;

        el.dataset.tooltipTitle = dica[0];
        el.dataset.tooltip = dica[1];
        el.dataset.tooltipAuto = "true";

        if (
            !el.hasAttribute("aria-label") &&
            el.matches("button,img,input,select")
        ) {
            el.setAttribute(
                "aria-label",
                dica[0] + ". " + dica[1]
            );
        }
    }

    function prepararTodos(raiz = document) {
        if (raiz instanceof Element) {
            prepararElemento(raiz);
        }

        if (raiz.querySelectorAll) {
            raiz.querySelectorAll(seletores).forEach(prepararElemento);
        }
    }

    /* =====================================================
       CRIAÇÃO E CONTEÚDO DA TOOLTIP
    ===================================================== */

    function criarTooltip() {
        let elemento = document.getElementById("burgerTooltip");

        if (!elemento) {
            elemento = document.createElement("div");
            elemento.id = "burgerTooltip";
            elemento.setAttribute("role", "tooltip");
            elemento.setAttribute("aria-hidden", "true");
            document.body.appendChild(elemento);
        }

        // Mantém o posicionamento independente de backgrounds,
        // painéis e outros elementos que possam criar contextos visuais.
        Object.assign(elemento.style, {
            position: "fixed",
            zIndex: "2147483647",
            boxSizing: "border-box",
            pointerEvents: "none",
            right: "auto",
            bottom: "auto"
        });

        return elemento;
    }

    function renderizarConteudo(titulo, descricao) {
        if (!tooltip) return;

        const chave = titulo + "\n" + descricao;

        if (chave === ultimaDescricao) return;

        const elementoTitulo = document.createElement("span");
        elementoTitulo.className = "tooltip-titulo";
        elementoTitulo.textContent = titulo;

        const elementoDescricao = document.createElement("span");
        elementoDescricao.className = "tooltip-descricao";
        elementoDescricao.textContent = descricao;

        tooltip.replaceChildren(elementoTitulo, elementoDescricao);

        ultimaDescricao = chave;
    }

    /* =====================================================
       POSICIONAMENTO DA TOOLTIP
    ===================================================== */

    function posicionar() {
        if (!tooltip || !alvoAtual) return;
        if (tooltip.style.display === "none") return;

        const margem = 8;
        const distancia = 18;
        const tela = obterDimensoesTela();

        const rectTooltip = tooltip.getBoundingClientRect();
        const largura = rectTooltip.width;
        const altura = rectTooltip.height;

        let ancoraX = mouseX;
        let ancoraY = mouseY;

        if (modoPosicao === "elemento") {
            if (!alvoVisivel(alvoAtual)) {
                ocultar();
                return;
            }

            const r = alvoAtual.getBoundingClientRect();

            ancoraX = limitar(
                r.left + r.width / 2,
                margem,
                tela.largura - margem
            );

            ancoraY = limitar(
                r.bottom,
                margem,
                tela.altura - margem
            );
        }

        let x = ancoraX + distancia;
        let y = ancoraY + distancia;

        // Se não houver espaço à direita, tenta à esquerda.
        if (x + largura > tela.largura - margem) {
            x = ancoraX - largura - distancia;
        }

        // Se não houver espaço embaixo, tenta acima.
        if (y + altura > tela.altura - margem) {
            y = ancoraY - altura - distancia;
        }

        const maxX = Math.max(
            margem,
            tela.largura - largura - margem
        );

        const maxY = Math.max(
            margem,
            tela.altura - altura - margem
        );

        x = limitar(x, margem, maxX);
        y = limitar(y, margem, maxY);

        tooltip.style.left = `${Math.round(x)}px`;
        tooltip.style.top = `${Math.round(y)}px`;
    }

    function agendarPosicionamento() {
        if (rafPendente) return;

        rafPendente = true;

        requestAnimationFrame(() => {
            rafPendente = false;

            if (tooltip && alvoAtual) {
                posicionar();
            }
        });
    }

    /* =====================================================
       MOSTRAR, ATUALIZAR E ESCONDER
    ===================================================== */

    function mostrar(el, x, y, modo = "mouse") {
        if (!(el instanceof Element)) return;

        prepararElemento(el);

        const titulo = el.dataset.tooltipTitle;
        const descricaoBase = el.dataset.tooltip;

        if (!titulo || !descricaoBase) {
            ocultar();
            return;
        }

        alvoAtual = el;
        modoPosicao = modo;

        if (Number.isFinite(x)) mouseX = x;
        if (Number.isFinite(y)) mouseY = y;

        // CORREÇÃO: utiliza a descrição dinâmica, não apenas a descrição-base.
        const descricao = descricaoComValorAtual(el, descricaoBase);

        renderizarConteudo(titulo, descricao);

        tooltip.style.display = "block";
        tooltip.style.visibility = "hidden";
        tooltip.setAttribute("aria-hidden", "false");

        posicionar();

        tooltip.style.visibility = "visible";

        requestAnimationFrame(() => {
            if (!tooltip || !alvoAtual) return;

            tooltip.classList.add("visivel");
            posicionar();
        });
    }

    function atualizarConteudoAberto() {
        if (!alvoAtual || !tooltip) return;

        if (!alvoAtual.isConnected) {
            ocultar();
            return;
        }

        prepararElemento(alvoAtual);

        const titulo = alvoAtual.dataset.tooltipTitle;
        const descricaoBase = alvoAtual.dataset.tooltip;

        if (!titulo || !descricaoBase) {
            ocultar();
            return;
        }

        // Recalcula os valores atuais mesmo que o mouse esteja parado.
        const descricao = descricaoComValorAtual(
            alvoAtual,
            descricaoBase
        );

        renderizarConteudo(titulo, descricao);

        if (tooltip.style.display !== "none") {
            posicionar();
        }
    }

    function ocultar() {
        alvoAtual = null;
        ultimaDescricao = "";

        if (!tooltip) return;

        tooltip.classList.remove("visivel");
        tooltip.style.display = "none";
        tooltip.style.visibility = "hidden";
        tooltip.setAttribute("aria-hidden", "true");
    }

    function acharAlvo(node) {
        if (!(node instanceof Element)) return null;
        if (node.closest("#burgerTooltip")) return null;

        const el = node.closest(seletores);

        if (!el) return null;

        prepararElemento(el);

        return el.dataset.tooltip ? el : null;
    }

    /* =====================================================
       ATUALIZAÇÃO APÓS ROLAGEM
    ===================================================== */

    function atualizarAlvoAposScroll() {
        if (!alvoAtual) return;

        if (modoPosicao === "elemento") {
            if (!alvoVisivel(alvoAtual)) {
                ocultar();
                return;
            }

            agendarPosicionamento();
            return;
        }

        const elementoSobCursor = document.elementFromPoint(
            mouseX,
            mouseY
        );

        const novoAlvo = acharAlvo(elementoSobCursor);

        if (novoAlvo) {
            if (novoAlvo !== alvoAtual) {
                mostrar(novoAlvo, mouseX, mouseY, "mouse");
            } else {
                agendarPosicionamento();
            }
        } else {
            ocultar();
        }
    }

    /* =====================================================
       INICIALIZAÇÃO E EVENTOS
    ===================================================== */

    function iniciar() {
        tooltip = criarTooltip();

        prepararTodos();

        // Mouse e caneta.
        document.addEventListener("pointerover", event => {
            if (event.pointerType === "touch") return;

            tipoPonteiro = event.pointerType || "mouse";
            modoPosicao = "mouse";

            const el = acharAlvo(event.target);

            if (el) {
                mostrar(
                    el,
                    event.clientX,
                    event.clientY,
                    "mouse"
                );
            }
        }, true);

        document.addEventListener("pointermove", event => {
            if (event.pointerType === "touch") return;

            tipoPonteiro = event.pointerType || "mouse";

            mouseX = event.clientX;
            mouseY = event.clientY;

            const el = acharAlvo(event.target);

            if (el) {
                if (el !== alvoAtual || modoPosicao !== "mouse") {
                    mostrar(el, mouseX, mouseY, "mouse");
                } else {
                    agendarPosicionamento();
                }
            } else if (alvoAtual && modoPosicao === "mouse") {
                ocultar();
            }
        }, { capture: true, passive: true });

        document.addEventListener("pointerout", event => {
            if (event.pointerType === "touch") return;

            if (
                !event.relatedTarget &&
                alvoAtual &&
                modoPosicao === "mouse"
            ) {
                ocultar();
            }
        }, true);

        // Toque: posiciona a tooltip em relação ao elemento tocado.
        document.addEventListener("pointerdown", event => {
            if (event.pointerType !== "touch") return;

            tipoPonteiro = "touch";

            const el = acharAlvo(event.target);

            if (el) {
                mostrar(
                    el,
                    event.clientX,
                    event.clientY,
                    "elemento"
                );
            } else {
                ocultar();
            }
        }, { capture: true, passive: true });

        document.addEventListener("pointermove", event => {
            if (event.pointerType !== "touch") return;

            mouseX = event.clientX;
            mouseY = event.clientY;

            if (modoPosicao === "elemento" && alvoAtual) {
                agendarPosicionamento();
            }
        }, { capture: true, passive: true });

        // Teclado: acompanha o elemento que recebe foco.
        document.addEventListener("focusin", event => {
            const el = acharAlvo(event.target);

            if (!el) return;

            mostrar(el, 0, 0, "elemento");
        });

        document.addEventListener("focusout", event => {
            if (
                alvoAtual &&
                event.relatedTarget instanceof Node &&
                alvoAtual.contains(event.relatedTarget)
            ) {
                return;
            }

            ocultar();
        });

        window.addEventListener(
            "scroll",
            atualizarAlvoAposScroll,
            { capture: true, passive: true }
        );

        window.addEventListener("resize", () => {
            if (!alvoAtual) return;

            if (
                modoPosicao === "elemento" &&
                !alvoVisivel(alvoAtual)
            ) {
                ocultar();
                return;
            }

            agendarPosicionamento();
        }, { passive: true });

        window.addEventListener("blur", ocultar);

        window.addEventListener("focus", () => {
            if (modoPosicao === "mouse" && alvoAtual) {
                atualizarAlvoAposScroll();
            }
        });

        // Observa elementos e conquistas adicionados dinamicamente.
        observador = new MutationObserver(registros => {
            let atualizarAberta = false;

            for (const registro of registros) {
                if (registro.type === "childList") {
                    registro.addedNodes.forEach(node => {
                        if (!(node instanceof Element)) return;
                        if (node === tooltip || node.contains(tooltip)) return;

                        prepararTodos(node);
                    });
                }

                if (
                    alvoAtual &&
                    (
                        registro.target === alvoAtual ||
                        (
                            registro.target instanceof Node &&
                            alvoAtual.contains(registro.target)
                        )
                    )
                ) {
                    atualizarAberta = true;
                }
            }

            if (atualizarAberta) {
                atualizarConteudoAberto();
            }
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // CORREÇÃO PRINCIPAL:
        // Atualiza a descrição periodicamente, mesmo sem movimento do mouse.
        intervaloAtualizacao = window.setInterval(() => {
            if (alvoAtual) {
                atualizarConteudoAberto();
            }
        }, INTERVALO_ATUALIZACAO);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, {
            once: true
        });
    } else {
        iniciar();
    }
})();
