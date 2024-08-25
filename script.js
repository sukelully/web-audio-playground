const playNoiseBtn = document.getElementById('play-noise');

let audioContext;

playNoise = () => {
    if (!audioContext) startAudioContext();

    var bufferSize = 2 * audioContext.sampleRate,
        noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
        output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    var whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(audioContext.destination);

    whiteNoise.start();
    whiteNoise.stop(audioContext.currentTime + 0.1);
}

startAudioContext = () => {
    audioContext = new AudioContext();
    console.log(audioContext.sampleRate);
}

playNoiseBtn.addEventListener('click', playNoise);