/* InterAuto - página Vender
   Formulário de criar anúncio + lista dos anúncios publicados. */

const MAX_FOTOS = 6;
const LADO_MAXIMO = 900; // px - fotos maiores são reduzidas
const QUALIDADE = 0.7; // 0 a 1 (JPEG)

const form = document.querySelector("#form-anuncio");
const campoFotos = document.querySelector("#fotos");
const previewFotos = document.querySelector("#preview-fotos");
const mensagem = document.querySelector("#mensagem");
const meusAnuncios = document.querySelector("#meus-anuncios");

let fotos = []; // fotos já reduzidas, em base64

/* O ano máximo acompanha o ano atual */
form.ano.max = new Date().getFullYear() + 1;

/* ---------- mensagens ---------- */

function mostrarMensagem(texto, tipo) {
  mensagem.className = "mensagem " + tipo;
  mensagem.replaceChildren(texto);
}

function limparMensagem() {
  mensagem.className = "mensagem";
  mensagem.replaceChildren();
}

/* ---------- fotos ---------- */

/* O localStorage guarda só ~5 MB. Por isso cada foto é redimensionada
   e comprimida num <canvas> antes de ser salva. */
function reduzirImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", QUALIDADE));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler " + arquivo.name));
    };
    img.src = url;
  });
}

function desenharPreview() {
  previewFotos.replaceChildren();
  fotos.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "preview-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Foto ${i + 1}`;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "preview-remover";
    remover.textContent = "×";
    remover.setAttribute("aria-label", `Remover foto ${i + 1}`);
    remover.addEventListener("click", () => {
      fotos.splice(i, 1);
      desenharPreview();
    });

    item.append(img, remover);

    if (i === 0) {
      const capa = document.createElement("span");
      capa.className = "preview-capa";
      capa.textContent = "Capa";
      item.append(capa);
    }
    previewFotos.append(item);
  });
}

campoFotos.addEventListener("change", async () => {
  limparMensagem();
  const arquivos = [...campoFotos.files].filter((f) => f.type.startsWith("image/"));
  campoFotos.value = ""; // permite escolher o mesmo arquivo de novo

  for (const arquivo of arquivos) {
    if (fotos.length >= MAX_FOTOS) {
      mostrarMensagem(`Máximo de ${MAX_FOTOS} fotos por anúncio.`, "erro");
      break;
    }
    try {
      fotos.push(await reduzirImagem(arquivo));
    } catch (e) {
      mostrarMensagem(e.message, "erro");
    }
  }
  desenharPreview();
});

/* ---------- publicar ---------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  limparMensagem();

  if (fotos.length === 0) {
    mostrarMensagem("Adicione pelo menos uma foto do carro.", "erro");
    return;
  }

  const contato = form.contato.value.replace(/\D/g, "");
  if (contato.length < 10 || contato.length > 13) {
    mostrarMensagem("Informe um WhatsApp válido, com DDD.", "erro");
    form.contato.focus();
    return;
  }

  const anuncio = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    marca: form.marca.value.trim(),
    modelo: form.modelo.value.trim(),
    ano: Number(form.ano.value),
    km: Number(form.km.value),
    combustivel: form.combustivel.value,
    cambio: form.cambio.value,
    preco: Number(form.preco.value),
    cidade: form.cidade.value.trim(),
    contato: form.contato.value.trim(),
    descricao: form.descricao.value.trim(),
    fotos: [...fotos],
    criadoEm: Date.now(),
  };

  try {
    Anuncios.adicionar(anuncio);
  } catch (erro) {
    mostrarMensagem(
      "O espaço do navegador acabou. Exclua anúncios antigos ou use menos fotos.",
      "erro"
    );
    return;
  }

  form.reset();
  fotos = [];
  desenharPreview();
  desenharMeusAnuncios();

  const texto = document.createElement("span");
  texto.append("Anúncio publicado. ");
  const link = document.createElement("a");
  link.href = "./comprar.html";
  link.textContent = "Ver na página Comprar";
  texto.append(link);
  mostrarMensagem(texto, "sucesso");
});

/* ---------- lista dos anúncios publicados ---------- */

function desenharMeusAnuncios() {
  Anuncios.renderLista(meusAnuncios, {
    mensagemVazia: "Você ainda não publicou nenhum anúncio.",
    onRemover: (id) => {
      if (confirm("Excluir este anúncio?")) {
        Anuncios.remover(id);
        desenharMeusAnuncios();
      }
    },
  });
}

desenharMeusAnuncios();