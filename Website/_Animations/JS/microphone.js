class Microphone {
    constructor(fftSize) {
        this.initialised = false;
        // navigator.mediaDevices is a read only property
        // that returns a nuilt-in MediaDevices object,
        // which provides access to connected media input 
        // devices such as cameras, microphones and screen sharing
        navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(stream) {
            this.audioContext = new AudioContext();
            // createMediaStreamSource takes raw media stream, in this case
            // raw audio data coming from microphone and it converts it
            // into audio nodes
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            // createAnalyser creates analyser node, which can be used to 
            // expose audio time and frequency data to create visualisations.
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = fftSize;

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            // connect allows us to direct data from one
            // audio node to another
            this.microphone.connect(this.analyser);
            this.initialised = true;

        }.bind(this)).catch(function(err) {
            alert(err);
        });
        // getUserMedia returns a promise that resolves in a media
        // stream object which contains microphone audio data.

        // Promise is a special JavaScript object that represents eventual 
        // completion of asynchronous operation. We use promises when we
        // want to wait for something to complete before we run some 
        // follow-up code
    }   

    // getSample method will give us audio samples array coming from
    // the microphone. We'll call it over and over from animate loop,
    // getting new microphone data for every animation frame and using
    // it to update our visualisers.
    getSamples() {
        // getByteTimeDomainData copies the current waveform or time
        // domain data into an Uint8Array (unsigned byte) array we pass to it
        this.analyser.getByteTimeDomainData(this.dataArray);
        // ... is the spread operator. It will take data array from line 21,
        // and spread it into this new array literal. Convery Uint8Array
        // to regular array inorder to call map method.
        // map allows to perform a operation on each element in the array
        let normSamples = [...this.dataArray].map(e => e / 128 - 1);
        return normSamples;
    }
    // this method gives us a single value that represents overall current
    // value of audio coming from the microphone
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e / 128 - 1);
        
        // RMS (root mean square) is a measure of the magnitude of a set
        // of numbers. It gives a sense for the typical size of the numbers
        let sum = 0;
        for (i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        // average
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}

const microphone = new Microphone();
console.log(microphone);