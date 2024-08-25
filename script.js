const playNoiseBtn = document.getElementById('play-noise');

// Global variables
let audioContext;
let gainNode;

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
        gainNode.connect(audioContext.destination);
        console.log('Synth setup complete with gain node connected.');
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
    whiteNoise.connect(gainNode);

    whiteNoise.start();
    whiteNoise.stop(audioContext.currentTime + 0.1);
}

// Attach the event listener
playNoiseBtn.addEventListener('click', playNoise);