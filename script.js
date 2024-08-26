// Global variables
let audioContext;
let noiseNode
let gainNode;
let delayNode;
let filterNode;
let feedbackNode;

// References
const playNoiseBtn = document.getElementById('play-noise');
const delaySlider = document.getElementById('delay-slider');
const delayValue = document.getElementById('delay-value');
const feedbackSlider = document.getElementById('feedback-slider');
const feedbackValue = document.getElementById('feedback-value');
const freqSlider = document.getElementById('freq-slider');
const freqValue = document.getElementById('freq-value');
const qSlider = document.getElementById('q-slider');
const qValue = document.getElementById('q-value');

// Start audio context, connect nodes
const setupAudio = () => {
    // Start audio context and log device sample rate
    audioContext = new AudioContext();
    console.log(`Audio context started with sample rate: ${audioContext.sampleRate}`);

    // Initialise K-S algorithm nodes
    delayNode = audioContext.createDelay();
    gainNode = audioContext.createGain();
    feedbackNode = audioContext.createGain();
    filterNode = audioContext.createBiquadFilter();

    // Set default algorithm values
    delayNode.delayTime.value = 0.001;
    gainNode.gain.value = 0.4;
    feedbackNode.gain.value = 0.8;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 500;
    filterNode.Q.value = 0;

    // Routes nodes
    feedbackNode.connect(delayNode);
    delayNode.connect(filterNode);
    filterNode.connect(feedbackNode);
    feedbackNode.connect(audioContext.destination);
    
}

// Play white noise burst
const playNoise = () => {
    // Start audio context if there isn't an instance already
    if (!audioContext) {
        setupAudio();
    }

    const frequency = 200;
    const delaySamples = Math.round(audioContext.sampleRate / frequency);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;
    const gain = 0.99;

    // Create a buffer and fill with random noise values
    const bufferSize = audioContext.sampleRate;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        const sample = Math.random() * 2 - 1;
        delayBuffer[dbIndex] = sample + gain * 
        (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / 2;
        output[i] = delayBuffer[dbIndex];

        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }
}

const playOsc = () => {
    if (!audioContext) {
        setupAudio();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 100;
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    gain.gain.value = 0.5;

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 1);
}

delaySlider.oninput = function () {
    delayValue.innerHTML = this.value;
    delayNode.delayTime.value = this.value;
}

feedbackSlider.oninput = function () {
    feedbackValue.innerHTML = this.value;
    feedbackNode.gain.value = this.value;
}

freqSlider.oninput = function () {
    freqValue.innerHTML = this.value;
    filterNode.frequency = this.value;
}

qSlider.oninput = function () {
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
        // playOsc();
    }
});

window.addEventListener('DOMContentLoaded', updateSliderValues);