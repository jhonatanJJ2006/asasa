(function () {

    const counters = document.querySelectorAll('.logro__contador');
    let started = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = 150; // más alto = más lento

            const updateCounter = () => {
                const increment = Math.ceil(target / speed);

                if (count < target) {
                    count += increment;
                    if (count > target) count = target;

                    counter.innerText =
                        target >= 1000 ? '+' + count.toLocaleString('es-ES') : '+' + count;

                    setTimeout(updateCounter, 25); // también puedes aumentar este número para aún más lentitud
                } else {
                    counter.innerText =
                        target >= 1000 ? '+' + target.toLocaleString('es-ES') : '+' + target;
                }
            };

            updateCounter();
        });
    };

    // Intersection Observer
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    animateCounters();
                }
            });
        },
        { threshold: 0.5 } // cuando el 50% del contenedor es visible
    );

    const section = document.getElementById('logros');
    if (section) observer.observe(section);

})();