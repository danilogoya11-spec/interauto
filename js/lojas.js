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
    celta:  "../images/carros/Chevrolet_Celta.jpg",
    accord: "../images/carros/Honda_Accord.jpg",
    uno:    "../images/carros/Fiat_Uno.jpg",
    palio:  "../images/carros/Fiat_Palio.jpg"
  };
  
  const CARROS = [
    { id: "celta-centro",   marca: "Chevrolet", modelo: "Celta",  ano: 2010, km: 89000,  comb: "Flex",     preco: 24900, loja: "centro",     img: FOTOS.celta,  desc: "Único dono, revisado, pneus novos. Econômico e ideal para o dia a dia na cidade." },
    { id: "accord-campolim",marca: "Honda",     modelo: "Accord", ano: 1994, km: 178000, comb: "Gasolina", preco: 32900, loja: "campolim",   img: FOTOS.accord, desc: "Interior em ótimo estado, banco de couro, ar-condicionado gelando. Raridade bem cuidada." },
    { id: "uno-votorantim", marca: "Fiat",      modelo: "Uno",    ano: 1998, km: 142000, comb: "Gasolina", preco: 14500, loja: "votorantim", img: FOTOS.uno,    desc: "Clássico bem conservado, motor forte e baixo custo de manutenção. Ótimo primeiro carro." },
    { id: "palio-centro",   marca: "Fiat",      modelo: "Palio",  ano: 2003, km: 105000, comb: "Flex",     preco: 19900, loja: "centro",     img: FOTOS.palio,  desc: "Direção leve, ótimo para cidade, documentação em dia. Aceita troca." },
    { id: "celta-itu",      marca: "Chevrolet", modelo: "Celta",  ano: 2012, km: 76000,  comb: "Flex",     preco: 27500, loja: "itu",        img: FOTOS.celta,  desc: "Vidros e travas elétricas, ar-condicionado e revisões em dia." },
    { id: "uno-campinas",   marca: "Fiat",      modelo: "Uno",    ano: 2008, km: 118000, comb: "Flex",     preco: 17900, loja: "campinas",   img: FOTOS.uno,    desc: "Econômico, pneus novos e documentação quitada. Aceita proposta." },
    { id: "palio-campolim", marca: "Fiat",      modelo: "Palio",  ano: 2006, km: 129000, comb: "Flex",     preco: 18500, loja: "campolim",   img: FOTOS.palio,  desc: "Motor 1.0 muito econômico, ótimo para uso diário." },
    { id: "accord-campinas",marca: "Honda",     modelo: "Accord", ano: 1997, km: 164000, comb: "Gasolina", preco: 35900, loja: "campinas",   img: FOTOS.accord, desc: "Conservado, banco de couro, câmbio automático suave." },
    { id: "celta-votorantim",marca:"Chevrolet", modelo: "Celta",  ano: 2009, km: 98000,  comb: "Flex",     preco: 22900, loja: "votorantim", img: FOTOS.celta,  desc: "Baixo custo de manutenção, ideal para quem está começando a dirigir." },
    { id: "palio-itu",      marca: "Fiat",      modelo: "Palio",  ano: 2001, km: 152000, comb: "Gasolina", preco: 13900, loja: "itu",        img: FOTOS.palio,  desc: "Funcionamento perfeito, pequenos detalhes de pintura. Preço de oportunidade." }
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
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(mapa);
    return mapa;
  }