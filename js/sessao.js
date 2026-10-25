/* ===== Cabeçalho com usuário logado =====
   Carregado em todas as páginas que têm o botão "Login" no cabeçalho.
   Se houver alguém logado (gravado pelo auth.js), troca o botão por
   "Olá, Nome" + "Sair". */
(function () {
  const CHAVE_SESSAO = "usuarioLogado";

  function usuarioAtual() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || localStorage.getItem(CHAVE_SESSAO) || "null");
    } catch {
      return null;
    }
  }

  const usuario = usuarioAtual();
  const link = document.querySelector('header > a[href$="login.html"]');
  if (!usuario || !link) return;

  const caixa = document.createElement("div");
  caixa.className = "usuario-logado";

  const ola = document.createElement("span");
  ola.className = "usuario-nome";
  ola.textContent = "Olá, " + usuario.nome.split(" ")[0]; /* textContent evita injetar HTML */
  ola.title = usuario.email;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "Sair";
  botao.addEventListener("click", () => {
    localStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_SESSAO);
    window.location.reload();
  });

  caixa.append(ola, botao);
  link.replaceWith(caixa);
})();
