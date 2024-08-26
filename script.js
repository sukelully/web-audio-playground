// Global constants
const DEFAULT_FEEDBACK = 0.99;
const DEFAULT_DAMPENING = 2;

// State variables
let audioContext;
let feedback = DEFAULT_FEEDBACK;
let dampening = DEFAULT_DAMPENING;

// References
const feedbackSlider = document.getElementById('feedback-slider');
const feedbackValue = document.getElementById('feedback-value');
const dampeningSlider = document.getElementById('dampening-slider');
const dampeningValue = document.getElementById('dampening-value');

// Initialize AudioContext
const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
};

// Play white noise burst
const playFreq = (freq) => {
    const audioCtx = getAudioContext();
    
    const delaySamples = Math.round(audioCtx.sampleRate / freq);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;

    const bufferSize = 10 * audioCtx.sampleRate;
    const outputBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        const noiseBurst = audioCtx.sampleRate / 100;
        const sample = (i < noiseBurst) ? Math.random() * 2 - 1 : 0;

        delayBuffer[dbIndex] = sample + feedback * (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / dampening;
        output[i] = delayBuffer[dbIndex];

        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }

    const source = audioCtx.createBufferSource();
    source.buffer = outputBuffer;
    source.connect(audioCtx.destination);
    source.start();
};

// Update slider values in UI
const updateSliderValues = () => {
    dampeningValue.innerHTML = dampeningSlider.value;
    feedbackValue.innerHTML = feedbackSlider.value;
};

// Event listeners for sliders
feedbackSlider.oninput = function () {
    feedback = parseFloat(this.value);
    feedbackValue.innerHTML = this.value;
};

dampeningSlider.oninput = function () {
    dampening = parseFloat(this.value);
    dampeningValue.innerHTML = this.value;
};

// Key-to-frequency mapping
const keyFrequencyMap = {
    'KeyA': 73.42,      // D3
    'KeyS': 82.41,      // E3
    'KeyD': 98.00,      // G3
    'KeyF': 110.00,     // A3
    'KeyJ': 130.81,     // C3
    'KeyK': 146.83,     // D3
    'KeyL': 164.81,     // E3
    'Semicolon': 196.00 // G3
};

// Play notes when key is pressed
window.addEventListener('keydown', (e) => {
    const octave = 2;
    const freq = keyFrequencyMap[e.code];
    if (freq) {
        playFreq(freq * octave);
    }
});

// Initialize UI on page load
window.addEventListener('DOMContentLoaded', updateSliderValues);