// Sound effects made on the fly with Web Audio, plus the Garden Treasures loop.
// Everything is silent until the player turns sound on.
export function createSound(music) {
  let on = false, actx;
  function tone(f0, f1, dur, type = 'sine', vol = .06, delay = 0) {
    if (!on) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + .02);
    } catch (e) { /* audio is optional */ }
  }
  const chord = (notes, len, gap, vol = .05) => notes.forEach((f, i) => tone(f, f, len, 'triangle', vol, i * gap));
  const sfx = {
    start: () => tone(520, 780, .15, 'triangle'),
    jump: () => tone(420, 780, .14, 'triangle'),
    dash: () => tone(950, 320, .16, 'sawtooth', .025),
    treat: () => { tone(880, 880, .08, 'square', .03); tone(1320, 1320, .13, 'square', .03, .08); },
    meow: () => { tone(640, 990, .12, 'triangle', .08); tone(990, 560, .28, 'triangle', .08, .12); },
    rest: () => tone(520, 240, .3, 'sine', .07),
    flag: () => chord([523, 659, 784], .16, .1),
    open: () => chord([659, 784, 988, 1175], .14, .07),
    win: () => chord([523, 659, 784, 1047, 1319], .3, .14, .06),
    bump: () => tone(220, 180, .12, 'sine', .06),
  };
  // Music follows the game: it plays only while sound is on and the garden is being played.
  function sync(playing) {
    if (on && playing) { const p = music.play(); if (p) p.catch(() => {}); } else music.pause();
  }
  function set(v) { on = v; if (on) tone(660, 880, .12, 'triangle'); }
  return { sfx, sync, set, get on() { return on; } };
}
