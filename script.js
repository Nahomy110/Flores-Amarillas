const flower = document.getElementById('flowerContainer');
const title = document.getElementById('title');
const message = document.getElementById('message');
const particlesContainer = document.getElementById('particles');

// Generar partículas mágicas flotantes de fondo
function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  const size = Math.random() * 8 + 4;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
  
  particlesContainer.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 5000);
}

setInterval(createParticle, 300);

// Acción al hacer clic en la flor
let clicked = false;
flower.addEventListener('click', () => {
  if (!clicked) {
    title.innerText = "¡Para ti! 💛";
    message.innerText = "Nunca dejes de brillar. ¡Feliz día de las flores amarillas!";
    
    // Crear explosión de luces
    for (let i = 0; i < 25; i++) {
      createParticle();
    }
    clicked = true;
  } else {
    title.innerText = "¡Sigue sonriendo! ✨";
  }
});