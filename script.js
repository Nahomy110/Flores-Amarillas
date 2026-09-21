// Configuración básica de Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controles de cámara orbital para rotar la galaxia manualmente
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 20;
controls.minDistance = 3;

camera.position.set(0, 6, 12);
controls.update();

// --- GALAXIA DE PARTÍCULAS DORADAS ---
const particleCount = 8000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = Math.random() * 8 + 0.5;
  const spinAngle = radius * 3.5;
  const branchAngle = ((i % 4) * 2 * Math.PI) / 4;

  const randomX = (Math.random() - 0.5) * 0.6;
  const randomY = (Math.random() - 0.5) * 0.4;
  const randomZ = (Math.random() - 0.5) * 0.6;

  const x = Math.cos(spinAngle + branchAngle) * radius + randomX;
  const y = randomY + (Math.sin(radius * 2) * 0.3);
  const z = Math.sin(spinAngle + branchAngle) * radius + randomZ;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  // Colores en tonos amarillos y dorados brillantes
  colors[i * 3] = 1.0;
  colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
  colors[i * 3 + 2] = 0.1;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.9
});

const galaxy = new THREE.Points(geometry, particleMaterial);
scene.add(galaxy);

// --- CORAZÓN BRILLANTE DE PARTÍCULAS EN EL CENTRO ---
const heartGroup = new THREE.Group();
const heartParticleCount = 1200;
const heartGeo = new THREE.BufferGeometry();
const heartPos = new Float32Array(heartParticleCount * 3);

for (let i = 0; i < heartParticleCount; i++) {
  const t = Math.PI * (Math.random() * 2 - 1);
  const u = Math.PI * (Math.random() - 0.5);

  // Ecuación paramétrica de corazón 3D
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  const z = u * 4;

  heartPos[i * 3] = (x / 12) + (Math.random() - 0.5) * 0.2;
  heartPos[i * 3 + 1] = (y / 12) + (Math.random() - 0.5) * 0.2;
  heartPos[i * 3 + 2] = (z / 12) + (Math.random() - 0.5) * 0.2;
}

heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
const heartMat = new THREE.PointsMaterial({
  color: 0xffea00,
  size: 0.06,
  transparent: true,
  opacity: 0.95
});

const heartParticles = new THREE.Points(heartGeo, heartMat);
heartGroup.add(heartParticles);
heartGroup.position.set(0, 2.5, 0);
scene.add(heartGroup);

// --- MENSAJES Y TEXTOS FLOTANTES ---
const messages = [
  "Te Amo", "Eres mi sol", "Eres preciosa", 
  "Mi Amor", "Me encantas", "Amor de mi vida", 
  "Siempre juntos", "Eres única", "Eres mi todo"
];

const labelsHTML = [];

messages.forEach((text, idx) => {
  const angle = (idx / messages.length) * Math.PI * 2;
  const dist = 3.5 + Math.random() * 2;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const y = Math.random() * 1.5;

  const div = document.createElement('div');
  div.className = 'label-3d';
  div.innerText = text;
  document.body.appendChild(div);

  labelsHTML.push({
    element: div,
    pos: new THREE.Vector3(x, y, z)
  });
});

function updateLabels() {
  const tempV = new THREE.Vector3();
  labelsHTML.forEach(item => {
    tempV.copy(item.pos);
    tempV.project(camera);

    const x = (tempV.x * .5 + .5) * window.innerWidth;
    const y = (tempV.y * -.5 + .5) * window.innerHeight;

    item.element.style.left = `${x}px`;
    item.element.style.top = `${y}px`;

    // Ocultar si está detrás de la cámara
    if (tempV.z > 1) {
      item.element.style.display = 'none';
    } else {
      item.element.style.display = 'block';
    }
  });
}

// --- BUCLE DE ANIMACIÓN ---
function animate() {
  requestAnimationFrame(animate);

  // Rotación suave de la galaxia y del corazón
  galaxy.rotation.y += 0.002;
  heartGroup.rotation.y += 0.008;

  controls.update();
  updateLabels();

  renderer.render(scene, camera);
}
animate();

const modal = document.getElementById('cardModal');
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', () => {
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
});

// Redimensionamiento de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});