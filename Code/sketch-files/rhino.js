const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 3048, 2048 ],
  animate: true
};

let manager, image;
  
// set the text to appear 
// setting context's font 
let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

// reading color values from the pixels of the canvas
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// define grid properties of typeCanvas
const sketch = ({ context, width, height }) => {
  // pixels
  // pixel density ///////////////////////////////////////////////////////////////
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  // dimensions of typeCanvas
  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    // draw an Image
    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows);
    typeContext.restore();

    /*
    // Font stuff if using a text
    // size of the font  
    fontSize = cols * 1.2;

    // setting fill-style
    typeContext.fillStyle = 'white';

    // defining font with template literals
    typeContext.font = `${fontSize}px ${fontFamily}`;

    //text baseLine. Default value is alphabetic 
    //which means text is being drawn from bottom
    typeContext.textBaseline = 'top';

    // measure the text using TextMetrics
    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1 ;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log(metrics);

    // translate the text  
    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    // translate the text to centre
    typeContext.save();

    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    // fill-text. params: (text, tx-coord, ty-coord, maxWidth)
    typeContext.fillText(text, 0, 0);

    typeContext.restore();
    */

    // pixel data
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    console.log(typeData);

    // read pixel's data
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      // RGBA
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      context.beginPath();
      // // context.fillRect(0, 0, cell, cell);
      context.arc(0, 0, cell * 0.3, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }
  };
};

//load an image
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
}

// Asynchronous function and Promises
const start = async () => {
  const url = './rhino.png';
  image = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
