const canvasSketch = require('canvas-sketch');
// lerp is linear interpolation
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random');
// random color palette
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300
};

const sketch = () => {

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
    const gridSize = 50;
    // create the grid
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // (gridSize - 1) to scale the shapes to be aligned properly.
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);
        // create an object
        // push an array of coordinates into point array
        gridCells.push({
          color: random.pick(palette),
          radius: Math.abs(random.gaussian() * 0.011), // 0.011
          position: [u, v]
        });
      }
    }
    return gridCells;
  };

  // filtering out some of the shapes
  // setting a deterministic seed for randomness. Outputs same piece on refresh
  // random.setSeed(1);
  const gridCells = createGrid().filter(() => random.value() > 0.6);
  // const gridCells = createGrid();
  //console.log(gridCells);

  // adding a margin around canvas using lerp (linear interpolation)
  const margin = 250;

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // loop through array where [u, v] is each individual point
    gridCells.forEach(data => {

      const {
        position,
        radius,
        color
      } = data;

      const [u, v] = position;

      // scale points back to pixels because canvas dimensions is in pixels
      // add margin using lerp
      // first param is min, then max, then any
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // now that we have each pixel coord (position) of the grid's cells
      // we can draw shapes at those positions
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fill();
    });

  };
};

canvasSketch(sketch, settings);