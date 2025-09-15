(function () {
    document.addEventListener('DOMContentLoaded', function () {
        
        // Función para animar un contador
        function animateCounter(element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16); // 60 FPS aproximadamente
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Formatear números grandes con comas
                const displayValue = Math.floor(current);
                element.textContent = displayValue.toLocaleString('es-ES');
            }, 16);
        }
        
        // Función para animar todos los contadores cuando sean visibles
        function initCounters() {
            const counters = document.querySelectorAll('.logro__contador');
            
            if (counters.length === 0) return;
            
            // Configuración del Intersection Observer
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5 // El elemento debe estar 50% visible
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        
                        // Marcar como animado para evitar repetir
                        counter.classList.add('animated');
                        
                        // Determinar duración basada en el número
                        let duration = 2000; // 2 segundos por defecto
                        if (target >= 1000) {
                            duration = 3000; // 3 segundos para números grandes
                        } else if (target <= 10) {
                            duration = 1500; // 1.5 segundos para números pequeños
                        }
                        
                        // Iniciar animación
                        animateCounter(counter, target, duration);
                        
                        // Dejar de observar este elemento
                        observer.unobserve(counter);
                    }
                });
            }, observerOptions);
            
            // Observar todos los contadores
            counters.forEach(counter => {
                observer.observe(counter);
            });
        }
        
        // Función alternativa para animar inmediatamente (sin scroll)
        function animateCountersImmediately() {
            const counters = document.querySelectorAll('.logro__contador');
            
            counters.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-target'));
                
                // Agregar delay escalonado para efecto visual
                setTimeout(() => {
                    let duration = 2000;
                    if (target >= 1000) {
                        duration = 3000;
                    } else if (target <= 10) {
                        duration = 1500;
                    }
                    
                    animateCounter(counter, target, duration);
                }, index * 200); // 200ms de delay entre cada contador
            });
        }
        
        // Función con efecto de easing más suave
        function animateCounterWithEasing(element, target, duration = 2000) {
            const start = 0;
            const startTime = performance.now();
            
            // Agregar clase de animación
            element.classList.add('animating');
            
            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                
                const current = start + (target - start) * easedProgress;
                const displayValue = Math.floor(current);
                
                element.textContent = displayValue.toLocaleString('es-ES');
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Asegurar que muestre el valor final exacto
                    element.textContent = target.toLocaleString('es-ES');
                    
                    // Remover clase de animación
                    element.classList.remove('animating');
                    
                    // Efecto final de completado
                    element.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 200);
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
        
        // Función mejorada para animar con easing
        function initCountersWithEasing() {
            const counters = document.querySelectorAll('.logro__contador');
            
            if (counters.length === 0) return;
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.3 // Activar cuando esté 30% visible
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        
                        counter.classList.add('animated');
                        
                        // Duración basada en el tamaño del número
                        let duration = 2500;
                        if (target >= 1000) {
                            duration = 3500;
                        } else if (target <= 10) {
                            duration = 2000;
                        }
                        
                        // Usar animación con easing
                        animateCounterWithEasing(counter, target, duration);
                        
                        observer.unobserve(counter);
                    }
                });
            }, observerOptions);
            
            counters.forEach(counter => {
                observer.observe(counter);
            });
        }
        
        // Detectar si el usuario prefiere menos animaciones
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Si prefiere menos animaciones, mostrar números directamente
            const counters = document.querySelectorAll('.logro__contador');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                counter.textContent = target.toLocaleString('es-ES');
            });
        } else {
            // Inicializar contadores con animación suave
            initCountersWithEasing();
        }
        
        // Función para reiniciar animaciones (útil para testing)
        window.resetCounters = function() {
            const counters = document.querySelectorAll('.logro__contador');
            counters.forEach(counter => {
                counter.classList.remove('animated');
                counter.textContent = '0';
            });
            initCountersWithEasing();
        };
        
    });
})();
