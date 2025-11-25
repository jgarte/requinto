// Requinto Note Trainer
// Copyright (C) 2025 jgart
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { drawFretboard } from './draw.js';

const notes = [
  { string: 4, fret: 0, note: "C" },
  { string: 4, fret: 2, note: "D" },
  { string: 4, fret: 4, note: "E" },

  { string: 3, fret: 0, note: "D" },
  { string: 3, fret: 2, note: "E" },
  { string: 3, fret: 3, note: "F" },

  { string: 2, fret: 0, note: "G" },
  { string: 2, fret: 2, note: "A" },
  { string: 2, fret: 4, note: "B" },

  { string: 1, fret: 0, note: "C" },
  { string: 1, fret: 2, note: "D" },
  { string: 1, fret: 4, note: "E" },
  { string: 1, fret: 5, note: "F" }
];

let currentNote = null;
let showingAnswer = false;

const canvas = document.getElementById("fretboard");
const ctx = canvas.getContext("2d");

// Audio setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Open string frequencies for C-D-G-C tuning
const openStringFrequencies = {
  4: 130.81, // C3
  3: 146.83, // D3
  2: 196.00, // G3
  1: 261.63  // C4
};

function getNoteFrequency(note) {
  const openFreq = openStringFrequencies[note.string];
  // Each fret increases pitch by one semitone (multiply by 2^(1/12))
  return openFreq * Math.pow(2, note.fret / 12);
}

function playNote(frequency) {
  const now = audioContext.currentTime;
  const duration = 2.5;

  // Create a low-pass filter to simulate body resonance
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, now);
  filter.Q.setValueAtTime(1, now);

  // Master gain for overall volume
  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.25, now + 0.003); // Very quick attack
  masterGain.gain.exponentialRampToValueAtTime(0.15, now + 0.05); // Initial bright decay
  masterGain.gain.exponentialRampToValueAtTime(0.05, now + 0.3); // Settle
  masterGain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Long decay

  // Create harmonics for richer sound (fundamental + overtones)
  const harmonics = [
    { freq: frequency, gain: 0.4 },        // Fundamental
    { freq: frequency * 2, gain: 0.3 },    // 2nd harmonic
    { freq: frequency * 3, gain: 0.15 },   // 3rd harmonic
    { freq: frequency * 4, gain: 0.08 },   // 4th harmonic
    { freq: frequency * 5, gain: 0.04 },   // 5th harmonic
    { freq: frequency * 6, gain: 0.02 }    // 6th harmonic
  ];

  harmonics.forEach((harmonic, index) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(harmonic.freq, now);

    const harmonicGain = audioContext.createGain();
    harmonicGain.gain.setValueAtTime(harmonic.gain, now);

    // Higher harmonics decay faster (nylon string characteristic)
    const decayRate = 1 + (index * 0.3);
    harmonicGain.gain.exponentialRampToValueAtTime(
      harmonic.gain * 0.01,
      now + duration / decayRate
    );

    osc.connect(harmonicGain);
    harmonicGain.connect(filter);

    osc.start(now);
    osc.stop(now + duration);
  });

  // Connect filter to master gain to output
  filter.connect(masterGain);
  masterGain.connect(audioContext.destination);
}

function randomNote(notes) {
  return notes[Math.floor(Math.random() * notes.length)];
}

function nextQuestion() {
  currentNote = randomNote(notes);
  showingAnswer = false;
  drawFretboard(ctx, canvas, currentNote, showingAnswer);
}

function showAnswer() {
  showingAnswer = true;
  drawFretboard(ctx, canvas, currentNote, showingAnswer);

  // Play the note
  const frequency = getNoteFrequency(currentNote);
  playNote(frequency);
}

// Calculate note position on canvas
function getNotePosition(note) {
  const padding = 40;
  const numStrings = 4;
  const numFrets = 5;
  const stringSpacing = (canvas.width - 2 * padding) / (numStrings - 1);
  const fretSpacing = (canvas.height - 2 * padding) / numFrets;

  const stringIndex = numStrings - note.string;
  const fretIndex = note.fret;

  const x = padding + stringIndex * stringSpacing;
  let y;

  if (fretIndex === 0) {
    y = padding - 15;
  } else {
    y = padding + fretIndex * fretSpacing - fretSpacing / 2;
  }

  return { x, y };
}

// Handle canvas click/touch
function handleCanvasClick(clientX, clientY) {
  if (!currentNote) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clickX = (clientX - rect.left) * scaleX;
  const clickY = (clientY - rect.top) * scaleY;

  const notePos = getNotePosition(currentNote);
  const distance = Math.sqrt(
    Math.pow(clickX - notePos.x, 2) + Math.pow(clickY - notePos.y, 2)
  );

  // If clicked within 25px of the note, show answer; otherwise next question
  if (distance < 25) {
    showAnswer();
  } else {
    nextQuestion();
  }
}

// Add click/touch event listeners
canvas.addEventListener('click', (e) => {
  handleCanvasClick(e.clientX, e.clientY);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  handleCanvasClick(touch.clientX, touch.clientY);
});

nextQuestion();
