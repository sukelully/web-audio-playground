const startAudioBtn = document.getElementById('start-context');
const playOscBtn = document.getElementById('play-osc');

let audioContext;

startAudioBtn.addEventListener('click', () => {
    audioContext = new AudioContext();
});

playOsc = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
}

playOscBtn.addEventListener('click', playOsc);