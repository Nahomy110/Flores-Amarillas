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
controls.maxDistance = 25;
controls.minDistance = 2;

camera.position.set(0, 6, 12);
controls.update();

// --- GALAXIA DE PARTÍCULAS DORADAS (Espiral 3D) ---
const particleCount = 9000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = Math.random() * 8.5 + 0.5;
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

// --- LISTA AMPLIADA DE MINI FRASES FLOTANTES ---
const messages = [
  "Te Adoro 🌻", "Eres mi sol ☀️", "Eres preciosa ✨", 
  "Mi solecito 💛", "Eres preciosa", "Siempre fabulosa ❤️", 
  "Siempre juntos 💫", "Eres única 🌟", "Eres mi todo 💖",
  "Contigo, las risas no faltan", "Tienes un lindo corazon", "Luz de mis días 🌞",
  "Gracias por estar aquí", "Yo soy tu amigo fiel jaja", "Tu sonrisa brilla 🌼",
  "Compañera de vida", "Mi persona favorita 🌻", "Nunca dejes de brillar ✨"
];

const labelsHTML = [];

// Distribución tridimensional alrededor de la galaxia
messages.forEach((text, idx) => {
  const angle = (idx / messages.length) * Math.PI * 2;
  // Distancias y alturas variadas para repartir las frases en 360°
  const dist = 3.0 + Math.random() * 4.5;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const y = (Math.random() - 0.3) * 3.5;

  const div = document.createElement('div');
  div.className = 'label-3d';
  div.innerText = text;
  document.body.appendChild(div);

  labelsHTML.push({
    element: div,
    pos: new THREE.Vector3(x, y, z)
  });
});

// Proyección dinámica de 3D a 2D según la cámara
function updateLabels() {
  const tempV = new THREE.Vector3();
  labelsHTML.forEach(item => {
    tempV.copy(item.pos);
    tempV.project(camera);

    const x = (tempV.x * .5 + .5) * window.innerWidth;
    const y = (tempV.y * -.5 + .5) * window.innerHeight;

    item.element.style.left = `${x}px`;
    item.element.style.top = `${y}px`;

    // Ocultar si la etiqueta queda detrás del plano de la cámara
    if (tempV.z > 1) {
      item.element.style.display = 'none';
    } else {
      item.element.style.display = 'block';
    }
  });
}

// --- BUCLE DE ANIMACIÓN Y ROTACIÓN ---
function animate() {
  requestAnimationFrame(animate);

  // Rotación constante de la galaxia y del corazón
  galaxy.rotation.y += 0.0018;
  heartGroup.rotation.y += 0.006;

  controls.update();
  updateLabels();

  renderer.render(scene, camera);
}
animate();

// --- CONTROL DEL MODAL Y CARTA ---
const modal = document.getElementById('cardModal');
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', () => {
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
});

// Ajuste automático ante cambios de tamaño de pantalla
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});