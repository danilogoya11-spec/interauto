(function () {
  document.documentElement.classList.add("js");

  function iniciar() {
    // Contador animado (só age onde existir data-alvo)
    function contar(el) {
      const alvo = +el.dataset.alvo;
      const duracao = 1500;
      const inicio = performance.now();
      function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        el.textContent = Math.floor(progresso * alvo);
        if (progresso < 1) requestAnimationFrame(passo);
      }
      requestAnimationFrame(passo);
    }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        entrada.target.querySelectorAll("[data-alvo]").forEach(contar);
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.05 });

    // 1) Seções inteiras
    document
      .querySelectorAll(".revelar, body > section, body > main > section, body > main > section > section, body > footer")
      .forEach((el) => {
        el.classList.add("revelar");
        observador.observe(el);
      });

    // 2) Itens que aparecem um de cada vez
    document
      .querySelectorAll(
        ".valores > div, .equipe1 > div, .equipe2 > div, .texto > div, .numeros > div, .contato-opcoes > a, .vender-form > .campo"
      )
      .forEach((el) => {
        const posicao = Array.from(el.parentElement.children).indexOf(el);
        el.style.setProperty("--atraso", Math.min(posicao * 0.12, 0.6) + "s");
        el.classList.add("item-revelar");
        observador.observe(el);
      });

    // Cards da equipe (página Sobre)
    document.querySelectorAll(".membro").forEach((card) => {
      card.addEventListener("click", () => card.classList.toggle("aberto"));
    });

    // Botão de topo (só se existir no HTML, como na Sobre)
    const botaoTopo = document.getElementById("topo");
    if (botaoTopo) {
      window.addEventListener("scroll", () => {
        botaoTopo.classList.toggle("mostrar", window.scrollY > 400);
      });
      botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();