const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const gravity = 0.2;

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2;
    this.velocity = {
      x: Math.random() * 6 - 3,
      y: Math.random() * 6 - 3,
    };
    this.alpha = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.velocity.y += gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.005;
  }
}

function createParticles(x, y) {
  const colors = ['#FF3F4E', '#FFFF99', '#00CCFF', '#FF9933', '#00FF00', '#FF66CC'];

  for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particle = new Particle(x, y, color);
    particles.push(particle);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();

    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  createParticles(mouseX, mouseY);
});

animate();

