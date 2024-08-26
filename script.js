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

// Play white noise burst
const playNoise = () => {
    // Start audio context if there isn't an instance already
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const frequency = 100;
    const delaySamples = Math.round(audioContext.sampleRate / frequency);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;
    const gain = 0.99;

    // Create an AudioBuffer and fill with processed noise values
    const bufferSize = audioContext.sampleRate;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    // Fill the delay buffer and the output buffer
    for (let i = 0; i < bufferSize; i++) {
        const noiseBurst = audioContext.sampleRate / 100;
        const sample = (i < noiseBurst) ? Math.random() * 2 - 1 : 0;

        delayBuffer[dbIndex] = sample + gain *
            (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / 2;
        output[i] = delayBuffer[dbIndex];

        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }

    // Create a BufferSourceNode and connect it to the AudioContext's destination
    const source = audioContext.createBufferSource();
    source.buffer = outputBuffer; // Assign the AudioBuffer to the source
    source.connect(audioContext.destination); // Connect to speakers
    source.start(); // Start playback
};

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
    }
});

window.addEventListener('DOMContentLoaded', updateSliderValues);