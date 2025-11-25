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

function drawFrets(padding, numFrets, fretSpacing) {
  // Draw frets (horizontal lines)
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  for (let i = 0; i <= numFrets; i++) {
    const y = padding + i * fretSpacing;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  // Draw nut (first fret thicker)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(canvas.width - padding, padding);
  ctx.stroke();
}

function drawFretboard() {
  const padding = 40;
  const numStrings = 4;
  const numFrets = 6;
  const stringSpacing = (canvas.width - 2 * padding) / (numStrings - 1);
  const fretSpacing = (canvas.height - 2 * padding) / numFrets;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFrets(padding, numFrets, fretSpacing);

  // Draw strings (vertical lines)
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  for (let i = 0; i < numStrings; i++) {
    const x = padding + i * stringSpacing;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.stroke();
  }

  // Draw string names
  ctx.textAlign = "center";
  const stringNames = ["C", "D", "G", "C"];
  for (let i = 0; i < numStrings; i++) {
    const x = padding + i * stringSpacing;
    ctx.fillText(`${stringNames[i]}`, x, padding - 15);
  }

  // Highlight current position
  if (currentNote) {
    const stringIndex = numStrings - currentNote.string;
    const fretIndex = currentNote.fret;

    let x, y;
    x = padding + stringIndex * stringSpacing;

    if (fretIndex === 0) {
      y = padding;
    } else {
      y = padding + fretIndex * fretSpacing - fretSpacing / 2;
    }

    // Draw circle at position
    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();

    // If showing answer, display note name
    if (showingAnswer) {
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(currentNote.note, x, y + 5);
    }
  }
}

function randomNote(notes) {
  return notes[Math.floor(Math.random() * notes.length)];
}

function nextQuestion() {
  currentNote = randomNote(notes);
  showingAnswer = false;
  document.getElementById("answer").textContent = "Show";
  drawFretboard();
}

function showAnswer() {
  showingAnswer = true;
  drawFretboard();
}

nextQuestion();
