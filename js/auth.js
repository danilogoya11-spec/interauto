/* ===== Autenticação: cadastro e login =====
   Sem backend: os usuários ficam no localStorage do navegador, como o
   pedido de venda em vender.js. As senhas NUNCA são guardadas em texto
   puro: salvamos um hash PBKDF2 (SHA-256) com salt aleatório por usuário.
   Obs.: por rodar só no navegador, isto serve para o projeto acadêmico;
   um sistema real precisaria de servidor e banco de dados. */

const CHAVE_USUARIOS = "usuarios";
const CHAVE_SESSAO = "usuarioLogado";

/* ---------- Armazenamento ---------- */
function lerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || "[]");
  } catch {
    return [];
  }
}

function salvarUsuarios(lista) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
}

/* ---------- Hash de senha ---------- */
const paraHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

function gerarSalt() {
  return paraHex(crypto.getRandomValues(new Uint8Array(16)));
}

async function hashSenha(senha, salt) {
  const enc = new TextEncoder();
  if (window.crypto && crypto.subtle) {
    const chave = await crypto.subtle.importKey("raw", enc.encode(senha), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
      chave,
      256
    );
    return paraHex(bits);
  }
  /* alternativa simples se o navegador bloquear crypto.subtle (páginas sem HTTPS) */
  let h = 5381;
  for (const c of salt + senha) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return "simples-" + h.toString(16);
}

/* ---------- Sessão ---------- */
function iniciarSessao(usuario, lembrar) {
  const dados = JSON.stringify({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  localStorage.removeItem(CHAVE_SESSAO);
  sessionStorage.removeItem(CHAVE_SESSAO);
  (lembrar ? localStorage : sessionStorage).setItem(CHAVE_SESSAO, dados);
}

function usuarioAtual() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || localStorage.getItem(CHAVE_SESSAO) || "null");
  } catch {
    return null;
  }
}

function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
  sessionStorage.removeItem(CHAVE_SESSAO);
}

/* disponível para as outras páginas: Auth.usuarioAtual(), Auth.sair() */
window.Auth = { usuarioAtual, sair };

/* ---------- Mensagens na tela ---------- */
function mostrarMensagem(form, texto, tipo) {
  let el = form.querySelector(".auth-msg");
  if (!el) {
    el = document.createElement("div");
    el.className = "auth-msg";
    el.setAttribute("role", "alert");
    form.querySelector("button[type=submit]").before(el);
  }
  el.textContent = texto;
  el.className = "auth-msg " + tipo;
}

const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const normalizarEmail = (e) => e.trim().toLowerCase();

/* ---------- Cadastro ---------- */
const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = formCadastro.querySelector("button[type=submit]");

    const nome = formCadastro.nome.value.trim().replace(/\s+/g, " ");
    const email = normalizarEmail(formCadastro.email.value);
    const senha = formCadastro.senha.value;
    const confirmar = formCadastro["confirmar-senha"].value;

    if (nome.length < 2) return mostrarMensagem(formCadastro, "Informe seu nome.", "erro");
    if (!emailValido(email)) return mostrarMensagem(formCadastro, "Informe um e-mail válido.", "erro");
    if (senha.length < 6) return mostrarMensagem(formCadastro, "A senha precisa ter pelo menos 6 caracteres.", "erro");
    if (senha !== confirmar) return mostrarMensagem(formCadastro, "As senhas não coincidem.", "erro");

    const usuarios = lerUsuarios();
    if (usuarios.some((u) => u.email === email)) {
      return mostrarMensagem(formCadastro, "Já existe uma conta com esse e-mail. Tente entrar.", "erro");
    }

    botao.disabled = true;
    const salt = gerarSalt();
    usuarios.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nome,
      email,
      salt,
      senhaHash: await hashSenha(senha, salt),
      criadoEm: new Date().toISOString(),
    });
    salvarUsuarios(usuarios);

    mostrarMensagem(formCadastro, "Conta criada com sucesso! Redirecionando para o login…", "sucesso");
    setTimeout(() => (window.location.href = "login.html"), 1200);
  });
}

/* ---------- Login ---------- */
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = formLogin.querySelector("button[type=submit]");

    const email = normalizarEmail(formLogin.email.value);
    const senha = formLogin.senha.value;
    const lembrar = formLogin.querySelector("input[type=checkbox]").checked;

    botao.disabled = true;
    const usuario = lerUsuarios().find((u) => u.email === email);
    const ok = usuario && (await hashSenha(senha, usuario.salt)) === usuario.senhaHash;
    botao.disabled = false;

    /* mesma mensagem para e-mail inexistente e senha errada */
    if (!ok) return mostrarMensagem(formLogin, "E-mail ou senha incorretos.", "erro");

    iniciarSessao(usuario, lembrar);
    mostrarMensagem(formLogin, `Bem-vindo, ${usuario.nome.split(" ")[0]}! Entrando…`, "sucesso");
    setTimeout(() => (window.location.href = "../index.html"), 800);
  });
}
