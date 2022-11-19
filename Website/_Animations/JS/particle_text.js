const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
// push text to the right
let adjustX = 52;
// push text down
let adjustY = 15;

// handle mouse interactions
// set mouse equal to javascript object
const mouse = {
    x: null,
    y: null,
    radius: 550
}

// callback function
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y);
});

// rgb(228, 55, 55)
context.fillStyle = 'white';
context.font = '30px Monaco';
// position of text
context.fillText(`JavaScript()`, 0, 70);

// area being scanned
// context.strokeStyle = 'white';
// context.strokeRect(0, 0, 100, 100);

const textCoordinates = context.getImageData(0, 0, 313, 80);

class Particle {
    constructor(x, y, colorDistance) {
        this.x = x;
        this.y = y;
        this.size = 3;
        // base properties will hold the initial position of
        // each particle so they can return back to their position
        // after mouse interaction ends
        this.baseX = this.x;
        this.baseY = this.y;
        // change density values to adjust movement speed
        this.density = (Math.random() * 30) + 1;
        this.colorDistance = 0;
    }

    draw() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    // calculate distance between current mouse position
    // and current particle position. If they are close enough
    // the particles will be pushed away
    update() {
        // mouse position - particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        this.colorDistance = distance;

        // pushes particles towards mouse
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;

        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            // changing -= to += will pull the particles to mouse
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // when mouse is far enough from the particles
            // particles will return to original position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                // particles will move back slowly
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                // particles will move back slowly
                this.y -= dy / 10;
            }
        }
    }
}

//console.log(textCoordinates.data);
function init() {
    particleArray = [];
    // grid of 100 pixels
    // go through them row by row
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            // any pixel with more than 50% opacity will be added
            // to out particle array. 128 is opacity. (255 / 2)
            // cycling through 40,000 elements, only checking 4th one (alpha)
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 127.5) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                // change spread of particles, hence size of text by
                // adjusting values being multiplied to positions
                particleArray.push(new Particle(positionX * 8, positionY * 10));
            }
        }
    }
}

// resize event
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = 150;
    init();
});

// mouse out event
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
})

init();
//console.log(particleArray);

function animate() {
    // clear entire canvas between every frame of animation
    context.clearRect(0, 0, canvas.width, canvas.height);
    // cycle through particle array and for each particle
    // call draw method to draw particle
    for (i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    // animation loop
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            // let dx1 = mouse.x - this.x;
            // let dy1 = mouse.y - this.y;
            // let distance1 = Math.hypot(dx1, dy1);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.hypot(dx, dy);

            
            if (distance < 30) {
                if (particleArray[a].colorDistance < mouse.radius) {
                    context.strokeStyle = 'rgba(228, 55, 55,' + opacityValue + ')';
                }
                else {
                    context.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                }
                opacityValue = 1 - (distance/30);
                //context.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(particleArray[a].x, particleArray[a].y);
                context.lineTo(particleArray[b].x, particleArray[b].y);
                context.stroke(); 
            }
        }
    }
}

// change color of lines when distance of particles from mouse
// reaches a certain value;
