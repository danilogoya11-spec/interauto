/* ===== Dados compartilhados: lojas, carros e funções de distância ===== */
/* Endereços fictícios (aleatórios) só para o projeto acadêmico. */

const LOJAS = [
  { id: "centro",     nome: "InterAuto Centro",     endereco: "Rua Dr. Álvaro Soares, 120 – Centro",         cidade: "Sorocaba",   uf: "SP", lat: -23.5015, lng: -47.4526, whatsapp: "5515999990001", horario: "Seg a Sáb, 9h às 18h" },
  { id: "campolim",   nome: "InterAuto Campolim",   endereco: "Av. Antônio Carlos Comitre, 700 – Campolim",  cidade: "Sorocaba",   uf: "SP", lat: -23.5230, lng: -47.4690, whatsapp: "5515999990002", horario: "Seg a Sáb, 9h às 19h" },
  { id: "votorantim", nome: "InterAuto Votorantim", endereco: "Av. 31 de Março, 450 – Centro",               cidade: "Votorantim", uf: "SP", lat: -23.5460, lng: -47.4380, whatsapp: "5515999990003", horario: "Seg a Sex, 9h às 18h" },
  { id: "itu",        nome: "InterAuto Itu",        endereco: "Rua Paula Souza, 300 – Centro",               cidade: "Itu",        uf: "SP", lat: -23.2640, lng: -47.2990, whatsapp: "5511999990004", horario: "Seg a Sáb, 9h às 18h" },
  { id: "campinas",   nome: "InterAuto Campinas",   endereco: "Av. Norte-Sul, 900 – Centro",                 cidade: "Campinas",   uf: "SP", lat: -22.9056, lng: -47.0608, whatsapp: "5519999990005", horario: "Seg a Sáb, 8h às 19h" }
];

/* Fotos: as mesmas que você já usa na home (pasta images/carros).
   Os caminhos são relativos à pasta pages/. */
const FOTOS = {
  celta:       "../images/carros/Chevrolet_Celta.jpg",
  accord:      "../images/carros/Honda_Accord.jpg",
  uno:         "../images/carros/Fiat_Uno.jpg",
  palio:       "../images/carros/Fiat_Palio.jpg",
  skyline:     "../images/carros/Honda_Skyline.jpg",
  astraSedan:  "../images/carros/Chevrolet_Astra_Sedan.jpg",
  astraHatch:  "../images/carros/Chevrolet_Astra_Hatch.jpg",
  unoTurbo:    "../images/carros/Fiat_Uno_Turbo.jpg",
  hrv:         "../images/carros/Honda_HRV.jpg",
  mobi:        "../images/carros/Fiat_Mobi.jpg"
};

const CARROS = [
  { id: "celta-centro",    marca: "Chevrolet", modelo: "Celta",       ano: 2010, km: 89000,  comb: "Flex",     preco: 24900,  loja: "centro",     img: FOTOS.celta,      desc: "Único dono, revisado, pneus novos. Econômico e ideal para o dia a dia na cidade." },
  { id: "accord-campolim", marca: "Honda",     modelo: "Accord",      ano: 1994, km: 178000, comb: "Gasolina", preco: 32900,  loja: "campolim",   img: FOTOS.accord,     desc: "Interior em ótimo estado, banco de couro, ar-condicionado gelando. Raridade bem cuidada." },
  { id: "uno-votorantim",  marca: "Fiat",      modelo: "Uno",         ano: 1998, km: 142000, comb: "Gasolina", preco: 14500,  loja: "votorantim", img: FOTOS.uno,        desc: "Clássico bem conservado, motor forte e baixo custo de manutenção. Ótimo primeiro carro." },
  { id: "palio-centro",    marca: "Fiat",      modelo: "Palio",       ano: 2003, km: 105000, comb: "Flex",     preco: 19900,  loja: "centro",     img: FOTOS.palio,      desc: "Direção leve, ótimo para cidade, documentação em dia. Aceita troca." },
  { id: "celta-itu",       marca: "Chevrolet", modelo: "Celta",       ano: 2012, km: 76000,  comb: "Flex",     preco: 27500,  loja: "itu",        img: FOTOS.celta,      desc: "Vidros e travas elétricas, ar-condicionado e revisões em dia." },
  { id: "palio-itu",       marca: "Fiat",      modelo: "Palio",       ano: 2001, km: 152000, comb: "Gasolina", preco: 13900,  loja: "itu",        img: FOTOS.palio,      desc: "Funcionamento perfeito, pequenos detalhes de pintura. Preço de oportunidade." },
  { id: "skyline-campinas",marca: "Nissan",    modelo: "Skyline",     ano: 1999, km: 84000,  comb: "Gasolina", preco: 389900, loja: "campinas",   img: FOTOS.skyline,    desc: "Esportivo japonês raro, motor original, pintura preservada e documentação completa. Para colecionador." },
  { id: "astra-sedan",     marca: "Chevrolet", modelo: "Astra Sedan", ano: 2008, km: 121000, comb: "Flex",     preco: 27900,  loja: "centro",     img: FOTOS.astraSedan, desc: "Ar-condicionado, direção hidráulica e vidros elétricos. Revisões em dia e pneus novos." },
  { id: "astra-hatch",     marca: "Chevrolet", modelo: "Astra Hatch", ano: 2011, km: 98000,  comb: "Flex",     preco: 34900,  loja: "votorantim", img: FOTOS.astraHatch, desc: "Segundo dono, central multimídia, rodas de liga leve e ótimo conforto para viagens." },
  { id: "uno-turbo",       marca: "Fiat",      modelo: "Uno Turbo",   ano: 1994, km: 118000, comb: "Gasolina", preco: 59900,  loja: "campolim",   img: FOTOS.unoTurbo,   desc: "Lendário 1.4 turbo, original de fábrica, funcionamento perfeito. Item de colecionador." },
  { id: "hrv-itu",         marca: "Honda",     modelo: "HR-V",        ano: 2019, km: 62000,  comb: "Flex",     preco: 98900,  loja: "itu",        img: FOTOS.hrv,        desc: "Câmbio automático CVT, câmera de ré, banco de couro e revisões feitas na concessionária." },
  { id: "mobi-campinas",   marca: "Fiat",      modelo: "Mobi",        ano: 2021, km: 38000,  comb: "Flex",     preco: 52900,  loja: "campinas",   img: FOTOS.mobi,       desc: "Único dono, compacto e econômico, ideal para o trânsito da cidade. Ainda com garantia de fábrica." }
];

/* Local padrão (centro de Sorocaba) caso a pessoa não permita a localização */
const POSICAO_PADRAO = { lat: -23.5015, lng: -47.4526, real: false };
let posicaoUsuario = { ...POSICAO_PADRAO };

function distanciaKm(a, b) {
  const R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function lojasOrdenadas(pos = posicaoUsuario) {
  return LOJAS.map(l => ({ ...l, dist: distanciaKm(pos, l) })).sort((a, b) => a.dist - b.dist);
}

function lojaPorId(id) {
  const l = LOJAS.find(x => x.id === id);
  return { ...l, dist: distanciaKm(posicaoUsuario, l) };
}

function pedirLocalizacao() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(false);
    navigator.geolocation.getCurrentPosition(
      p => { posicaoUsuario = { lat: p.coords.latitude, lng: p.coords.longitude, real: true }; resolve(true); },
      () => resolve(false),
      { timeout: 8000 }
    );
  });
}

const fmtPreco = n => "R$ " + n.toLocaleString("pt-BR");
const fmtKm = n => n.toLocaleString("pt-BR") + " Km";
const fmtDist = d => d.toFixed(1).replace(".", ",") + " km";
const normaliza = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/* Cria o mapa Leaflet (OpenStreetMap, sem chave de API) */
function criarMapa(idElemento, { zoom = 10 } = {}) {
  const mapa = L.map(idElemento).setView([posicaoUsuario.lat, posicaoUsuario.lng], zoom);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  }).addTo(mapa);
  return mapa;
}