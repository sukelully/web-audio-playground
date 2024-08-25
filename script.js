const playNoiseBtn = document.getElementById('play-noise');
const delaySlider = document.getElementById('delay-slider');
const feedbackSlider = document.getElementById('feedback-feedbacklider');


// Global variables
let audioContext;
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
        feedbackNode = audioContext.createGain();
        filterNode = audioContext.createBiquadFilter();

        delayNode.delayTime.value = 0.01;  // Adjusted delay time (e.g., 20ms for a mid-range pitch)
        feedbackNode.gain.value = 0.7;   // Adjusted feedback gain
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 500;  // Adjusted filter frequency

        // Connect nodes
        delayNode.connect(filterNode);
        filterNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);

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

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(delayNode);
    // whiteNoise.connect(audioContext.destination);

    whiteNoise.start();
    whiteNoise.stop(audioContext.currentTime + 0.01); 
}

// Attach the event listener
playNoiseBtn.addEventListener('click', playNoise);