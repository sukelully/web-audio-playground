const playNoiseBtn = document.getElementById('play-noise');
const delaySlider = document.getElementById('delay-slider');
const delayValue = document.getElementById('delay-value');
const feedbackSlider = document.getElementById('feedback-slider');
const feedbackValue = document.getElementById('feedback-value');
const freqSlider = document.getElementById('freq-slider');
const freqValue = document.getElementById('freq-value');
const qSlider = document.getElementById('q-slider');
const qValue = document.getElementById('q-value');

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

// Setup synth, connect nodes
const setupSynth = () => {
    startAudioContext();
    if (!delayNode) {
        delayNode = audioContext.createDelay();
        gainNode = audioContext.createGain();
        feedbackNode = audioContext.createGain();
        filterNode = audioContext.createBiquadFilter();

        delayNode.delayTime.value = 0.001;  // Adjusted delay time (e.g., 20ms for a mid-range pitch)
        gainNode.gain.value = 0.4;
        feedbackNode.gain.value = 0.8;
        filterNode.type = 'lowpass';
        filterNode.frequency = 500; 
        filterNode.Q.value = 0.0001;

        // Connect nodes
        // gainNode.connect(audioContext.destination);
        gainNode.connect(delayNode);
        delayNode.connect(feedbackNode);
        feedbackNode.connect(filterNode);
        filterNode.connect(delayNode);
        filterNode.connect(audioContext.destination);

        feedbackNode.connect(audioContext.destination);
    }
}

// Play white noise burst
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
    noiseNode.connect(gainNode);

    noiseNode.start();
    noiseNode.stop(audioContext.currentTime + 0.01); 
}

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
    filterNode.frequency = this.value;
}

qSlider.oninput = function() {
    qValue.innerHTML = this.value;
    filterNode.Q.value = this.value;
}

const updateSliderValues = () => {
    delayValue.innerHTML = delaySlider.value;
    feedbackValue.innerHTML = feedbackSlider.value;
    freqValue.innerHTML = freqSlider.value;
    qValue.innerHTML = qSlider.value;
}

// Play noise when button is clicked or spacebar is pressed
playNoiseBtn.addEventListener('click', playNoise);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        playNoise();
    }
});

window.addEventListener('DOMContentLoaded', updateSliderValues);