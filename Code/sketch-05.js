const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

let manager, image;
  
// set the text to appear 
// setting context's font 
let fontSize = 1200;
let fontFamily = 'serif';

// reading color values from the pixels of the canvas
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// define grid properties of typeCanvas
const sketch = ({ context, width, height }) => {
  // pixels
  // pixel density ///////////////////////////////////////////////////////////////
  const cell = 7.6;
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

    /* Font stuff if using a text
    // size of the font  
    fontSize = cols * 1.2;

    setting fill-style
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

    // make background black and fill canvas
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // draw typeCanvas onto sketch.
    // context.drawImage(typeCanvas, 0, 0);

    context.textBaseline = 'middle';
    context.textAlign = 'centre';

    // read pixel's data
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell + random.range(-cell, cell) * 0.5;
      const y = row * cell + random.range(-cell, cell) * 0.5;

      // RGBA
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`;
      // size of glyphs //////////////////////////////////////////////////////////
      if (Math.random() < 0.1) 
        context.font = `${cell * 5.5}px ${fontFamily}`;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      // context.beginPath();
      // // context.fillRect(0, 0, cell, cell);
      // context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      // context.fill();

      context.fillText(glyph, 0, 0);

      context.restore();
    }
    //context.drawImage(typeCanvas, 0, 0);
  };
};

// getGlyph returns a glyph depending on the pixel's brightness //////////////////
// v is a number between 0 and 255 (range of the channel)
const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '/_/';
  if (v < 150) return '#.$';
  if (v < 200) return '><';

  const glyphs = '_-+'.split('');

  return random.pick(glyphs);
};

const onKeyUp = (e) => {
  // set text variable to key being pressed
  // text = e.key.toUpperCase();
  // console.log(e);
  // manager.render();
}

// change letter using event listener
// document.addEventListener('keyup', onKeyUp);

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
  const url = './tiger.png';
  image = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
