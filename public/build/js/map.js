import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('container');

// Renderer con fondo transparente
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth * 1, container.clientHeight * 1);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
container.appendChild(renderer.domElement);

// Scene & environment
const scene = new THREE.Scene();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.background = null;

// Camera
const camera = new THREE.PerspectiveCamera(40, (container.clientWidth * 0.8) / (container.clientHeight * 0.8), 1, 100);
camera.position.set(0, 2, 5);

// Controls (solo necesarios para mirar al objetivo, pero sin interacción)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;

// Desactivar interacción
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let cantonMeshes = [];
let currentlyHovered = null;

// Cargar modelo GLB
const loader = new GLTFLoader();
loader.load(
  'build/3d/loja.glb',
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.rotation.x = 0; // Rotar un poco más en eje Y (~60 grados)
    model.scale.set(0.4, 0.4, 0.4);
    scene.add(model);

    model.traverse((child) => {
      if (child.isMesh) {
        cantonMeshes.push(child);
        child.userData.originalMaterial = child.material;
        child.userData.name = child.name || "Cantón sin nombre";
      }
    });

    animate();
  },
  undefined,
  function (error) {
    console.error('Error cargando el modelo GLB:', error);
  }
);

// Mousemove
function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove);

// Resize
window.addEventListener('resize', () => {
  const width = container.clientWidth * 0.8;
  const height = container.clientHeight * 0.8;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Loop
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
      currentlyHovered.material.emissive = new THREE.Color(0xffff00);

      console.log(`Cantón: ${currentlyHovered.userData.name}`);
    }
  } else {
    if (currentlyHovered) {
      currentlyHovered.material = currentlyHovered.userData.originalMaterial;
      currentlyHovered = null;
    }
  }

  renderer.render(scene, camera);
}
