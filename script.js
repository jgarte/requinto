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
window.nextQuestion = nextQuestion;
window.showAnswer = showAnswer;

nextQuestion();
