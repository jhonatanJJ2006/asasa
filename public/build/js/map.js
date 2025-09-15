import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==== Utilidades ====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==== Indicador de carga mejorado ====
function showLoadingIndicator() {
    const loadingHTML = `
        <div class="map-loading-overlay">
            <div class="map-loading-content">
                <div class="map-loading-spinner"></div>
                <h3 class="map-loading-title">Cargando Mapa Interactivo</h3>
                <p class="map-loading-description">Preparando la experiencia 3D...</p>
                <div class="map-loading-progress">
                    <div class="map-loading-bar"></div>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('container');
    if (container) {
        container.insertAdjacentHTML('beforeend', loadingHTML);
        
        // Animar barra de progreso
        setTimeout(() => {
            const progressBar = document.querySelector('.map-loading-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 500);
    }
}

function hideLoadingIndicator() {
    const loadingOverlay = document.querySelector('.map-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// ==== Tooltip interactivo ====
let tooltip = null;

function createTooltip() {
    if (tooltip) return;
    
    tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 25, 35, 0.98) 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 400;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        max-width: 280px;
        min-width: 200px;
        text-align: left;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.4;
    `;
    document.body.appendChild(tooltip);
}

function showTooltip(x, y, cantonName, eventCount, cantonData = null) {
    if (!tooltip) createTooltip();
    
    // Posicionar tooltip al lado del cursor
    const offsetX = 20;
    const offsetY = -10;
    
    // Ajustar posición si está muy cerca del borde derecho
    const tooltipX = (x + offsetX + 300 > window.innerWidth) ? x - 320 : x + offsetX;
    const tooltipY = y + offsetY;
    
    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    
    const eventText = eventCount > 0 
        ? `${eventCount} evento${eventCount > 1 ? 's' : ''}`
        : 'Sin eventos';
    
    // Crear contenido mejorado del tooltip
    let tooltipContent = `
        <div class="tooltip-header">
            <div style="font-weight: 600; margin-bottom: 4px; color: #fff; font-size: 14px;">
                ${cantonName.charAt(0).toUpperCase() + cantonName.slice(1)}
            </div>
            <div style="font-size: 12px; opacity: 0.8; color: #94a3b8;">
                📍 ${eventText}
            </div>
        </div>
    `;
    
    // Si hay datos del cantón, mostrar información adicional
    if (cantonData && cantonData.length > 0) {
        // Obtener el evento más reciente
        const recentEvent = cantonData.reduce((latest, event) => {
            return new Date(event.fecha) > new Date(latest.fecha) ? event : latest;
        });
        
        // Obtener años únicos
        const years = [...new Set(cantonData.map(event => new Date(event.fecha).getFullYear()))];
        const yearRange = years.length > 1 ? `${Math.min(...years)} - ${Math.max(...years)}` : years[0];
        
        tooltipContent += `
            <div class="tooltip-body" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
                    📅 Último: ${recentEvent.titulo.length > 30 ? recentEvent.titulo.substring(0, 30) + '...' : recentEvent.titulo}
                </div>
                <div style="font-size: 11px; color: #94a3b8;">
                    🕒 Período: ${yearRange}
                </div>
            </div>
        `;
        
        // Si hay imagen del evento más reciente, mostrarla
        if (recentEvent.imagen) {
            tooltipContent += `
                <div class="tooltip-image" style="margin-top: 8px; border-radius: 6px; overflow: hidden;">
                    <img src="/build/img/logros/${recentEvent.imagen}" alt="${recentEvent.titulo}" 
                         style="width: 100%; height: 60px; object-fit: cover; border-radius: 6px;" />
                </div>
            `;
        }
    }
    
    tooltip.innerHTML = tooltipContent;
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
    }
}

// ==== Cargar datos con manejo de errores mejorado ====
async function cargarDatos() {
    try {
        showLoadingIndicator();
        
        const res = await fetch('/cargarDatos/mapa', { method: 'POST' });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
        const data = await res.json();
        hideLoadingIndicator();
        return data;
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        hideLoadingIndicator();
        
        Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudieron cargar los datos del mapa. ¿Deseas intentar de nuevo?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Reintentar',
            cancelButtonText: 'Continuar sin datos',
            customClass: {
                popup: 'swal-map-error',
                confirmButton: 'btn-retry',
                cancelButton: 'btn-continue'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
        
        return null;
    }
}

// ==== Inicialización principal ====
if (document.getElementById('container')) {
    const container = document.getElementById('container');
    
    // === Datos eventos por ciudad/cantón ===
    let eventosPorCanton = {};
    
    // Carga los eventos antes de inicializar el mapa
    await cargarDatos().then(data => {
        if (data && data.response && Array.isArray(data.response)) {
            eventosPorCanton = data.response.reduce((acc, evento) => {
                const ciudad = (evento.ciudad || '').toLowerCase().trim();
                if (!acc[ciudad]) acc[ciudad] = [];
                acc[ciudad].push(evento);
                return acc;
            }, {});
        }
    });
    
    // ==== Responsividad mejorada ====
    function getCanvasSize() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Asegurar que el contenedor ocupe toda la ventana
        container.style.width = '100vw';
        container.style.height = '100vh';
        
        return { 
            width: window.innerWidth, 
            height: window.innerHeight 
        };
    }
    
    const { width, height } = getCanvasSize();
    
    // ==== THREE.js Inicialización mejorada ====
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.margin = '0 auto';
    renderer.domElement.style.borderRadius = '12px';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.background = null;
    
    // ==== Cámara adaptativa ====
    const camera = new THREE.PerspectiveCamera(
        window.innerWidth < 768 ? 60 : window.innerWidth < 1024 ? 50 : 45,
        width / height,
        1,
        100
    );
    camera.position.set(0, 2.5, 6);
    
    // ==== Controles mejorados ====
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Controles adaptativos según dispositivo
    const isDesktop = window.innerWidth >= 1024;
    controls.enableRotate = isDesktop;
    controls.enableZoom = false; // Zoom completamente deshabilitado
    controls.enablePan = false;
    
    // Botón de auto-rotación para desktop
    let autoRotateButton = null;
    let isAutoRotating = false;
    
    if (isDesktop) {
        autoRotateButton = document.createElement('button');
        autoRotateButton.className = 'map-auto-rotate-btn';
        autoRotateButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
        autoRotateButton.title = 'Auto-rotación';
        autoRotateButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(47, 122, 216, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%);
            color: white;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(47, 122, 216, 0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            z-index: 90;
        `;
        
        autoRotateButton.addEventListener('mouseenter', () => {
            autoRotateButton.style.transform = 'scale(1.1)';
            autoRotateButton.style.boxShadow = '0 6px 20px rgba(47, 122, 216, 0.4)';
        });
        
        autoRotateButton.addEventListener('mouseleave', () => {
            autoRotateButton.style.transform = 'scale(1)';
            autoRotateButton.style.boxShadow = '0 4px 16px rgba(47, 122, 216, 0.3)';
        });
        
        autoRotateButton.addEventListener('click', () => {
            isAutoRotating = !isAutoRotating;
            controls.autoRotate = isAutoRotating;
            controls.autoRotateSpeed = isAutoRotating ? 2 : 0;
            
            autoRotateButton.style.background = isAutoRotating 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(21, 128, 61, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(47, 122, 216, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)';
            
            autoRotateButton.querySelector('i').style.animation = isAutoRotating 
                ? 'spin 2s linear infinite' 
                : 'none';
        });
        
        container.style.position = 'relative';
        container.appendChild(autoRotateButton);
    }
    
    controls.update();
    
    // ==== Resize handler con debounce ====
    const handleResize = debounce(() => {
        const { width, height } = getCanvasSize();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        
        // Ajustar FOV según dispositivo
        const newIsDesktop = window.innerWidth >= 1024;
        camera.fov = window.innerWidth < 768 ? 60 : window.innerWidth < 1024 ? 50 : 45;
        camera.updateProjectionMatrix();
        
        // Actualizar controles según dispositivo
        if (newIsDesktop !== isDesktop) {
            controls.enableRotate = newIsDesktop;
            controls.enableZoom = false; // Zoom siempre deshabilitado
            
            if (!newIsDesktop) {
                // Resetear posición en móvil/tablet
                camera.position.set(0, 2.5, 6);
                controls.target.set(0, 0.5, 0);
                controls.update();
            }
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // ==== Raycasting para interacciones ====
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let cantonMeshes = [];
    let currentlyHovered = null;
    
    // ==== Mapeo de nombres de cantones ====
    const cantonNameMap = {
        'Text085': 'loja', 'Text121': 'saraguro', 'Text091': 'catamayo',
        'Text137_1': 'gonzanama', 'Text060': 'quilanga', 'Text070': 'espindola',
        'Text055': 'calvas', 'Text103': 'paltas', 'Text116': 'puyango',
        'Text027': 'pindal', 'Text021': 'zapotillo', 'Text035': 'macara',
        'Text043': 'sozoranga', 'Text100': 'olmedo', 'Text143_1': 'celica',
        'Text016_1': 'chaguarpamba',
    };
    
    const evitar = {
        'Text085_1': 'loja', 'Text121_1': 'saraguro', 'Text091_1': 'catamayo',
        'Text137': 'gonzanama', 'Text060_1': 'quilanga', 'Text070_1': 'espindola',
        'Text055_1': 'calvas', 'Text103_1': 'paltas', 'Text116_1': 'puyango',
        'Text027_1': 'pindal', 'Text021_1': 'zapotillo', 'Text035_1': 'macara',
        'Text043_1': 'sozoranga', 'Text100_1': 'olmedo', 'Text143': 'celica',
        'Text016': 'chaguarpamba',
    };
    
    // ==== Cargar modelo GLTF ====
    const loader = new GLTFLoader();
    loader.load(
        'build/3d/loja1.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            model.rotation.x = 0;
            model.scale.set(0.4, 0.4, 0.4);
            scene.add(model);
            
            model.traverse((child) => {
                if (child.isMesh) {
                    if (evitar.hasOwnProperty(child.name)) return;
                    
                    cantonMeshes.push(child);
                    child.userData.originalMaterial = {
                        color: child.material.color.clone(),
                        emissive: child.material.emissive.clone()
                    };
                    
                    const cantonName = cantonNameMap[child.name];
                    child.userData.name = cantonName || child.name || "Cantón sin nombre";
                    child.userData.eventCount = eventosPorCanton[cantonName] ? eventosPorCanton[cantonName].length : 0;
                }
            });
            
            animate();
        },
        (progress) => {
            // Progreso de carga
            const percent = (progress.loaded / progress.total * 100);
            const progressBar = document.querySelector('.map-loading-bar');
            if (progressBar) {
                progressBar.style.width = Math.min(percent, 90) + '%';
            }
        },
        (error) => {
            console.error('Error cargando modelo 3D:', error);
            hideLoadingIndicator();
            
            Swal.fire({
                title: 'Error al Cargar',
                text: 'No se pudo cargar el modelo 3D del mapa.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    );
    
    // ==== Interacciones mejoradas ====
    
    // Hover con tooltip
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (!isDesktop) return; // Solo en desktop
        
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cantonMeshes);
        
        if (intersects.length > 0) {
            const hovered = intersects[0].object;
            
            if (currentlyHovered !== hovered) {
                // Restaurar anterior
                if (currentlyHovered) {
                    currentlyHovered.material.color.copy(currentlyHovered.userData.originalMaterial.color);
                    currentlyHovered.material.emissive.copy(currentlyHovered.userData.originalMaterial.emissive);
                }
                
                currentlyHovered = hovered;
                // Colores más vibrantes para hover
                currentlyHovered.material.color.set('#4f9eff');
                currentlyHovered.material.emissive.set('#2d5aa0');
                
                renderer.domElement.style.cursor = 'pointer';
            }
            
            // Mostrar tooltip con datos del cantón
            const cantonData = hovered.userData.eventCount > 0 ? 
                logrosData.filter(logro => logro.canton.toLowerCase() === hovered.userData.name.toLowerCase()) : 
                null;
            
            showTooltip(
                event.clientX, 
                event.clientY, 
                hovered.userData.name,
                hovered.userData.eventCount,
                cantonData
            );
            
        } else {
            if (currentlyHovered) {
                currentlyHovered.material.color.copy(currentlyHovered.userData.originalMaterial.color);
                currentlyHovered.material.emissive.copy(currentlyHovered.userData.originalMaterial.emissive);
                currentlyHovered = null;
                renderer.domElement.style.cursor = 'grab';
            }
            hideTooltip();
        }
    });
    
    // Ocultar tooltip cuando el mouse sale del canvas
    renderer.domElement.addEventListener('mouseleave', hideTooltip);
    
    // ==== Click mejorado con feedback ====
    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cantonMeshes);
        
        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            
            // Efecto visual de click
            const originalEmissive = clicked.material.emissive.clone();
            clicked.material.emissive.set('#ffffff');
            
            setTimeout(() => {
                clicked.material.emissive.copy(originalEmissive);
            }, 150);
            
            showCantonPopup(clicked.userData.name);
        }
    });
    
    // ==== Loop de animación ====
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    // ==== Popup de cantón completamente rediseñado ====
    function showCantonPopup(cantonName) {
        const eventos = eventosPorCanton[cantonName] || [];
        
        let swiperSlides = '';
        let eventCardsHTML = '';
        let statsHTML = '';
        
        if (eventos.length > 0) {
            // Crear slides del swiper
            eventos.forEach(evento => {
                let imagenes = [];
                try { 
                    imagenes = JSON.parse(evento.imagenes); 
                } catch {}
                
                if (imagenes.length > 0) {
                    imagenes.forEach(img => {
                        swiperSlides += `
                            <div class="swiper-slide">
                                <img src="/build/img/mapa/${img}.png" 
                                     style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                            </div>`;
                    });
                }
            });
            
            // Crear cards de eventos
            eventos.forEach((evento, index) => {
                const fecha = new Date(evento.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                eventCardsHTML += `
                    <div class="evento-card" style="margin-bottom: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid #4f9eff;">
                        <h4 style="margin: 0 0 8px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${evento.nombre}</h4>
                        <span style="color: #94a3b8; font-size: 13px; font-weight: 500;">
                            <i class="fas fa-calendar-alt" style="margin-right: 6px;"></i>${fecha}
                        </span>
                        <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 14px; line-height: 1.4;">
                            ${evento.descripcion.length > 120 ? evento.descripcion.substring(0, 120) + '...' : evento.descripcion}
                        </p>
                    </div>`;
            });
            
            // Estadísticas
            const fechas = eventos.map(e => new Date(e.fecha).getFullYear());
            const añoMasReciente = Math.max(...fechas);
            const añoMasAntiguo = Math.min(...fechas);
            
            statsHTML = `
                <div class="canton-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-top: 20px;">
                    <div class="stat-item" style="text-align: center; padding: 12px; background: rgba(79, 159, 255, 0.1); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #4f9eff;">${eventos.length}</div>
                        <div style="font-size: 12px; color: #94a3b8;">Eventos Total</div>
                    </div>
                    <div class="stat-item" style="text-align: center; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${añoMasReciente}</div>
                        <div style="font-size: 12px; color: #94a3b8;">Más Reciente</div>
                    </div>
                    <div class="stat-item" style="text-align: center; padding: 12px; background: rgba(168, 85, 247, 0.1); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #a855f7;">${añoMasAntiguo}</div>
                        <div style="font-size: 12px; color: #94a3b8;">Más Antiguo</div>
                    </div>
                </div>`;
            
            // Placeholder si no hay imágenes
            if (!swiperSlides) {
                swiperSlides = `
                    <div class="swiper-slide">
                        <div style="width:100%;height:100%;background:linear-gradient(135deg, #4f9eff 0%, #2d5aa0 100%);display:flex;align-items:center;justify-content:center;border-radius:8px;">
                            <i class="fas fa-map-marked-alt" style="font-size: 48px; color: rgba(255,255,255,0.7);"></i>
                        </div>
                    </div>`;
            }
            
        } else {
            // Sin eventos
            swiperSlides = `
                <div class="swiper-slide">
                    <div style="width:100%;height:100%;background:linear-gradient(135deg, #6b7280 0%, #4b5563 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;">
                        <i class="fas fa-calendar-times" style="font-size: 48px; color: rgba(255,255,255,0.5); margin-bottom: 12px;"></i>
                        <span style="color: rgba(255,255,255,0.7); font-size: 14px;">Sin eventos registrados</span>
                    </div>
                </div>`;
            
            eventCardsHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                    <i class="fas fa-info-circle" style="font-size: 32px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p style="margin: 0; font-size: 16px;">No hay eventos registrados para este cantón.</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.7;">¡Pronto habrá más contenido disponible!</p>
                </div>`;
            
            statsHTML = '';
        }
        
        Swal.fire({
            title: `
                <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
                    <i class="fas fa-map-marker-alt" style="color: #4f9eff;"></i>
                    <span>Cantón ${cantonName.charAt(0).toUpperCase() + cantonName.slice(1)}</span>
                </div>
            `,
            html: `
                <div class="canton-popup-content">
                    <!-- Swiper de imágenes -->
                    <div class="swiper-container-map" style="width: 100%; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                        <div class="swiper-wrapper">
                            ${swiperSlides}
                        </div>
                        <div class="swiper-pagination" style="bottom: 12px;"></div>
                        <div class="swiper-button-next" style="color: rgba(255,255,255,0.8); font-size: 18px;"></div>
                        <div class="swiper-button-prev" style="color: rgba(255,255,255,0.8); font-size: 18px;"></div>
                    </div>
                    
                    <!-- Lista de eventos -->
                    <div class="eventos-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
                        ${eventCardsHTML}
                    </div>
                    
                    <!-- Estadísticas -->
                    ${statsHTML}
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: window.innerWidth < 500 ? '95vw' : 600,
            padding: '20px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            customClass: {
                popup: 'canton-popup-modern',
                title: 'canton-popup-title',
                htmlContainer: 'canton-popup-html',
                closeButton: 'canton-popup-close'
            },
            didOpen: () => {
                // Destruir swiper anterior si existe
                if (window.mapSwiper && window.mapSwiper.destroy) {
                    window.mapSwiper.destroy(true, true);
                }
                
                // Inicializar nuevo swiper
                window.mapSwiper = new Swiper('.swiper-container-map', {
                    loop: eventos.length > 1,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },
                    autoplay: eventos.length > 1 ? {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    } : false,
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true
                    },
                    speed: 800,
                });
                
                // Estilos adicionales para el popup
                const style = document.createElement('style');
                style.textContent = `
                    .canton-popup-modern {
                        border-radius: 16px !important;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }
                    .canton-popup-title {
                        color: #ffffff !important;
                        font-size: 20px !important;
                        font-weight: 600 !important;
                        margin-bottom: 16px !important;
                    }
                    .canton-popup-close {
                        color: rgba(255, 255, 255, 0.7) !important;
                        font-size: 24px !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 50% !important;
                        width: 36px !important;
                        height: 36px !important;
                        top: 16px !important;
                        right: 16px !important;
                    }
                    .canton-popup-close:hover {
                        background: rgba(239, 68, 68, 0.8) !important;
                        color: white !important;
                    }
                    .eventos-list::-webkit-scrollbar {
                        width: 6px;
                    }
                    .eventos-list::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                    }
                    .eventos-list::-webkit-scrollbar-thumb {
                        background: rgba(79, 159, 255, 0.6);
                        border-radius: 3px;
                    }
                    .eventos-list::-webkit-scrollbar-thumb:hover {
                        background: rgba(79, 159, 255, 0.8);
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
}
