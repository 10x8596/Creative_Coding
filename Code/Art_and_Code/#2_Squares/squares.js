const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');

const palette = random.pick(palettes);

const settings = {
  dimensions: [ 2048, 2048 ],
};

const sketch = ({ context, width, height }) => {

   // array of squares
   const squares = [];

   for (let i = 0; i < 280; i++) {
     squares.push(new Square());
   }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    squares.forEach(square => {
      square.draw(context);
    });

  };
};

const margin = 150;

class Square {
  constructor() {
    this.x = random.range(0, 2048);
    this.y = random.range(0, 2048);
    this.w = random.value() * 500;
    this.h = random.value() * 500;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = random.pick(palette);
    context.lineWidth = 15;
    context.fillStyle = random.pick(palette);
    context.rect(this.x - margin, this.y - margin, this.w, this.h);
    context.fill();
    context.stroke();
  }
}


canvasSketch(sketch, settings);

