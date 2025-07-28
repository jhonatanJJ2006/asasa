import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==== Utilidad: Cargar datos del backend (async/await) ====
async function cargarDatos() {
  try {
    const res = await fetch('/cargarDatos/mapa', { method: 'POST' });
    if (!res.ok) throw new Error('Error de red');
    return await res.json();
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al intentar realizar la acción.',
      icon: 'error',
      allowOutsideClick: false,
      confirmButtonText: 'Ok',
      customClass: {
        popup: 'alerta__popup',
        title: 'alerta__titulo',
        htmlContainer: 'alerta__contenedor',
        confirmButton: 'alerta__button'
      }
    });
    return null;
  }
}

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

  // ==== Responsividad ====
  function getCanvasSize() {
    if (window.innerWidth < 768) {
      const width = window.innerWidth;
      const height = Math.max(240, window.innerHeight * 0.45);
      container.style.width = width + 'px';
      container.style.height = height + 'px';
      return { width, height };
    } else {
      container.style.width = '';
      container.style.height = '';
      return { width: container.clientWidth, height: container.clientHeight };
    }
  }
  const { width, height } = getCanvasSize();

  // ==== THREE.js Init ====
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.margin = '0 auto';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    window.innerWidth < 768 ? 55 : 40,
    width / height,
    1,
    100
  );
  camera.position.set(0, 2, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.enableDamping = true;
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.update();

  // ==== Adaptar en resize ====
  window.addEventListener('resize', () => {
    const { width, height } = getCanvasSize();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = window.innerWidth < 768 ? 55 : 40;
    camera.updateProjectionMatrix();
  });

  // ==== Raycasting ====
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let cantonMeshes = [];
  let currentlyHovered = null;

  // ==== Nombres de cantones ====
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

  // ==== Cargar GLTF ====
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
        }
      });

      animate();
    }
  );

  // ==== Hover con color ====
  renderer.domElement.addEventListener('mousemove', (event) => {
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
        currentlyHovered.material.color.set('#2f7ad8');
        currentlyHovered.material.emissive.set('#1a3058');
      }
    } else {
      if (currentlyHovered) {
        currentlyHovered.material.color.copy(currentlyHovered.userData.originalMaterial.color);
        currentlyHovered.material.emissive.copy(currentlyHovered.userData.originalMaterial.emissive);
        currentlyHovered = null;
      }
    }
  });

  // ==== Click muestra SweetAlert2 ====
  renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cantonMeshes);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      showCantonPopup(clicked.userData.name);
    }
  });

  // ==== Animación ====
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // ==== Popup de cantón (muestra imágenes y descripciones por cantón) ====
  function showCantonPopup(cantonName) {
    // cantonName se maneja en minúsculas
    const eventos = eventosPorCanton[cantonName] || [];

    let swiperSlides = '';
    let descripcionHTML = '';

    if (eventos.length > 0) {
      eventos.forEach(evento => {
        // Imagenes es un JSON string
        let imagenes = [];
        try { imagenes = JSON.parse(evento.imagenes); } catch {}
        imagenes.forEach(img => {
          swiperSlides += `<div class="swiper-slide">
            <img src="/build/img/mapa/${img}.png" style="width:100%;height:100%;object-fit:cover;">
          </div>`;
        });
        descripcionHTML += `<div style="margin-bottom:8px;">
          <b>${evento.nombre}</b> <span style="font-size:0.92em;color:#aaa">(${evento.fecha})</span><br>
          <span style="font-size:0.96em;">${evento.descripcion}</span>
        </div>`;
      });
    } else {
      swiperSlides = `<div class="swiper-slide">
        <img src="/img/sin-eventos.png" style="width:100%;height:100%;object-fit:cover;opacity:.3;filter:grayscale(1);">
      </div>`;
      descripcionHTML = `<div style="color:#aaa;">No hay eventos registrados para este cantón.</div>`;
    }

    Swal.fire({
      title: `Cantón: ${cantonName.charAt(0).toUpperCase() + cantonName.slice(1)}`,
      html: `
        <div class="swiper-container-map" style="width: 100%; height: 220px; border-radius: 12px; overflow: hidden;">
          <div class="swiper-wrapper">
            ${swiperSlides}
          </div>
        </div>
        <div class="extra-texts" style="margin-top:8px;">
          ${descripcionHTML}
        </div>
      `,
      showConfirmButton: false,
      width: window.innerWidth < 500 ? '97vw' : 540,
      background: '#181c24',
      customClass: {
        popup: 'swal2-popup-canton'
      },
      didOpen: () => {
        // Evita conflicto con otros swipers
        if (window.mapSwiper && window.mapSwiper.destroy) {
          window.mapSwiper.destroy(true, true);
        }
        window.mapSwiper = new Swiper('.swiper-container-map', {
          loop: true,
          navigation: false,
          pagination: false,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        });
      }
    });
  }
}
