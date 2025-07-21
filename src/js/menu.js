(function () {
    const menu = document.querySelector('.header-dashboard__menu');
    const navLateral = document.querySelector('.header__nav--2');
    const overlay = document.querySelector('.overlay');

    if (menu && navLateral && overlay) {
        menu.addEventListener('click', () => {
            navLateral.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            navLateral.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    const menu2 = document.querySelector('.header__menu');
    const navLatera2 = document.querySelector('.header__nav--2');
    const overlay2 = document.querySelector('.overlay');

    if (menu2 && navLateral && overlay) {
        menu2.addEventListener('click', () => {
            navLatera2.classList.toggle('active');
            overlay2.classList.toggle('active');
        });

        overlay2.addEventListener('click', () => {
            navLatera2.classList.remove('active');
            overlay2.classList.remove('active');
        });
    }
})();
