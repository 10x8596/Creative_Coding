const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1800, 1800 ]
};

const sketch = () => {
  return ({ context, width, height}) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Arrays
    for (let i = 0; i < 6; i++) {
      if (i % 2 == 0) {
        // orchid
        context.strokeStyle = '#BA55D3';
        context.shadowBlur =15;
        context.shadowColor = '#EB7FED'
      } else {
        // emerald
        context.strokeStyle = '#50C878';
        context.shadowBlur = 15;
        context.shadowColor = '#83F6A9'
      };

      // width
      const w1   = width  * 0.10;
      // height
      const h1   = height * 0.10;
      // move whole grid l/r and u/d
      const ix1  = width  * 0.11;
      const iy1  = height * 0.1;
      let x1, y1;
      x1 = ix1 + (w1) * i;
      y1 = iy1 + (h1);

      
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x1, y1, w1, h1);
      context.stroke();
      context.restore();

      const ix2  = width  * 0.26;
      const iy2  = height * 0.25;
      let x2, y2;
      x2 = ix2 + (w1) * i + 1;
      y2 = iy2 + (h1) + 1;

      context.save();
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x2, y2, w1, h1);
      context.stroke();
      context.restore();

      const ix3  = width  * 0.019;
      const iy3  = height * 0.4;
      let x3, y3;
      x3 = ix3 + (w1) * i + 1;
      y3 = iy3 + (h1) + 1;

      context.save();
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x3, y3, w1, h1);
      context.stroke();
      context.restore();

      // vertical
      const ix5  = width  * 0.16;
      const iy5  = height * 0.25;
      let x5, y5;
      x5 = ix5 + (w1) + 1;
      y5 = iy5 + (h1) * i + 1;

      context.save();
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x5, y5, w1, h1);
      context.stroke();
      context.restore();

      const ix6  = width  * 0.51;
      const iy6  = height * 0.0085;
      let x6, y6;
      x6 = ix6 + (w1) + 1;
      y6 = iy6 + (h1) * i + 1;

      context.save();
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x6, y6, w1, h1);
      context.stroke();
      context.restore();
    }

    // smaller arrays
    for (let a = 0; a < 4; a++) {
      if (a == 1) {
        context.strokeStyle = '#50C878';
      } else {
        context.strokeStyle = '#BA55D3';
      }
      // width
      const w1   = width  * 0.10;
      // height
      const h1   = height * 0.10;

      const ix4  = width  * 0.33;
      const iy4  = height * 0.55;
      let x4, y4;
      x4 = ix4 + (w1) * a + 1;
      y4 = iy4 + (h1) + 1;

      context.save();
      context.beginPath();
      context.lineWidth = 20;
      context.rect(x4, y4, w1, h1);
      context.stroke();
      context.restore();
    }

    for (let i = 0; i < 5; i++) { // columns
      for (let j = 0; j < 5; j++) { // rows
        // width
        const w   = width  * 0.10;
        // height
        const h   = height * 0.10;
        const gap = width  * 0.03;
        // move whole grid l/r and u/d
        const ix  = width  * 0.18;
        const iy  = height * 0.17;
        const offset = width * 0.02;
        let x, y;

        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        // draw a square
        context.beginPath();
        context.strokeStyle = '#50C878';

        context.rect(x, y, w, h);
        if ((i==0&&j==1) || (i==0&&j==2) || (i==0&&j==3) || 
            (i==2&&j==0) || (i==2&&j==1) || (i==2&&j==3) || (i==2&&j==4) ||
            (i==4&&j==1) || (i==4&&j==2) || (i==4&&j==3)) {
          context.lineWidth = width * 0.01;
          // bright turqouise
          context.strokeStyle = '#16E2F5';
          context.shadowBlur = 80;
          context.shadowColor = 'blue'
        } else {
          context.lineWidth = width * 0.006;
        }
        // Fading out
        if (j == 1) {
          context.globalAlpha = 0.75;
        }
        else if (j == 2) {
          context.globalAlpha = 0.65;
        }
        else if (j > 2) {
          context.globalAlpha = 0.4;
        }
        else {
          context.globalAlpha = 1;
        }
        context.stroke();

        // draw a smaller square inside squares
        if (i % 2 != 0 && j % 2 != 0) {
          context.beginPath();
          context.strokeStyle = '#16E2F5';
          context.strokeStyle = 'white';
          context.shadowBlur = 10;

          context.rect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.rect(x + offset/1, y + offset/1, (w - offset) - offset, (h - offset) - offset);
          context.rect(x + offset/0.67, y + offset/0.67, ((w - offset) - offset) - offset, ((h - offset) - offset) - offset);

          context.lineWidth = width * 0.005;
          context.stroke();
        }
        if ((i == 2 && j == 2 || i==0&&j==0 || i==4&&j==0 ||
             i == 0 && j == 4 || i==4&&j==4)) {
          context.beginPath();
          context.rect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.strokeStyle = 'white';
          context.lineWidth = width * 0.005;
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
