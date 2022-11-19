const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1800, 1800 ],
  // enable animation loop
  animate: true,
  // set loop duration
  duration: 3,
  // specify a frame rate, defaults to 30
  fps: 30,
  // playbackRate: "throttle",
  timeScale: 0.3
};

const sketch = () => {
  return ({ context, width, height}) => {
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

        // create a gradient
        var grd = context.createLinearGradient(0, 0, width, height);
        grd.addColorStop(0, '#03BFFB');
        grd.addColorStop(0.25, '#03BFFB');
        grd.addColorStop(0.5, '#B900FF');
        grd.addColorStop(0.75, '#B900FF');
        grd.addColorStop(0.70, '#03BFFB');
        grd.addColorStop(1, '#03BFFB');

        // draw a square
        context.beginPath();
        context.strokeStyle = grd;
        context.rect(x, y, w, h);
        if ((i==0&&j==1) || (i==0&&j==2) || (i==0&&j==3) || 
            (i==1&&j==0) || (i==1&&j==2) || (i==1&&j==4) ||
            (i==2&&j==0) || (i==2&&j==1) || (i==2&&j==3) || (i==2&&j==4) ||
            (i==3&&j==0) || (i==3&&j==2) || (i==3&&j==4) ||
            (i==4&&j==1) || (i==4&&j==2) || (i==4&&j==3)) {
          context.lineWidth = width * 0.01;
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
          context.strokeStyle = grd;

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
          context.strokeStyle = grd;
          context.lineWidth = width * 0.005;
          context.stroke();
        }
        if (Math.random() > 0.7) {
          context.beginPath()
          // context.fillStyle = 'white';

          context.rect(x + offset/2, y + offset/2, w - offset, h - offset);
          context.rect(x + offset/1, y + offset/1, (w - offset) - offset, (h - offset) - offset);
          
          context.strokeStyle = grd;
          context.lineWidth = width * 0.005;
          context.stroke();
        }
        if (Math.random() > 0.9) {
          context.beginPath()
          context.fillStyle = grd;
          context.fillRect(x + offset/2, y + offset/2, w - offset, h - offset);          
          context.strokeStyle = grd;
          context.lineWidth = width * 0.005;
          context.stroke();
          
        }

      }
      
    }

  };

};


canvasSketch(sketch, settings);
