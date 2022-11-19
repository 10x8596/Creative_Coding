const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');
// const palettes = require('nice-color-palettes');

// a noise generator function is an essential tool for creative coding
// In essence, it allows us to have controlled randomness.

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  // pixelsPerInch: 300,
  // fps: 24,
  // duration: 10,
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 10,
  scaleMax: 50,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
};

// const palette = random.pick(palettes);

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // describe the grid
    const cols = params.cols;
    const rows = params.rows;
    // number of cells
    const numCells = cols * rows;
    // make the grid
    // grid width is 80% canvas width
    const gridWidth  = width  * 0.8;
    // grid height is 80% canvas height
    const gridHeight = height * 0.8;
    // width of each cell // width of grid divided by number of cols
    const cellWidth  = gridWidth  / cols;
    // height of each cell // height of grid divided by number of rows
    const cellHeight = gridHeight / rows;
    // margin: difference between the size of the canvas and grid
    // because there are two margins, one on the right and one on the left
    // we want half of the difference so times by 0.5
    const marginX    = (width  - gridWidth)  * 0.5;
    const marginY    = (height - gridHeight) * 0.5;

    for (let i = 0; i < numCells; i++) {
      // get each column
      const col = i % cols;
      // get each row
      const row = Math.floor(i / cols);
      // find x and y values of each cell
      const x = col * cellWidth;
      const y = row * cellHeight;
      // width and height of rectangles
      const w = cellWidth * 0.8;
      const h = cellHeight * 0.8;

      const f = params.animate ? frame : params.frame;

      // noise
      const n = random.noise3D(x, y, frame * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      // change scale of rects based on noise
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      // draw
      context.save();
      context.translate(x, y);
      context.translate(marginX, marginY);
      context.translate(cellWidth * 0.5, cellHeight * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      // gradient
      // var grd = context.createLinearGradient(0, 0, 0.5, 0.5);
      // grd.addColorStop(0.5, random.pick(palette));
      // grd.addColorStop(1, 'white');

      context.beginPath();
      context.strokeStyle = 'white';
      context.moveTo(w * -0.5, 0);
      context.lineTo(w *  0.5, 0);
      context.stroke();
      context.restore();

      // if (i % 6 == 0) {
      //   context.beginPath();
      //   context.strokeStyle = "rgb(228, 55, 55)";
      //   context.moveTo(w * -0.5, 0);
      //   context.lineTo(w *  0.5, 0);
      //   context.stroke();
      //   context.restore();
      // }
      // else {
      //   context.beginPath();
      //   context.strokeStyle = "white";
      //   context.moveTo(w * -0.5, 0);
      //   context.lineTo(w *  0.5, 0);
      //   context.stroke();
      //   context.restore();
      // }
    }

  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid '});
  folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square'}})
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1});
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1});
  folder.addInput(params, 'scaleMin', { min: 1, max: 100});
  folder.addInput(params, 'scaleMax', { min: 1, max: 100});

  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq', {min: -0.01, max: 0.01});
  folder.addInput(params, 'amp', {min: 0, max: 1});
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', {min: 0, max: 999})
};

createPane();

canvasSketch(sketch, settings);
