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
const pluckString = (freq) => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    
    const delaySamples = Math.round(audioContext.sampleRate / freq);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;

    // Create an AudioBuffer and fill with processed noise values
    const bufferSize =   10 * audioContext.sampleRate;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    // Fill the delay buffer and the output buffer
    for (let i = 0; i < bufferSize; i++) {
        const noiseBurst = audioContext.sampleRate / 100;
        const sample = (i < noiseBurst  ) ? Math.random() * 2 - 1 : 0;

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
    feedbackNode.gain.value = this.value;
}


const updateSliderValues = () => {
    dampeningValue.innerHTML = dampeningSlider.value;
    feedbackValue.innerHTML = feedbackSlider.value;
}

// Pluck string when spacebar is pressed
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        pluckString(100);
    }
});

window.addEventListener('DOMContentLoaded', updateSliderValues);