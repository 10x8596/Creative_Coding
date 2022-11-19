function main() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
    
        update(micInput) {
            // animating the movement of bars
            const sound = micInput * 1000;
            if (sound > this.height) {
                this.height = sound;
            } else {
                // ease out slowly
                this.height -= this.height * 0.03;
            }
        }
    
        draw(contexts, volume) {
            contexts.strokeStyle = this.color;
            // Whenever we rotate or translate canvas graphics,
            // we usually don't want these translates and rotates to
            // spill out to other drawings.
            // so we wrap it around save() and restore();
            contexts.save();
            contexts.translate(0, 0);
            contexts.rotate(this.index * 0.03);

            // make x (first param) small for cool effects
            contexts.scale(1 + volume * 0.2, 1 + volume * 0.2);

            contexts.beginPath();
            // change arguements to modify visualiser
            // this.x and this.y values are being pushed away from the center

            contexts.moveTo(this.x, this.y);
            contexts.lineTo(this.y, this.height);

            // bezier curve
            // contexts.bezierCurveTo(100, 100, this.height, this.height * 3, this.x * 2, this.y * 2);

            contexts.stroke();
            contexts.strokeStyle = 'white';

            // rectangles
            contexts.rotate(this.index * 0.3);
            contexts.strokeRect(this.y/0.2, this.y/0.2, this.height/2, this.height/2);

            // circles
            // contexts.beginPath();
            // contexts.arc(this.x, this.y, this.height * 0.2, 0, Math.PI * 2);
            // contexts.stroke();

            contexts.restore();
        }
    }

    const fftSize = 2048;

    // Instantiate microphone class from microphone.js
    const microphone = new Microphone(fftSize);
    let bars = [];
    let barWidth = canvas.width/(fftSize/2);
    // call bars class and create one audio bar object for each
    // audio sample coming from microphone
    function createBars() {
        // fftSize is set to 512 in microphone class
        // which gives us 256 audio sample slices
        for (i = 0; i < (fftSize/2); i++) {
            // HSL color declaration.
            // can traverse the entire color spectrum just adjusting hue
            // Hue: 
            // Saturation: always on 100%
            // Lightness: 0% is black, 100% is white, 50% is original color
            // multiply by 2 to change color faster
            // rainbow: let color = 'hsl(' + i * 2 + ', 100%, 50%)';
            let color = 'hsl(339, 100%, 50%)';
            // adjust params to modify visualiser
            bars.push(new Bar(0, i * 1.5, 5, 50, color, i));
        }
    }
    createBars();

    let angle = 0;

    function animate() {
        if (microphone.initialised) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // generate audio samples from microphone
            // animate bars based on microphone data
    
            // generates audio samples from microphone
            const samples = microphone.getSamples();

            const volume = microphone.getVolume();
    
            // take each element from the bars array and call their draw method
            // first param to function represents each element in array
            // option second param represents index of each element\

            // change speed of rotation
            angle += 0.01 + (volume * 0.05);
            context.save();
            // set rotation pivot point
            context.translate(canvas.width/2, canvas.height/2);
            context.rotate(angle);
            bars.forEach(function (bar, i) {
                // height of bars in pixels
                bar.update(samples[i]);
                bar.draw(context, volume);
            });
            context.restore();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

