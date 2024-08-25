const playNoiseBtn = document.getElementById('play-noise');

// Global variables
let audioContext;
let gainNode;
let delayNode;

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
    if (!gainNode) {
        gainNode = audioContext.createGain();
        delayNode = audioContext.createDelay();
        feedbackNode = audioContext.createGain();

        delayNode.delayTime.value = 0.1;  // Delay time for the echo effect
        feedbackNode.gain.value = 0.5; // Feedback amount (decay level)

        // Connect nodes
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode); // Feedback loop

        gainNode.connect(delayNode);
        delayNode.connect(audioContext.destination);
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

    whiteNoise.start();
    whiteNoise.stop(audioContext.currentTime + 0.1);
}

// Attach the event listener
playNoiseBtn.addEventListener('click', playNoise);