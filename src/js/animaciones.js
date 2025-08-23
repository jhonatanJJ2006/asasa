(function () {

    const sectionTitles = document.querySelectorAll('.section-title');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.7 // 30% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Solo una vez
            }
        });
    }, observerOptions);

    sectionTitles.forEach(title => {
        observer.observe(title);
    });

})();
