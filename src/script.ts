import { drawFretboard, NOTE_RADIUS } from "./draw.js";
import { notes } from "./notes.js";
import type { Note } from "./notes.js";

let currentNote: Note | null = null;
let showingAnswer = false;

const canvas = document.getElementById("fretboard") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function nextNote(): void {
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  showingAnswer = false;
  drawFretboard(ctx, canvas, currentNote, showingAnswer);
}

function showNote(): void {
  if (!currentNote) return;

  showingAnswer = true;
  drawFretboard(ctx, canvas, currentNote, showingAnswer);
}

type Position = {
  x: number;
  y: number;
};

// Calculate note position on canvas
function getNotePosition(note: Note): Position {
  const padding = 40;
  const numStrings = 4;
  const numFrets = 5;
  const stringSpacing = (canvas.width - 2 * padding) / (numStrings - 1);
  const fretSpacing = (canvas.height - 2 * padding) / numFrets;

  const stringIndex = numStrings - note.string;
  const fretIndex = note.fret;

  const x = padding + stringIndex * stringSpacing;
  let y: number;

  if (fretIndex === 0) {
    y = padding - 15;
  } else {
    y = padding + fretIndex * fretSpacing - fretSpacing / 2;
  }

  return { x, y };
}

function handleCanvasClick(clientX: number, clientY: number): void {
  if (!currentNote) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clickX = (clientX - rect.left) * scaleX;
  const clickY = (clientY - rect.top) * scaleY;

  const notePos = getNotePosition(currentNote);
  const distance = Math.sqrt(
    Math.pow(clickX - notePos.x, 2) + Math.pow(clickY - notePos.y, 2),
  );

  if (distance < NOTE_RADIUS * 1.5) {
    showNote();
  } else {
    nextNote();
  }
}

canvas.addEventListener("click", (e: MouseEvent) => {
  handleCanvasClick(e.clientX, e.clientY);
});

nextNote();
