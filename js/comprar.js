/* ===== Página Comprar: filtros, cards e modal expandido ===== */
const $ = id => document.getElementById(id);
const lista = $("lista-carros");
const modal = $("modal-carro");
let mapaModal = null;

function cardHTML(c) {
  const loja = lojaPorId(c.loja);
  return `
  <article class="card" data-id="${c.id}" tabindex="0" aria-label="Ver detalhes de ${c.marca} ${c.modelo}">
    <img src="${c.img}" alt="${c.marca} ${c.modelo}" loading="lazy">
    <h2>${c.marca} ${c.modelo}</h2>
    <p>${c.ano} · ${fmtKm(c.km)} · ${c.comb}<br>
      <strong>${fmtPreco(c.preco)}</strong><br>
      ${c.desc}<br>
      <span class="car-loja">📍 ${loja.nome} · ${fmtDist(loja.dist)}</span>
    </p>
    <button type="button">Comprar</button>
  </article>`;
}

function filtrar() {
  const marca = normaliza($("f-marca").value);
  const modelo = normaliza($("f-modelo").value);
  const cidade = normaliza($("f-cidade").value);
  const kmMax = Number($("f-km").value) || Infinity;
  const precoMax = Number($("f-preco").value) || Infinity;

  const resultado = CARROS.filter(c => {
    const loja = LOJAS.find(l => l.id === c.loja);
    return normaliza(c.marca).includes(marca)
        && normaliza(c.modelo).includes(modelo)
        && normaliza(loja.cidade).includes(cidade)
        && c.km <= kmMax
        && c.preco <= precoMax;
  });

  lista.innerHTML = resultado.map(cardHTML).join("");
  $("contador").textContent = resultado.length === 1 ? "1 carro encontrado" : `${resultado.length} carros encontrados`;
  $("vazio").hidden = resultado.length > 0;
}

/* ---------- Modal expandido ---------- */
function abrirCarro(id) {
  const c = CARROS.find(x => x.id === id);
  if (!c) return;
  const loja = lojaPorId(c.loja);
  const maisPerto = lojasOrdenadas()[0];
  const msg = encodeURIComponent(`Olá! Tenho interesse no ${c.marca} ${c.modelo} ${c.ano} (${fmtPreco(c.preco)}) anunciado na InterAuto.`);

  $("modal-conteudo").innerHTML = `
    <div class="modal-col">
      <img class="modal-img" src="${c.img}" alt="${c.marca} ${c.modelo}">
      <h2>${c.marca} ${c.modelo}</h2>
      <p class="car-info">${c.ano} · ${fmtKm(c.km)} · ${c.comb}</p>
      <p class="car-price grande">${fmtPreco(c.preco)}</p>
      <p class="car-desc">${c.desc}</p>
    </div>
    <div class="modal-col">
      <h3>Loja do carro</h3>
      <p class="loja-nome">${loja.nome}</p>
      <p>${loja.endereco}<br>${loja.cidade} – ${loja.uf}</p>
      <p class="loja-meta">${loja.horario} · a ${fmtDist(loja.dist)} ${posicaoUsuario.real ? "de você" : "do centro de Sorocaba"}</p>
      ${maisPerto.id !== loja.id
        ? `<p class="aviso-perto">Loja mais perto de você: <strong>${maisPerto.nome}</strong> (${fmtDist(maisPerto.dist)}).</p>`
        : `<p class="aviso-perto">Essa também é a loja mais perto de você.</p>`}
      <div id="mapa-modal" class="mapa"></div>
      <a class="btn-comprar link" target="_blank" rel="noopener"
         href="https://wa.me/${loja.whatsapp}?text=${msg}">Falar com a loja no WhatsApp</a>
    </div>`;

  modal.showModal();
  history.replaceState(null, "", `?carro=${id}`);

  mapaModal = criarMapa("mapa-modal", { zoom: 12 });
  LOJAS.forEach(l => {
    const destaque = l.id === loja.id;
    const m = L.marker([l.lat, l.lng], { opacity: destaque ? 1 : 0.55 }).addTo(mapaModal)
      .bindPopup(`<strong>${l.nome}</strong><br>${l.endereco}`);
    if (destaque) m.openPopup();
  });
  const pontos = [[loja.lat, loja.lng]];
  if (posicaoUsuario.real) {
    L.circleMarker([posicaoUsuario.lat, posicaoUsuario.lng], { radius: 8, color: "#c2410c" })
      .addTo(mapaModal).bindPopup("Você está aqui");
    pontos.push([posicaoUsuario.lat, posicaoUsuario.lng]);
  }
  setTimeout(() => {
    mapaModal.invalidateSize();
    if (pontos.length > 1) mapaModal.fitBounds(pontos, { padding: [40, 40], maxZoom: 14 });
    else mapaModal.setView(pontos[0], 13);
  }, 60);
}

function fecharModal() { if (modal.open) modal.close(); }
modal.addEventListener("close", () => {
  if (mapaModal) { mapaModal.remove(); mapaModal = null; }
  history.replaceState(null, "", location.pathname);
});
modal.addEventListener("click", e => { if (e.target === modal) fecharModal(); });
$("modal-fechar").addEventListener("click", fecharModal);

/* ---------- Eventos ---------- */
lista.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) abrirCarro(card.dataset.id);
});
lista.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const card = e.target.closest(".card");
    if (card) abrirCarro(card.dataset.id);
  }
});

["f-marca", "f-modelo", "f-cidade", "f-km", "f-preco"].forEach(id => $(id).addEventListener("input", filtrar));
$("filtros").addEventListener("reset", () => setTimeout(filtrar, 0));

$("btn-local").addEventListener("click", async () => {
  $("btn-local").textContent = "Buscando localização…";
  const ok = await pedirLocalizacao();
  $("btn-local").textContent = ok ? "Localização ativada ✓" : "Não foi possível obter a localização";
  filtrar();
});

$("cidades").innerHTML = [...new Set(LOJAS.map(l => l.cidade))].map(c => `<option value="${c}">`).join("");

filtrar();

/* Se vier da home com ?carro=id, já abre expandido */
const idUrl = new URLSearchParams(location.search).get("carro");
if (idUrl) abrirCarro(idUrl);