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
  { string: 4, fret: 2, note: "D" },
  { string: 4, fret: 4, note: "E" },

  { string: 3, fret: 2, note: "E" },
  { string: 3, fret: 3, note: "F" },

  { string: 2, fret: 2, note: "A" },
  { string: 2, fret: 4, note: "B" },

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

  // Create oscillator for the fundamental frequency
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'triangle'; // Warmer sound than sine
  oscillator.frequency.setValueAtTime(frequency, now);

  // Create gain node for envelope shaping
  const gainNode = audioContext.createGain();

  // Plucked string envelope: quick attack, moderate decay/release
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.005); // Fast attack
  gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.1); // Initial decay
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Sustain/release

  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start and stop the oscillator
  oscillator.start(now);
  oscillator.stop(now + 1.5);
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
    y = padding;
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
