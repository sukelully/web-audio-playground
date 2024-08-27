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
const jBtn = document.getElementById('j-btn');

// Play white noise burst at specified frequency
const playFreq = (freq) => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    
    // Delay line buffer
    const delaySamples = Math.round(audioContext.sampleRate / freq);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;

    // 7s output buffer
    const bufferSize =   7 * audioContext.sampleRate;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    // Fill delay and output buffer
    for (let i = 0; i < bufferSize; i++) {
        // Noise burst for 10ms worth of samples
        const noiseVariation = Math.random () * audioContext.sampleRate / 250 - audioContext.sampleRate / 500;
        const noiseBurst = audioContext.sampleRate / 100 + noiseVariation;
        const sample = (i < noiseBurst  ) ? Math.random() * 2 - 1 : 0;

        // Apply lowpass by averaging adjacent delay line samples
        delayBuffer[dbIndex] = sample + feedback *
            (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / dampening;
        output[i] = delayBuffer[dbIndex];

        // Loop delay buffer
        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }

    // Connect to output and play
    const source = audioContext.createBufferSource();
    source.buffer = outputBuffer;
    source.connect(audioContext.destination);
    source.start();
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