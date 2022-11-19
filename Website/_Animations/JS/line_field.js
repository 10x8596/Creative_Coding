let canvas;
let context;
// prevent distortion and stretching of drawing by 
// creating a new instance of class
let flowField;

let flowFieldAnimation;

window.onload = function () {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(context, canvas.width, canvas.height);
    flowField.animate(0);
}

// Making canvas responsive
window.addEventListener('resize', function() {
    this.cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(context, canvas.width, canvas.height);
    flowField.animate(0);
});

// mouse interactivity
const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

class FlowFieldEffect {
    // private class properties
    #context;
    #width;
    #height;
    constructor(context, width, height) {
        this.#context = context;
        this.#context.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        // increase cell size value for better performance
        this.cellSize = 15;
        this.gradient;
        this.#createGradient();
        this.#context.strokeStyle = this.gradient;
        this.radius = 3;
        // velocity of radius changing
        this.vr = 0.07;
    }

    // create a gradient
    #createGradient() {
        this.gradient = this.#context.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "#614385 ");
        this.gradient.addColorStop("0.9", "#4568dc");
    }

    // private method. cannot be called from outside this class
    #drawLine(angle, x, y) {
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = (dx*dx + dy*dy);

        if (distance > 600000) distance = 600000
        else if (distance < 50000) distance = 50000;
        
        let length = distance * 0.0001;
        
        this.#context.beginPath();
        this.#context.moveTo(x, y);
        // adjust angle values for diff patterns
        // this.#context.lineTo(x + angle * 100, y + angle * 100);
        this.#context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        this.#context.stroke();
    }
    // public method
    animate(timeStamp) {
        let deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.#context.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr;

            if (this.radius > 5 || this.radius < -5) this.vr *= -1;

            // creating and mapping a grid on canvas
            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    // adjust cos and sin values for diff patterns
                    // move mouse to zoom in and out of the pattern
                    const angle = (Math.cos(mouse.x * x * 0.00001) + 
                                   Math.sin(mouse.y * y * 0.00001) * this.radius);
                    this.#drawLine(angle, x, y);
                }
            }            

            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        // bind this keyword to FlowFieldEffect, so javascript remembers
        // what this keyword is referring to
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}