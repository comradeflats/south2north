// sounds.js

function playSound(soundFile) {
  try {
    const audio = new Audio(`audio/${soundFile}`);
    audio.play();
  } catch (e) {
    console.error(`Error playing sound ${soundFile}:`, e);
  }
}
