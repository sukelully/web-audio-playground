const playNoiseBtn = document.getElementById('play-noise');
const delaySlider = document.getElementById('delay-slider');
const delayValue = document.getElementById('delay-value');
const feedbackSlider = document.getElementById('feedback-slider');
const feedbackValue = document.getElementById('feedback-value');
const freqSlider = document.getElementById('freq-slider');
const freqValue = document.getElementById('freq-value');


// Global variables
let audioContext;
let noiseNode
let gainNode;
let delayNode;
let filterNode;
let feedbackNode;

// Function to start the audio context
const startAudioContext = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
        console.log(`Audio context started with sample rate: ${audioContext.sampleRate}`);
    }
}

// Function to set up the synth
const setupSynth = () => {
    startAudioContext();
    if (!delayNode) {
        delayNode = audioContext.createDelay();
        gainNode = audioContext.createGain();
        feedbackNode = audioContext.createGain();
        filterNode = audioContext.createBiquadFilter();

        delayNode.delayTime.value = 0.01;  // Adjusted delay time (e.g., 20ms for a mid-range pitch)
        gainNode.gain.value = 0.4;
        feedbackNode.gain.value = 0.7;
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 7000; 
        filterNode.Q.value = 1;

        // Connect nodes

        // delayNode.connect(filterNode);
        // filterNode.connect(feedbackNode);
        // feedbackNode.connect(delayNode);

        feedbackNode.connect(audioContext.destination);
    }
}

// Function to play white noise
const playNoise = () => {
    setupSynth();

    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Fill the buffer with random noise
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    noiseNode.connect(delayNode);
    // whiteNoise.connect(audioContext.destination);

    noiseNode.start();
    noiseNode.stop(audioContext.currentTime + 0.01); 
}

// Event listeners
playNoiseBtn.addEventListener('click', playNoise);

delaySlider.oninput = function() {
    delayValue.innerHTML = this.value;
    delayNode.delayTime.value = this.value;
}

feedbackSlider.oninput = function() {
    feedbackValue.innerHTML = this.value;
    feedbackNode.gain.value = this.value;
}

freqSlider.oninput = function() {
    freqValue.innerHTML = this.value;
    filterNode.frequency.value = this.value;
}