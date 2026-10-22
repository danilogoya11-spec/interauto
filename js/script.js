function passarCarros(direcao) {
    const carros = document.getElementById("carros");
    if (!carros) return;

    const primeiroCarro = carros.querySelector(".card");
    if (!primeiroCarro) return;

    const passo = primeiroCarro.offsetWidth + 20;

    if (direcao === 1) {
        if (carros.scrollLeft + carros.clientWidth >= carros.scrollWidth - 5) {
            carros.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            carros.scrollBy({ left: passo, behavior: "smooth" });
        }
    } else {
        if (carros.scrollLeft <= 5) {
            carros.scrollTo({ left: carros.scrollWidth, behavior: "smooth" });
        } else {
            carros.scrollBy({ left: -passo, behavior: "smooth" });
        }
    }
}

// ===== Contador animado =====
const contar = (el) => {
    const alvo = +el.dataset.alvo;
    const duracao = 1500;
    const inicio = performance.now();
    const passo = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        el.textContent = Math.floor(progresso * alvo);
        if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
};

// ===== Revelar ao rolar (e disparar contadores) =====
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        entrada.target.querySelectorAll("[data-alvo]").forEach(contar);
        observador.unobserve(entrada.target);
    });
}, { threshold: 0.2 });

document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

// ===== Expandir card da equipe =====
document.querySelectorAll(".membro").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("aberto"));
});

// ===== Voltar ao topo =====
const botaoTopo = document.getElementById("topo");
if (botaoTopo) {
    window.addEventListener("scroll", () => {
        botaoTopo.classList.toggle("mostrar", window.scrollY > 400);
    });
    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}