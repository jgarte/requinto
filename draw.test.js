import { test } from 'node:test';
import assert from 'node:assert';
import { drawFretboard } from './draw.js';

// Simple mock canvas context
function createMockContext() {
  return {
    strokeStyle: null,
    fillStyle: null,
    lineWidth: null,
    textAlign: null,
    font: null,
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    arc() {},
    fill() {},
    fillText() {},
    clearRect() {}
  };
}

function createMockCanvas() {
  return { width: 300, height: 500 };
}

test('drawFretboard runs without errors', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();

  // Should not throw
  drawFretboard(ctx, canvas, null, false);
});

test('drawFretboard shows note with a highlight', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();
  const note = { string: 2, fret: 3, note: 'F' };

  // Should not throw
  drawFretboard(ctx, canvas, note, false);
});

test('drawFretboard shows note name when revealing answer', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();
  const note = { string: 2, fret: 3, note: 'F' };

  // Should not throw
  drawFretboard(ctx, canvas, note, true);
});
