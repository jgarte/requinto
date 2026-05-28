// banjo
// Copyright (C) 2026 jgart
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

import { notes } from "./notes.js";
import type { Note } from "./notes.js";

export const NOTE_RADIUS: number = 12;

// This module renders the fretboard with the Canvas 2D API. All drawing goes
// through a CanvasRenderingContext2D (`ctx`): the path methods (beginPath,
// moveTo, lineTo, stroke) draw the fret and string lines, arc + fill/stroke
// draw the note markers, fillText draws note names, and clearRect wipes the
// canvas before each redraw. strokeStyle / fillStyle / lineWidth / font /
// textAlign set the drawing state.
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

type FretboardConfig = {
  padding: number;
  numStrings: number;
  numFrets: number;
  stringSpacing: number;
  fretSpacing: number;
};

export function drawFrets(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: FretboardConfig,
): void {
  // Draw frets as horizontal lines via the path API: beginPath starts a path,
  // moveTo/lineTo define the segment, stroke renders it.
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

export function drawNut(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: FretboardConfig,
): void {
  // Draw nut (first fret thicker)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(config.padding, config.padding);
  ctx.lineTo(canvas.width - config.padding, config.padding);
  ctx.stroke();
}

export function drawStrings(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: FretboardConfig,
): void {
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

export function drawFretboard(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  currentNote: Note,
  showingAnswer: boolean,
): void {
  const config: FretboardConfig = {
    padding: 40,
    numStrings: 4,
    numFrets: 5,
    stringSpacing: 0,
    fretSpacing: 0,
  };

  config.stringSpacing =
    (canvas.width - 2 * config.padding) / (config.numStrings - 1);
  config.fretSpacing = (canvas.height - 2 * config.padding) / config.numFrets;

  // clearRect wipes the whole canvas before redrawing the frame.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFrets(ctx, canvas, config);
  drawNut(ctx, canvas, config);
  drawStrings(ctx, canvas, config);

  // Highlight current note
  const stringIndex = config.numStrings - currentNote.string;
  const fretIndex = currentNote.fret;

  let x = config.padding + stringIndex * config.stringSpacing;
  let y: number;

  if (fretIndex === 0) {
    y = config.padding - 15;
  } else {
    y =
      config.padding + fretIndex * config.fretSpacing - config.fretSpacing / 2;
  }

  // Draw circle at position
  ctx.fillStyle = "#FF6B6B";
  ctx.beginPath();
  ctx.arc(x, y, NOTE_RADIUS, 0, 2 * Math.PI);
  ctx.fill();

  // If showing answer, display note name
  if (showingAnswer) {
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(currentNote.note, x, y + 5);
  }
}
