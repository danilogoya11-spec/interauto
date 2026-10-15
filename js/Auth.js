/* InterAuto - login e cadastro
   O projeto ainda não tem servidor, então estes formulários só validam os
   campos e avisam isso. Nenhuma senha é guardada em lugar nenhum. */

const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function avisar(form, texto, tipo) {
  let aviso = form.querySelector(".aviso-form");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.setAttribute("role", "alert");
    form.querySelector("button[type=submit]").before(aviso);
  }
  aviso.className = "aviso-form " + tipo;
  aviso.textContent = texto;
}

const formLogin = document.querySelector("#form-login");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = formLogin.email.value.trim();
    if (!emailValido(email)) {
      avisar(formLogin, "Informe um e-mail válido.", "erro");
      formLogin.email.focus();
      return;
    }
    if (formLogin.senha.value.length === 0) {
      avisar(formLogin, "Informe a sua senha.", "erro");
      formLogin.senha.focus();
      return;
    }
    avisar(formLogin, "O login ainda não está disponível: esta versão do projeto não tem servidor.", "info");
  });
}

const formCadastro = document.querySelector("#form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = formCadastro.nome.value.trim();
    const email = formCadastro.email.value.trim();
    const senha = formCadastro.senha.value;
    const confirmar = formCadastro["confirmar-senha"].value;

    if (nome.length < 2) {
      avisar(formCadastro, "Informe o seu nome.", "erro");
      formCadastro.nome.focus();
    } else if (!emailValido(email)) {
      avisar(formCadastro, "Informe um e-mail válido.", "erro");
      formCadastro.email.focus();
    } else if (senha.length < 6) {
      avisar(formCadastro, "A senha precisa ter pelo menos 6 caracteres.", "erro");
      formCadastro.senha.focus();
    } else if (senha !== confirmar) {
      avisar(formCadastro, "As senhas não são iguais.", "erro");
      formCadastro["confirmar-senha"].focus();
    } else {
      avisar(formCadastro, "Dados válidos, mas a conta não foi criada: esta versão do projeto não tem servidor.", "info");
    }
  });
}