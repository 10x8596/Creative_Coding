// Make vscode suggest canvas methods for context
/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize event
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// only draw when mouse is clicked
let drawing = false;
ctx.lineWidth = 0.5;
ctx.fillStyle = '#FFF5DE';
ctx.strokeStyle = '#3c5186';
ctx.shadowOffsetX = 4;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 10;
ctx.shadowColor = 'rgba(0,0,0,0.5)';

class Root {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.maxSize = Math.random() * 7 + 20;
        this.size = Math.random() * 1 + 2;
        // velocity of size growth
        this.vs = Math.random() * 0.2 + 0.5;
        this.angleX = Math.random() * 6.2;
        this.angleY = Math.random() * 6.2;
        this.angle = 0;
        // velocity of angle change
        this.vaX = Math.random() * 0.6 - 0.3;
        this.vaY = Math.random() * 0.6 - 0.3;
        this.va = Math.random() * 0.02 + 0.05;
        this.lightness = 10;
    }

    update() {
        this.x += this.speedX + Math.cos(this.angleX);
        this.y += this.speedY + Math.sin(this.angleY);
        this.size += this.vs;
        this.angleX += this.vaX;
        this.angleY += this.vaY;
        this.angle += this.va;

        if (this.lightness < 70) this.lightness += 0.5;

        if (this.size < this.maxSize) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillRect(0 - this.size/2, 0 - this.size/2, this.size, this.size);
            
            let double = this.size * 2;
            ctx.strokeRect(0 - double/2, 0 - double/2, double, double);
            

            
            requestAnimationFrame(this.update.bind(this));
            ctx.restore();
        }
    }
}

class Flower {
    constructor (x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = '';
    }
}

window.addEventListener('mousemove', function(e) {
    if (drawing) {
        for (let i = 0; i < 3; i++) {
            const root = new Root(e.x, e.y);
            root.update();
        }
    }
});

// only draw when mouse is clicked
window.addEventListener('mousedown', function(e) {
    drawing = true;
    // increase upper bound value in for loop 
    // to set how many roots to generate per click
    for (let i = 0; i < 30; i++) {
        const root = new Root(e.x, e.y);
        root.update();
    }
});
window.addEventListener('mouseup', function() {
    drawing = false;
});