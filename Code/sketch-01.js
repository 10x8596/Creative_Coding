// importing the canvas-sketch library and storing a reference to it
const canvasSketch = require('canvas-sketch');
// elements of the canvas
const settings = {
  // create canvas in pixels of 2048x2048
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    // background
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

      for (let i = 0; i < 5; i++) { // columns
      for (let j = 0; j < 5; j++) { // rows
        // width
        const w   = width  * 0.10;
        // height
        const h   = height * 0.10;
        const gap = width  * 0.03;
        const ix  = width  * 0.17;
        const iy  = height * 0.17;
        const offset = width * 0.02;
        let x, y;

        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        // draw a square
        context.beginPath();
        context.rect(x, y, w, h);
        context.strokeStyle = "white";
        context.lineWidth = width * 0.006;
        context.stroke();

        // draw a smaller square inside squares
        if (i % 2 != 0 && j % 2 != 0) {
          context.beginPath();
          context.rect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.strokeStyle = "white";
          context.lineWidth = width * 0.005;
          context.stroke();
        }
        if (i % 2 == 0 && j % 2 == 0) {
          context.beginPath()
          context.rect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.strokeStyle = "white";
          context.lineWidth = width * 0.005;
          context.stroke();
        }
        if (Math.random() > 0.7) {
          context.beginPath()
          context.fillStyle = 'white';
          context.fillRect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.strokeStyle = "white";
          context.lineWidth = width * 0.005;
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
