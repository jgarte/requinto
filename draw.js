export function drawFrets(ctx, canvas, config) {
  // Draw frets (horizontal lines)
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  for (let i = 0; i <= config.numFrets; i++) {
    const y = config.padding + i * config.fretSpacing;
    ctx.beginPath();
    ctx.moveTo(config.padding, y);
    ctx.lineTo(canvas.width - config.padding, y);
    ctx.stroke();
  }
}

export function drawNut(ctx, canvas, config) {
  // Draw nut (first fret thicker)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(config.padding, config.padding);
  ctx.lineTo(canvas.width - config.padding, config.padding);
  ctx.stroke();
}

export function drawStrings(ctx, canvas, config) {
  // Draw strings (vertical lines)
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  for (let i = 0; i < config.numStrings; i++) {
    const x = config.padding + i * config.stringSpacing;
    ctx.beginPath();
    ctx.moveTo(x, config.padding);
    ctx.lineTo(x, canvas.height - config.padding);
    ctx.stroke();
  }
}

export function drawStringNames(ctx, canvas, config) {
  // Draw string names
  ctx.fillStyle = "#999";
  ctx.textAlign = "center";
  const stringNames = ["C", "D", "G", "C"];
  for (let i = 0; i < config.numStrings; i++) {
    const x = config.padding + i * config.stringSpacing;
    ctx.fillText(`${stringNames[i]}`, x, config.padding - 15);
  }
}

export function drawFretboard(ctx, canvas, currentNote, showingAnswer) {
  const config = {
    padding: 40,
    numStrings: 4,
    numFrets: 6,
    stringSpacing: 0,
    fretSpacing: 0
  };

  config.stringSpacing = (canvas.width - 2 * config.padding) / (config.numStrings - 1);
  config.fretSpacing = (canvas.height - 2 * config.padding) / config.numFrets;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFrets(ctx, canvas, config);
  drawNut(ctx, canvas, config);
  drawStrings(ctx, canvas, config);
  drawStringNames(ctx, canvas, config);

  // Highlight current position
  if (currentNote) {
    const stringIndex = config.numStrings - currentNote.string;
    const fretIndex = currentNote.fret;

    let x, y;
    x = config.padding + stringIndex * config.stringSpacing;

    if (fretIndex === 0) {
      y = config.padding;
    } else {
      y = config.padding + fretIndex * config.fretSpacing - config.fretSpacing / 2;
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
