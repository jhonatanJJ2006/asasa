import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('container');
const infoPopup = document.getElementById('info-popup');

// Ocultar popup al cargar la página
infoPopup.style.display = 'none';

// datos
let contador = 0;
let datos = cargarDatos();

// Renderer con fondo transparente
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
container.appendChild(renderer.domElement);

// Scene & environment
const scene = new THREE.Scene();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.background = null;

// Camera
const camera = new THREE.PerspectiveCamera(
  40,
  container.clientWidth / container.clientHeight,
  1,
  100
);
camera.position.set(0, 2, 5);

// Controls (sin interacción, solo para mirar objetivo)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let cantonMeshes = [];
let currentlyHovered = null;
let mouseScreenPos = { x: 0, y: 0 };

// Controla si el mouse ya se movió para mostrar popup
let mouseMoved = false;

// Mapas de nombres y evitar
const cantonNameMap = {
  'Text085': 'loja',
  'Text121': 'saraguro',
  'Text091': 'catamayo',
  'Text137_1': 'gonzanama',
  'Text060': 'quilanga',
  'Text070': 'espindola',
  'Text055': 'calvas',
  'Text103': 'paltas',
  'Text116': 'puyango',
  'Text027': 'pindal',
  'Text021': 'zapotillo',
  'Text035': 'macara',
  'Text043': 'sozoranga',
  'Text100': 'olmedo',
  'Text143_1': 'celica',
  'Text016_1': 'chaguarpamba',
};

const evitar = {
  'Text085_1': 'loja',
  'Text121_1': 'saraguro',
  'Text091_1': 'catamayo',
  'Text137': 'gonzanama',
  'Text060_1': 'quilanga',
  'Text070_1': 'espindola',
  'Text055_1': 'calvas',
  'Text103_1': 'paltas',
  'Text116_1': 'puyango',
  'Text027_1': 'pindal',
  'Text021_1': 'zapotillo',
  'Text035_1': 'macara',
  'Text043_1': 'sozoranga',
  'Text100_1': 'olmedo',
  'Text143': 'celica',
  'Text016': 'chaguarpamba',
};

// Cargar modelo GLB
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
        if (evitar.hasOwnProperty(child.name)) return; // ignorar

        cantonMeshes.push(child);
        child.userData.originalMaterial = child.material;

        const cantonName = cantonNameMap[child.name];
        child.userData.name = cantonName || child.name || "Cantón sin nombre";
      }
    });

    animate();
  },
  undefined,
  (error) => {
    console.error('Error cargando el modelo GLB:', error);
  }
);

// Detectar movimiento mouse
function onMouseMove(event) {
  mouseMoved = true;

  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  mouseScreenPos.x = event.clientX;
  mouseScreenPos.y = event.clientY;

  if (currentlyHovered?.userData?.name && mouseMoved) {
    showInfoPopup(currentlyHovered.userData.name, mouseScreenPos.x, mouseScreenPos.y);
  } else {
    hideInfoPopup();
  }
}
window.addEventListener('mousemove', onMouseMove);

// Resize handler
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cantonMeshes);

  if (intersects.length > 0) {
    const intersected = intersects[0].object;

    if (currentlyHovered !== intersected) {
      if (currentlyHovered) {
        currentlyHovered.material = currentlyHovered.userData.originalMaterial;
      }

      currentlyHovered = intersected;
      currentlyHovered.material = currentlyHovered.material.clone();

      const originalColor = currentlyHovered.userData.originalMaterial.color.clone();
      const factor = 0.7; // 30% más oscuro
      const darkerColor = originalColor.multiplyScalar(factor);

      currentlyHovered.material.emissive = darkerColor;

      // Solo mostrar popup si el mouse ya se movió (hover real)
      if (mouseMoved) {
        showInfoPopup(currentlyHovered.userData.name, mouseScreenPos.x, mouseScreenPos.y);
      } else {
        // Si no se movió el mouse (por ejemplo al inicio), ocultar popup
        hideInfoPopup();
      }
    }
  } else {
    if (currentlyHovered) {
      currentlyHovered.material = currentlyHovered.userData.originalMaterial;
      currentlyHovered = null;

      hideInfoPopup();
    }
  }

  renderer.render(scene, camera);
}

// Mostrar popup con info
function showInfoPopup(cantonName, x, y) {
  infoPopup.style.display = 'block';
  infoPopup.style.left = x + 15 + 'px';
  infoPopup.style.top = y + 15 + 'px';

  infoPopup.innerHTML = `
    <h3 style="margin:0 0 10px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      Cantón: ${cantonName}
    </h3>

    <!-- Swiper -->
    <div class="swiper-container" style="width: 250px; height: 150px; border-radius: 8px; overflow: hidden;">
      <div class="swiper-wrapper">
        <div class="swiper-slide" style="display:flex; align-items:center; justify-content:center;">
          <picture>
            <source srcset="ruta-imagen1.avif" type="image/avif">
            <img src="ruta-imagen1.png" alt="Imagen 1" style="width: 100%; height: 100%; object-fit: cover;">
          </picture>
        </div>
        <div class="swiper-slide" style="display:flex; align-items:center; justify-content:center;">
          <picture>
            <source srcset="ruta-imagen2.avif" type="image/avif">
            <img src="ruta-imagen2.png" alt="Imagen 2" style="width: 100%; height: 100%; object-fit: cover;">
          </picture>
        </div>
        <div class="swiper-slide" style="display:flex; align-items:center; justify-content:center;">
          <picture>
            <source srcset="ruta-imagen3.avif" type="image/avif">
            <img src="ruta-imagen3.png" alt="Imagen 3" style="width: 100%; height: 100%; object-fit: cover;">
          </picture>
        </div>
      </div>
      <!-- Paginación -->
      <div class="swiper-pagination"></div>
      <!-- Navegación -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <div style="margin-top:10px; font-size: 13px; color: #ddd; max-height: 80px; overflow-y: auto; font-family: Arial, sans-serif;">
      Aquí puedes poner información adicional o descripción del cantón.
    </div>
  `;

  // Inicializar Swiper para el popup
  if (window.popupSwiper) {
    window.popupSwiper.destroy(true, true);
  }
  window.popupSwiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
}

// Ocultar popup
function hideInfoPopup() {
  infoPopup.style.display = 'none';
}

// cargar datos base de datos
function cargarDatos() {

  fetch('/cargarDatos/mapa', {
    method: 'POST',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(resultado => {
      console.log(resultado);
    })
    .catch(error => {
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
    });

}
