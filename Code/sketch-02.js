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

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    // cx, cy = centre of circle
    const cx = width * 0.5;
    const cy = height * 0.5 ;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    // number of copies of stick
    const num = 66;
    const radius = width * 0.3;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      // drawing sticks
      context.save();
      context.fillStyle = 'black';
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.lineWidth = random.range(5, 20);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.beginPath();
      context.arc(0, 0, radius * random.range( 0.7, 1.3), 
                  slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();
    }

    /////////////////////////////////////////////////////////////////////

    context.fillStyle = 'black';
    // cx, cy = centre of circle
    const cx1 = width * 0.005;
    const cy1 = height * 1;
    const w1 = width * 0.01;
    const h1 = height * 0.1;
    let x1, y1;

    // number of copies of stick
    const num1 = 20;
    const radius1 = width * 0.3;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num1; i++) {
      const slice1 = math.degToRad(360 / num1);
      const angle1 = slice1 * i;

      x1 = cx1 + radius1 * Math.sin(angle1);
      y1 = cy1 + radius1 * Math.cos(angle1);

      // drawing sticks
      context.save();
      context.fillStyle = 'black';
      context.translate(x1, y1);
      context.rotate(-angle1);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));
      context.beginPath();
      context.rect(-w1 * 0.5, random.range(0, -h1 * 0.5), w1, h1);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.lineWidth = random.range(5, 20);
      context.translate(cx1, cy1);
      context.rotate(-angle1);
      context.beginPath();
      context.arc(0, 0, radius1 * random.range( 0.7, 1.3), 
                  slice1 * random.range(1, -8), slice1 * random.range(1, 5));
      context.stroke();
      context.restore();
    }

    /////////////////////////////////////////////////////////////////////

    context.fillStyle = 'black';
    // cx, cy = centre of circle
    const cx12 = width * 1;
    const cy12 = height * 0.005;
    const w12 = width * 0.01;
    const h12 = height * 0.1;
    let x12, y12;

    // number of copies of stick
    const num12 = 20;
    const radius12 = width * 0.3;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num12; i++) {
      const slice12 = math.degToRad(360 / num12);
      const angle12 = slice12 * i;

      x12 = cx12 + radius12 * Math.sin(angle12);
      y12 = cy12 + radius12 * Math.cos(angle12);

      // drawing sticks
      context.save();
      context.fillStyle = 'black';
      context.translate(x12, y12);
      context.rotate(-angle12);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));
      context.beginPath();
      context.rect(-w12 * 0.5, random.range(0, -h12 * 0.5), w12, h12);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.lineWidth = random.range(5, 20);
      context.translate(cx12, cy12);
      context.rotate(-angle12);
      context.beginPath();
      context.arc(0, 0, radius12 * random.range( 0.7, 1.3), 
                  slice12 * random.range(1, -8), slice12 * random.range(1, 5));
      context.stroke();
      context.restore();
    }

    /////////////////////////////////////////////////////////////////////

    context.fillStyle = 'red';
    // cx, cy = centre of circle
    const cx123 = width * 0.1;
    const cy123 = height * 0.5 ;
    const w123 = width * 0.01;
    const h123 = height * 0.1;
    let x123, y123;

    // number of copies of stick
    const num123 = 1006;
    const radius123 = width123 * 0.3;
    //change angle of rotation based on the index of loop
    for (let i = 0; i < num123; i++) {
      const slice123 = math.degToRad(360 / num123);
      const angle123 = slice123 * i;

      x123 = cx123 + radius123 * Math.sin(angle123);
      y123 = cy123 + radius123 * Math.cos(angle123);

      // drawing sticks
      context.save();
      context.fillStyle = 'red';
      context.translate(x123, y123);
      context.rotate(-angle123);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));
      context.beginPath();
      context.rect(-w123 * 0.5, random.range(0, -h123 * 0.5), w123, h123);
      context.fill();
      context.restore();

      // drawing arcs
      context.save();
      context.lineWidth = random.range(5, 20);
      context.translate(cx123, cy123);
      context.rotate(-angle123);
      context.beginPath();
      context.arc(0, 0, radius123 * random.range( 0.7, 1.3), 
                  slice123 * random.range(1, -8), slice123 * random.range(1, 5));
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);