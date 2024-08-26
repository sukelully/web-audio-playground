// Global variables
let audioContext;
let feedback = 0.99;
let dampening = 2;

// References
const feedbackSlider = document.getElementById('feedback-slider');
const feedbackValue = document.getElementById('feedback-value');
const dampeningSlider = document.getElementById('dampening-slider');
const dampeningValue = document.getElementById('dampening-value');

// Play white noise burst
const playFreq = (freq) => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    
    // Delay line buffer
    const delaySamples = Math.round(audioContext.sampleRate / freq);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;

    // 10s output buffer
    const bufferSize =   10 * audioContext.sampleRate;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    // Fill delay and output buffer
    for (let i = 0; i < bufferSize; i++) {
        // Noise burst for 10ms worth of samples
        const noiseBurst = audioContext.sampleRate / 100;
        const sample = (i < noiseBurst  ) ? Math.random() * 2 - 1 : 0;

        // Apply lowpass by averaging adjacent delay line samples
        delayBuffer[dbIndex] = sample + feedback *
            (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / dampening;
        output[i] = delayBuffer[dbIndex];

        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }

    const source = audioContext.createBufferSource();
    source.buffer = outputBuffer;
    source.connect(audioContext.destination);
    source.start();
};

feedbackSlider.oninput = function () {
    feedbackValue.innerHTML = this.value;
    feedback = this.value;
}

const updateSliderValues = () => {
    dampeningValue.innerHTML = dampeningSlider.value;
    feedbackValue.innerHTML = feedbackSlider.value;
}

// Play notes when string is pressed
window.addEventListener('keydown', (e) => {
    let octave = 2;
    switch (e.code) {
        case 'KeyA':        // D3
            playFreq(73.42 * octave);
            break;
        case 'KeyS':        // E3
            playFreq(82.41 * octave);
            break;
        case 'KeyD':        // G3
            playFreq(98.00 * octave);
            break;
        case 'KeyF':        // A3
            playFreq(110.00 * octave);
            break;
        case 'KeyJ':        // C3
            playFreq(130.81 * octave);
            break;
        case 'KeyK':        // D3
            playFreq(146.83 * octave);
            break;
        case 'KeyL':        // E3
            playFreq(164.81 * octave);
            break;
        case 'Semicolon':   // G3
            playFreq(196.00 * octave)
            break
        default:
            break;
    }
});

window.addEventListener('DOMContentLoaded', updateSliderValues);