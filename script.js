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

function randomNote(notes) {
  return notes[Math.floor(Math.random() * notes.length)];
}

function nextQuestion() {
  currentNote = randomNote(notes);
  showingAnswer = false;
  document.getElementById("answer").textContent = "Show";
  drawFretboard(ctx, canvas, currentNote, showingAnswer);
}

function showAnswer() {
  showingAnswer = true;
  drawFretboard(ctx, canvas, currentNote, showingAnswer);
}

// Make functions available globally for onclick handlers
window.showAnswer = showAnswer;

// Add click/touch event listener to canvas
canvas.addEventListener('click', nextQuestion);
canvas.addEventListener('touchend', (e) => {
  e.preventDefault(); // Prevent mouse event from firing on touch devices
  nextQuestion();
});

nextQuestion();
