const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
  
};

// const degToRad = (degrees) => {
//   return degrees / 180 * Math.PI;
// };

// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min;
// };

const sketch = ({ context, width, height }) => {

  // array of particles
  const agents = [];
  // 50 = number of particles
  for (let i = 0; i < 50; i++) {
    const x1 = random.range(0, width);
    const y1 = random.range(0, height);

    agents.push(new Agent(x1, y1));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // drawing transparent multi-colored shapes
    // Circle - red
    context.globalAlpha = 0.82; // transparency
    context.save();
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 8;
    context.fillStyle = '#F70D1A';
    // setting shadows 
    context.shadowColor = 'black';
    context.shadowBlur = 12;
    context.shadowOffsetX = -15;
    context.shadowOffsetY = 10;
    ///////////////////
    context.arc(555, 400, 180, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();

    // Triangle - yellow
    context.save();
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 8;
    context.fillStyle = 'yellow';
    
    context.moveTo(800, 390);
    context.lineTo(470, 690);
    context.lineTo(900, 840);
    context.lineTo(802, 392);

    context.fill();
    context.stroke();
    context.restore();

    // Square - blue
    context.save();
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 8;
    context.fillStyle = '#00008B';
    context.rect(270, 470, width / 3, height / 3);
    context.fill();
    context.stroke();
    context.restore();
    


    // create particles
    context.globalAlpha = 1;
    agents.forEach(agent => {
      agent.draw(context);
    });

    context.fillStyle = 'black';
    // cx, cy = centre of circle //////////////////////////////////////////
    const cx = width * -0.11;
    const cy = height * 1.25;
    // width and height of sticks /////////////////////////////////////////
    const w = width * 0.013;
    const h = height * 0.1;
    let x, y;

    // number of copies of stick //////////////////////////////////////////
    const num = 220;
    // size of circle /////////////////////////////////////////////////////
    const radius = width * 1;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle) + 6;
      y = cy + radius * Math.cos(angle) + 6;

      // drawing sticks
      context.save();
      context.fillStyle = 'black';
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 1.5), random.range(0.1, 0.8));
      context.beginPath();
      // random.range(0, -h * 0.6) offsets the sticks, so not well aligned
      context.rect(-w * 1, random.range(1, -h * 5), w, h);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.strokeStyle = 'black';
      context.lineWidth = random.range(5, 18);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.beginPath();
      // radius * random.range( 0.7, 1.3) offsets the arcs ////////////////
      context.arc(0, 0, radius * random.range( 0.001, 1.5), 
                  slice * random.range(0, -34), slice * random.range(0, 12));
      context.stroke();
      context.restore();
    }

    ///////////////////////////////////////////////////////////////////////

  };
};

canvasSketch(sketch, settings);

// create particles
class Point {
  constructor(x1, y1) {
    this.x1 = x1;
    this.y1 = y1;
  }
}

class Agent {
  constructor(x1, y1) {
    this.pos = new Point(x1, y1);
    this.radius1 = random.range(5, 15);
  }

  draw(context) {
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(this.pos.x1, this.pos.y1, this.radius1, 0, Math.PI * 2);
    context.fill()
  }
}