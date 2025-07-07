(function () {

  const header = document.getElementById('mainHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      // Si baja y aún no está fijo
      if (!header.classList.contains('fixed')) {
        header.classList.add('fixed');
      }
    } else {
      // Si vuelve arriba
      header.classList.remove('fixed');
    }

    lastScroll = currentScroll;
  });

})();