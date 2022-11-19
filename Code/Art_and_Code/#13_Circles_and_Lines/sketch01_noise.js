const canvasSketch = require('canvas-sketch');
// lerp is linear interpolation
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random');
// random color palette
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300
};

const sketch = ({ width, height }) => {
 
  // choose a random color palette
  // palette includes 5 colors
  // to only pick a certain number of colors:
  // const palette = random.pick(palettes).slice(0, 2);
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const gridCells = [];
    // size in row * height
    // square grid
    const gridSize = 30;
    // create the grid
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // (gridSize - 1) to scale the shapes to be aligned properly.
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);
        // radius of circles
        // const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        const radius = random.value() * 0.09;
        // create an object
        // push an array of coordinates into point array
        gridCells.push({
          color: random.pick(palette),
          radius,
          position: [u, v],
          // multiply rotation by higher value for more rotation
          rotation: random.noise2D(u, v) * 1.5
        });
      }
    }
    return gridCells;
  };

  // filtering out some of the shapes
  // setting a deterministic seed for randomness. Outputs same piece on refresh
  // random.setSeed(1);
  // const gridCells = createGrid().filter(() => random.value() > 0.3);
  const gridCells = createGrid();
  //console.log(gridCells);

  // adding a margin around canvas using lerp (linear interpolation)
  const margin = 360;

  // array of circles
  const circles = [];
  for (let i = 0; i < 50; i++) {
    const x1 = random.range(margin, width - margin);
    const y1 = random.range(margin, height - margin);

    circles.push(new Circle(x1, y1));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);

    // draw circles
    circles.forEach(circle => {
      context.globalAlpha = 0.8;
      context.fillStyle = random.pick(palette);
      circle.draw(context);
    });


    // loop through array where [u, v] is each individual point
    gridCells.forEach(data => {

      const {
        position,
        radius,
        color,
        rotation
      } = data;

      const [u, v] = position;

      // scale points back to pixels because canvas dimensions is in pixels
      // add margin using lerp
      // first param is min, then max, then any
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // now that we have each pixel coord (position) of the grid's cells
      // we can draw shapes at those positions
      // Circles
      context.globalAlpha = 1;
      context.save();
      context.beginPath();
      context.fillStyle = random.pick(palette);
      context.arc(x, y, radius * width/40, 0, Math.PI * 2, false);
      context.translate(x, y);
      context.rotate(rotation);
      context.fill();
      context.restore();

      // Text
      context.globalAlpha = 1;
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width/1.2}px "Monaco"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('_', 0, 0);
      context.restore();
    });

  };
};

class Point {
  constructor(x1, y1) {
    this.x1 = x1;
    this.y1 = y1;
  }
}

class Circle {
  constructor(x1, y1) {
    this.pos = new Point(x1, y1);
    this.radius1 = random.range(20, 50);;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.pos.x1, this.pos.y1, this.radius1, 0, Math.PI * 2);
    context.fill()
  }
}

canvasSketch(sketch, settings);