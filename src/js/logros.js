(function () {

  const logrosDiv = document.querySelector('#logros');

  if(logrosDiv) {

    function animateCounters() {
      const counters = document.querySelectorAll(".logro__contador");
  
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let start = 0;
        const duration = 2000; // duración total de la animación en ms
        const startTime = performance.now();
  
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(progress * target);
          counter.textContent = value.toLocaleString();
  
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }
  
        requestAnimationFrame(updateCounter);
      });
    }
  
    // Opcional: esperar a que el usuario vea el contenedor
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect(); // ejecutar solo una vez
      }
    }, { threshold: 0.5 });
  
    observer.observe(document.getElementById("logros"));

  }

})();
