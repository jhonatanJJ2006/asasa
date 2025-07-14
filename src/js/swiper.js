(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const swipers = document.querySelectorAll('.items-swiper');

        if(swipers) {

            swipers.forEach(swiperEl => {
                new Swiper(swiperEl, {
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    speed: 600,
                    slidesPerView: 1,
                });
            });

        }

    });

})();
