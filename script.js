const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Campo de visión más amplio (75°) para que encaje bien en celulares
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 25;
controls.minDistance = 3;

// Ajusta la perspectiva según la orientación de la pantalla (Vertical/Celular vs Horizontal/PC)
function updateCameraPerspective() {
  const isPortrait = window.innerHeight > window.innerWidth;
  
  if (isPortrait) {
    // En celular colocamos la cámara más alta y con un ángulo inclinado hacia abajo
    camera.fov = 85; 
    camera.position.set(0, 9, 13);
  } else {
    // En computadora
    camera.fov = 60;
    camera.position.set(0, 5, 11);
  }
  
  controls.target.set(0, 1, 0);
  camera.updateProjectionMatrix();
  controls.update();
}

updateCameraPerspective();

// --- GALAXIA DE PARTÍCULAS DORADAS ---
const particleCount = 8500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = Math.random() * 7.5 + 0.5;
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

// --- CORAZÓN EN EL CENTRO ---
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
  color: 0xffea00,
  size: 0.055,
  transparent: true,
  opacity: 0.95
});

const heartParticles = new THREE.Points(heartGeo, heartMat);
heartGroup.add(heartParticles);
heartGroup.position.set(0, 2.0, 0);
scene.add(heartGroup);

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
  const dist = 2.8 + Math.random() * 2.8;
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

    // Visibilidad controlada dentro de los límites de la pantalla
    if (tempV.z > 1 || x < 10 || x > window.innerWidth - 10 || y < 10 || y > window.innerHeight - 10) {
      item.element.style.opacity = '0';
    } else {
      item.element.style.opacity = '1';
    }
  });
}

// --- ANIMACIÓN Y RENDERING ---
function animate() {
  requestAnimationFrame(animate);

  galaxy.rotation.y += 0.0018;
  heartGroup.rotation.y += 0.006;

  controls.update();
  updateLabels();

  renderer.render(scene, camera);
}
animate();

// Control del Modal
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

// Evento al redimensionar o rotar pantalla
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCameraPerspective();
});