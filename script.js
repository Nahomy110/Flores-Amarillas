// Configuración básica de Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 30;
controls.minDistance = 3;

function updateCameraPerspective() {
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPortrait) {
    camera.fov = 85;
    camera.position.set(0, 9, 14);
  } else {
    camera.fov = 60;
    camera.position.set(0, 5, 11);
  }
  controls.target.set(0, 1, 0);
  camera.updateProjectionMatrix();
  controls.update();
}
updateCameraPerspective();

// --- FUNCIÓN PARA GENERAR TEXTURA DE FLORES Y BRILLOS EN TIEMPO REAL ---
function createSunflowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Pétalos amarillos
  ctx.translate(64, 64);
  ctx.fillStyle = '#ffcc00';
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 35, 8, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate((Math.PI * 2) / 12);
  }

  // Centro de la flor (marrón con brillo)
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#5a3d00';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#3a2500';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 180, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

// --- RESPLANDOR Y NÚCLEO LUMINOSO EN EL CENTRO ---
const glowTexture = createGlowTexture();
const glowMaterial = new THREE.SpriteMaterial({
  map: glowTexture,
  color: 0xffea00,
  transparent: true,
  blending: THREE.AdditiveBlending,
  opacity: 0.85
});
const centralGlow = new THREE.Sprite(glowMaterial);
centralGlow.scale.set(7, 7, 1);
centralGlow.position.set(0, 1.8, 0);
scene.add(centralGlow);

// --- GALAXIA DE PARTÍCULAS DORADAS ---
const particleCount = 8500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = Math.random() * 8.0 + 0.5;
  const spinAngle = radius * 3.5;
  const branchAngle = ((i % 4) * 2 * Math.PI) / 4;

  const randomX = (Math.random() - 0.5) * 0.5;
  const randomY = (Math.random() - 0.5) * 0.3;
  const randomZ = (Math.random() - 0.5) * 0.5;

  const x = Math.cos(spinAngle + branchAngle) * radius + randomX;
  const y = randomY + (Math.sin(radius * 2) * 0.2);
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
  size: window.innerWidth < 600 ? 0.055 : 0.045,
  vertexColors: true,
  transparent: true,
  opacity: 0.9
});

const galaxy = new THREE.Points(geometry, particleMaterial);
scene.add(galaxy);

// --- CORAZÓN BRILLANTE EN EL CENTRO ---
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

  heartPos[i * 3] = (x / 13) + (Math.random() - 0.5) * 0.15;
  heartPos[i * 3 + 1] = (y / 13) + (Math.random() - 0.5) * 0.15;
  heartPos[i * 3 + 2] = (z / 13) + (Math.random() - 0.5) * 0.15;
}

heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
const heartMat = new THREE.PointsMaterial({
  color: 0xffffaa,
  size: 0.06,
  transparent: true,
  opacity: 0.95
});

const heartParticles = new THREE.Points(heartGeo, heartMat);
heartGroup.add(heartParticles);
heartGroup.position.set(0, 2.0, 0);
scene.add(heartGroup);

// --- FLORES AMARILLAS FLOTANTES (3D SPRITES) ---
const flowerTexture = createSunflowerTexture();
const flowerMaterial = new THREE.SpriteMaterial({
  map: flowerTexture,
  transparent: true,
  opacity: 0.95
});

const flowersGroup = new THREE.Group();
const flowerCount = 16;

for (let i = 0; i < flowerCount; i++) {
  const sprite = new THREE.Sprite(flowerMaterial);
  const angle = (i / flowerCount) * Math.PI * 2;
  const dist = 2.5 + Math.random() * 3.5;

  sprite.position.x = Math.cos(angle) * dist;
  sprite.position.z = Math.sin(angle) * dist;
  sprite.position.y = (Math.random() - 0.2) * 2.5;

  const scale = 0.5 + Math.random() * 0.4;
  sprite.scale.set(scale, scale, 1);

  flowersGroup.add(sprite);
}
scene.add(flowersGroup);

// --- FRASES FLOTANTES 3D ---
const messages = [
  "Te Adoro 🌻", "Eres mi sol ☀️", "Eres preciosa ✨", 
  "Mi solecito 💛", "Eres preciosa", "Siempre fabulosa ❤️", 
  "Siempre juntos 💫", "Eres única 🌟", "Eres mi todo 💖",
  "Contigo, las risas no faltan", "Tienes un lindo corazon", "Luz de mis días 🌞",
  "Gracias por estar aquí", "Yo soy tu amigo fiel jaja", "Tu sonrisa brilla 🌼",
  "Compañera de vida", "Mi persona favorita 🌻", "Nunca dejes de brillar ✨"
];

const labelsHTML = [];

messages.forEach((text, idx) => {
  const angle = (idx / messages.length) * Math.PI * 2;
  const dist = 3.0 + Math.random() * 3.0;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const y = (Math.random() - 0.2) * 2.2;

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

    if (tempV.z > 1 || x < 10 || x > window.innerWidth - 10 || y < 10 || y > window.innerHeight - 10) {
      item.element.style.opacity = '0';
    } else {
      item.element.style.opacity = '1';
    }
  });
}

// --- ANIMACIÓN CONTINUA Y RENDERIZADO ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  galaxy.rotation.y += 0.0018;
  heartGroup.rotation.y += 0.006;
  flowersGroup.rotation.y += 0.003;

  // Efecto latido / pulso en el resplandor central
  const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
  centralGlow.scale.set(7 * pulse, 7 * pulse, 1);

  controls.update();
  updateLabels();

  renderer.render(scene, camera);
}
animate();

// Control de Modal
const modal = document.getElementById('cardModal');
const closeBtn = document.getElementById('closeBtn');

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500);
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCameraPerspective();
});

