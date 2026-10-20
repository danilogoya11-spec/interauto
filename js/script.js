
function passarCarros(direcao) {
    const carros = document.getElementById("carros");
    const primeiroCarro = carros.querySelector(".card");
    const ultimoCarro = carros.lastElementChild;

    if (!primeiroCarro || !ultimoCarro) return;

    if (direcao === 1) {
        if (
            carros.scrollLeft + carros.clientWidth >=
            carros.scrollWidth - 5
        ) {
            carros.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        } else {
            carros.scrollBy({
                left: primeiroCarro.offsetWidth + 20,
                behavior: "smooth"
            });
        }
    } else {
        if (carros.scrollLeft <= 5) {
            carros.scrollTo({
                left: carros.scrollWidth,
                behavior: "smooth"
            });
        } else {
            carros.scrollBy({
                left: -(primeiroCarro.offsetWidth + 20),
                behavior: "smooth"
            });
        }
    }
}
