const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
// random color palette
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300
};

const sketch = () => {

  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  return ({ context, width, height }) => {
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    // cx, cy = centre of circle //////////////////////////////////////////
    const cx = width * 0.5;
    const cy = height * 0.5;
    // width and height of sticks /////////////////////////////////////////
    const w = width * 0.01;
    const h = height * 0.2;
    let x, y;

    // number of copies of stick //////////////////////////////////////////
    const num = 50;
    // size of circle /////////////////////////////////////////////////////
    const radius = width * 0.4;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      // drawing sticks
      context.save();
      context.fillStyle = random.pick(palette);
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.5, 2), random.range(0.2, 0.5));
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.strokeStyle = random.pick(palette);
      context.lineWidth = random.range(5, 25);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.beginPath();
      context.arc(0, 0, radius * random.range(0.01, 2), 
                  slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();

      // drawing arcs
      context.save();
      context.strokeStyle = random.pick(palette);
      context.lineWidth = random.range(5, 25);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.beginPath();
      context.arc(0, 0, radius * random.range(0.4, 2), 
                  slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();
    }
  }
};

canvasSketch(sketch, settings);