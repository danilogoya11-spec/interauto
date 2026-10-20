/* ===== Página Vender: contato com a loja + mapa das lojas mais perto ===== */
const $ = id => document.getElementById(id);
const mapa = criarMapa("mapa-lojas", { zoom: 10 });
const marcadores = {};
let marcadorUsuario = null;

LOJAS.forEach(l => {
  marcadores[l.id] = L.marker([l.lat, l.lng]).addTo(mapa)
    .bindPopup(`<strong>${l.nome}</strong><br>${l.endereco}<br>${l.cidade} – ${l.uf}`);
  marcadores[l.id].on("click", () => selecionarLoja(l.id, false));
});

function renderLojas() {
  const ordenadas = lojasOrdenadas();
  $("lista-lojas").innerHTML = ordenadas.map((l, i) => `
    <li>
      <button type="button" class="loja-item ${i === 0 ? "mais-perto" : ""}" data-id="${l.id}">
        <span class="loja-nome">${l.nome}${i === 0 ? ' <em class="selo">mais perto</em>' : ""}</span>
        <span class="loja-end">${l.endereco}, ${l.cidade} – ${l.uf}</span>
        <span class="loja-meta">${l.horario} · ${fmtDist(l.dist)} ${posicaoUsuario.real ? "de você" : "do centro de Sorocaba"}</span>
      </button>
    </li>`).join("");

  $("loja").innerHTML = ordenadas.map(l => `<option value="${l.id}">${l.nome} (${fmtDist(l.dist)})</option>`).join("");
  selecionarLoja(ordenadas[0].id, false);
}

function selecionarLoja(id, abrirPopup = true) {
  $("loja").value = id;
  document.querySelectorAll(".loja-item").forEach(b => b.classList.toggle("ativa", b.dataset.id === id));
  const l = LOJAS.find(x => x.id === id);
  mapa.setView([l.lat, l.lng], 13);
  if (abrirPopup) marcadores[id].openPopup();
}

$("lista-lojas").addEventListener("click", e => {
  const b = e.target.closest(".loja-item");
  if (b) selecionarLoja(b.dataset.id);
});
$("loja").addEventListener("change", e => selecionarLoja(e.target.value));

$("btn-local").addEventListener("click", async () => {
  $("btn-local").textContent = "Buscando localização…";
  const ok = await pedirLocalizacao();
  $("btn-local").textContent = ok ? "Localização ativada ✓" : "Não foi possível obter a localização";
  if (ok) {
    if (marcadorUsuario) marcadorUsuario.remove();
    marcadorUsuario = L.circleMarker([posicaoUsuario.lat, posicaoUsuario.lng], { radius: 8, color: "#c2410c" })
      .addTo(mapa).bindPopup("Você está aqui");
  }
  renderLojas();
});

/* ---------- Formulário ---------- */
$("form-venda").addEventListener("submit", e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const loja = LOJAS.find(l => l.id === f.loja);

  const texto =
`Olá! Quero vender meu carro pela InterAuto.
Nome: ${f.nome}
Telefone: ${f.telefone}
Carro: ${f.marca} ${f.modelo} ${f.ano}
Km: ${Number(f.km).toLocaleString("pt-BR")} · ${f.combustivel} · ${f.cambio}
Preço desejado: ${f.preco ? fmtPreco(Number(f.preco)) : "a combinar"}
${f.mensagem ? "Obs.: " + f.mensagem : ""}`;

  /* guarda o pedido no navegador (localStorage), como nas outras páginas do projeto */
  const pedidos = JSON.parse(localStorage.getItem("pedidosVenda") || "[]");
  pedidos.push({ ...f, loja: loja.nome, data: new Date().toISOString() });
  localStorage.setItem("pedidosVenda", JSON.stringify(pedidos));

  $("retorno").className = "mensagem sucesso";
  $("retorno").innerHTML = `Pedido enviado para <strong>${loja.nome}</strong>. Abrimos o WhatsApp da loja para você concluir o contato.`;
  window.open(`https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  e.target.reset();
  selecionarLoja(f.loja, false);
});

renderLojas();