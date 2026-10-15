/* InterAuto - módulo de anúncios
   Guarda os anúncios no localStorage e desenha os cards.
   Usado pela página Vender (criar/excluir) e pela página Comprar (listar). */

const Anuncios = (() => {
  const CHAVE = "interauto:anuncios";

  /* ---------- armazenamento ---------- */

  function listar() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || [];
    } catch {
      return [];
    }
  }

  function salvarTodos(lista) {
    // pode lançar QuotaExceededError quando o localStorage enche
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  function adicionar(anuncio) {
    const lista = listar();
    lista.unshift(anuncio); // mais novo primeiro
    salvarTodos(lista);
  }

  function remover(id) {
    salvarTodos(listar().filter((a) => a.id !== id));
  }

  /* ---------- formatação ---------- */

  const brl = (n) =>
    Number(n).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });

  const km = (n) => Number(n).toLocaleString("pt-BR") + " Km";

  /* Cria elementos com textContent (nunca innerHTML), assim o que o
     vendedor digita não consegue injetar HTML na página. */
  function el(tag, props = {}, ...filhos) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else e.setAttribute(k, v);
    }
    filhos.forEach((f) => f && e.append(f));
    return e;
  }

  /* ---------- galeria do card ---------- */

  function criarGaleria(anuncio) {
    const fotos = anuncio.fotos;
    let atual = 0;

    const img = el("img", {
      src: fotos[0],
      alt: `${anuncio.marca} ${anuncio.modelo}`,
    });
    const caixa = el("div", { class: "galeria" }, img);

    if (fotos.length > 1) {
      const contador = el("span", {
        class: "galeria-contador",
        text: `1/${fotos.length}`,
      });

      const mudar = (passo) => {
        atual = (atual + passo + fotos.length) % fotos.length;
        img.src = fotos[atual];
        contador.textContent = `${atual + 1}/${fotos.length}`;
      };

      const anterior = el("button", {
        type: "button",
        class: "galeria-seta galeria-anterior",
        "aria-label": "Foto anterior",
        text: "‹",
      });
      const proxima = el("button", {
        type: "button",
        class: "galeria-seta galeria-proxima",
        "aria-label": "Próxima foto",
        text: "›",
      });
      anterior.addEventListener("click", () => mudar(-1));
      proxima.addEventListener("click", () => mudar(1));

      caixa.append(anterior, proxima, contador);
    }
    return caixa;
  }

  /* ---------- card ---------- */

  function criarCard(anuncio, { onRemover } = {}) {
    const preco = el("strong", { text: brl(anuncio.preco) });

    const info = el(
      "p",
      {},
      `${anuncio.ano} · ${km(anuncio.km)} · ${anuncio.combustivel}`,
      el("br"),
      preco,
      el("br"),
      el("span", { class: "card-cidade", text: anuncio.cidade }),
      el("br"),
      el("span", { class: "card-desc", text: anuncio.descricao || "" })
    );

    const detalhes = el("button", { type: "button", text: "Ver detalhes" });
    detalhes.addEventListener("click", () => abrirModal(anuncio));

    const card = el(
      "article",
      { class: "card" },
      criarGaleria(anuncio),
      el("h2", { text: `${anuncio.marca} ${anuncio.modelo}` }),
      info,
      detalhes
    );

    if (onRemover) {
      const excluir = el("button", {
        type: "button",
        class: "btn-excluir",
        text: "Excluir anúncio",
      });
      excluir.addEventListener("click", () => onRemover(anuncio.id));
      card.append(excluir);
    }
    return card;
  }

  /* ---------- modal de detalhes ---------- */

  let dialogo;

  function abrirModal(anuncio) {
    if (!dialogo) {
      dialogo = el("dialog", { class: "anuncio-modal" });
      // clicar fora da caixa fecha
      dialogo.addEventListener("click", (e) => {
        if (e.target === dialogo) dialogo.close();
      });
      document.body.append(dialogo);
    }
    dialogo.replaceChildren();

    const titulo = `${anuncio.marca} ${anuncio.modelo}`;
    const principal = el("img", {
      class: "modal-foto",
      src: anuncio.fotos[0],
      alt: titulo,
    });

    const miniaturas = el("div", { class: "modal-miniaturas" });
    anuncio.fotos.forEach((src, i) => {
      const b = el("button", {
        type: "button",
        "aria-label": `Ver foto ${i + 1}`,
      });
      b.append(el("img", { src, alt: "" }));
      b.addEventListener("click", () => (principal.src = src));
      miniaturas.append(b);
    });

    const ficha = el("dl", { class: "modal-ficha" });
    [
      ["Ano", anuncio.ano],
      ["Quilometragem", km(anuncio.km)],
      ["Combustível", anuncio.combustivel],
      ["Câmbio", anuncio.cambio],
      ["Cidade", anuncio.cidade],
    ]
      .filter(([, valor]) => valor) // ofertas fixas não têm câmbio/cidade
      .forEach(([rotulo, valor]) => {
        ficha.append(el("dt", { text: rotulo }), el("dd", { text: String(valor) }));
      });

    // Só mostra o botão de contato se o anúncio tiver WhatsApp
    let contato = null;
    if (anuncio.contato) {
      const digitos = anuncio.contato.replace(/\D/g, "");
      const numero = digitos.length >= 12 ? digitos : "55" + digitos;
      const mensagem = `Olá! Vi o anúncio do ${titulo} na InterAuto.`;
      contato = el("a", {
        class: "btn-contato",
        href: `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
        target: "_blank",
        rel: "noopener",
        text: "Falar com o vendedor",
      });
    }

    const fechar = el("button", {
      type: "button",
      class: "modal-fechar",
      "aria-label": "Fechar",
      text: "×",
    });
    fechar.addEventListener("click", () => dialogo.close());

    // append() escreveria a palavra "null" se recebesse null; por isso o filter
    dialogo.append(
      ...[
        fechar,
        principal,
        anuncio.fotos.length > 1 ? miniaturas : null,
        el("h2", { text: titulo }),
        el("p", { class: "modal-preco", text: brl(anuncio.preco) }),
        ficha,
        anuncio.descricao ? el("p", { class: "modal-desc", text: anuncio.descricao }) : null,
        contato,
      ].filter(Boolean)
    );
    dialogo.showModal();
  }

  /* ---------- ofertas fixas da home ---------- */

  /* Os cards de "Ofertas especiais" são escritos à mão no HTML.
     Esta função lê os dados do próprio card para abrir o mesmo modal. */
  function lerCardFixo(card) {
    const titulo = card.querySelector("h2").textContent.trim();
    const [marca, ...resto] = titulo.split(" ");
    const p = card.querySelector("p");
    const [ano, quilometragem, combustivel] = p.firstChild.textContent
      .split("·")
      .map((s) => s.trim());

    return {
      marca,
      modelo: resto.join(" "),
      ano,
      km: parseInt(quilometragem.replace(/\D/g, ""), 10),
      combustivel,
      preco: parseInt(p.querySelector("strong").textContent.replace(/\D/g, ""), 10),
      descricao: p.lastChild.textContent.trim(),
      fotos: [card.querySelector("img").src],
    };
  }

  function ativarOfertas(container) {
    container.querySelectorAll(".card").forEach((card) => {
      const botao = card.querySelector("button");
      if (!botao) return;
      botao.textContent = "Ver detalhes";
      botao.addEventListener("click", () => abrirModal(lerCardFixo(card)));
    });
  }

  /* ---------- lista ---------- */

  function renderLista(container, opcoes = {}) {
    let anuncios = listar();
    if (opcoes.limite) anuncios = anuncios.slice(0, opcoes.limite);
    container.replaceChildren();

    if (anuncios.length === 0) {
      container.append(
        el("p", {
          class: "lista-vazia",
          text: opcoes.mensagemVazia || "Ainda não há anúncios por aqui.",
        })
      );
      return;
    }
    anuncios.forEach((a) => container.append(criarCard(a, opcoes)));
  }

  /* Se existir #lista-anuncios, desenha os anúncios sozinho.
     Atributos opcionais no elemento:
       data-limite="8"        -> mostra só os 8 mais recentes (home)
       data-ocultar-vazio     -> esconde a seção inteira se não houver anúncios */
  document.addEventListener("DOMContentLoaded", () => {
    // Home: cards fixos logo abaixo do título "Ofertas especiais"
    const fixas = document.querySelector("#ofertas + .carros:not(#lista-anuncios)");
    if (fixas) ativarOfertas(fixas);

    const c = document.querySelector("#lista-anuncios");
    if (!c) return;

    if (c.hasAttribute("data-ocultar-vazio") && listar().length === 0) {
      (c.closest("section") || c).style.display = "none";
      return;
    }

    renderLista(c, {
      limite: Number(c.dataset.limite) || 0,
      mensagemVazia: "Nenhum anúncio publicado ainda. Seja o primeiro a vender!",
    });
  });

  return { listar, adicionar, remover, renderLista };
})();