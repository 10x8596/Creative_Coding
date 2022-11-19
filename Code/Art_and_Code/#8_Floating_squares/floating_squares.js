const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 1080, 1080 ],
  // animate the pic
  animate: true,
  fps: 24,
  duration: 10
};

// animate w/o canvas-sketch:
// const animate = () => {
//   console.log('animating');
//   requestAnimationFrame(animate);
// };
// animate();

// palette
const palette = random.pick(palettes);

const sketch = ({ context, width, height }) => {
  // array of agents
  const agents = [];

  for (let i = 0; i < 80; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    // populate array with dots
    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // create points on canvas
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

// create a class for the point
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1,1));
    this.radius = random.range(4,12);
  }

  // make agents bounce around when hit boundary
  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width)
      this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height)
      this.vel.y *= -1;
  }

  // add velocity to position
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.strokeStyle = random.pick(palette);
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 4;
    context.beginPath();
    context.rect(0, 0, random.value() * 300, random.value() * 300);
    context.fill();
    context.stroke();
    context.restore();
  }
}