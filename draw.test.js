import { test } from 'node:test';
import assert from 'node:assert';
import { drawFretboard } from './draw.js';

// Mock canvas context that tracks method calls
function createMockContext() {
  const calls = [];

  return {
    calls,
    strokeStyle: null,
    fillStyle: null,
    lineWidth: null,
    textAlign: null,
    font: null,

    beginPath() {
      calls.push({ method: 'beginPath' });
    },

    moveTo(x, y) {
      calls.push({ method: 'moveTo', args: [x, y] });
    },

    lineTo(x, y) {
      calls.push({ method: 'lineTo', args: [x, y] });
    },

    stroke() {
      calls.push({ method: 'stroke' });
    },

    arc(x, y, radius, startAngle, endAngle) {
      calls.push({ method: 'arc', args: [x, y, radius, startAngle, endAngle] });
    },

    fill() {
      calls.push({ method: 'fill' });
    },

    fillText(text, x, y) {
      calls.push({ method: 'fillText', args: [text, x, y] });
    },

    clearRect(x, y, width, height) {
      calls.push({ method: 'clearRect', args: [x, y, width, height] });
    }
  };
}

function createMockCanvas(width = 300, height = 500) {
  return { width, height };
}

test('drawFretboard renders a complete requinto fretboard', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();

  drawFretboard(ctx, canvas, null, false);

  // Should clear canvas before drawing
  const clearRectCall = ctx.calls.find(c => c.method === 'clearRect');
  assert.ok(clearRectCall, 'Should clear canvas before drawing');

  // Should draw natural note markers
  const arcCalls = ctx.calls.filter(c => c.method === 'arc' && c.args[2] === 8);
  assert.ok(arcCalls.length > 0, 'Should draw natural note markers');

  // Should draw frets, nut, and strings (basic structure check)
  const hasLines = ctx.calls.some(c => c.method === 'lineTo');
  assert.ok(hasLines, 'Should draw fretboard structure');
});

test('note position is highlighted when currentNote is provided', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();
  const currentNote = { string: 2, fret: 3, note: 'F' };

  drawFretboard(ctx, canvas, currentNote, false);

  // Should draw a circle for the note position (radius 15, not 8 for natural notes)
  const arcCalls = ctx.calls.filter(c => c.method === 'arc');
  const highlightArc = arcCalls.find(call => call.args[2] === 15);
  assert.ok(highlightArc, 'Should draw circle at note position');

  const [x, y, radius] = highlightArc.args;
  assert.ok(x > 0 && y > 0, 'Note position should be within canvas bounds');
  assert.strictEqual(radius, 15, 'Note indicator should have consistent size');
});

test('note name visibility toggles with showingAnswer', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();
  const currentNote = { string: 2, fret: 3, note: 'F' };

  // When NOT showing answer
  drawFretboard(ctx, canvas, currentNote, false);
  const hiddenCalls = ctx.calls.filter(c => c.method === 'fillText');
  const hiddenNote = hiddenCalls.find(c => c.args[0] === 'F');
  assert.strictEqual(hiddenNote, undefined,
    'Note name should be hidden when showingAnswer is false');

  // When showing answer
  ctx.calls.length = 0; // Clear previous calls
  drawFretboard(ctx, canvas, currentNote, true);
  const visibleCalls = ctx.calls.filter(c => c.method === 'fillText');
  const visibleNote = visibleCalls.find(c => c.args[0] === 'F');
  assert.ok(visibleNote, 'Note name should be visible when showingAnswer is true');
});

test('note position calculation differs by string', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();

  // String 1 (high C)
  drawFretboard(ctx, canvas, { string: 1, fret: 2, note: 'D' }, false);
  const string1Arc = ctx.calls.filter(c => c.method === 'arc').find(call => call.args[2] === 15);
  const [x1] = string1Arc.args;

  // String 4 (low C)
  ctx.calls.length = 0;
  drawFretboard(ctx, canvas, { string: 4, fret: 2, note: 'D' }, false);
  const string4Arc = ctx.calls.filter(c => c.method === 'arc').find(call => call.args[2] === 15);
  const [x4] = string4Arc.args;

  assert.notStrictEqual(x1, x4,
    'Different strings should have different x positions');
});

test('note position calculation differs by fret', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();

  // Fret 0 (open string)
  drawFretboard(ctx, canvas, { string: 2, fret: 0, note: 'G' }, false);
  const fret0Arc = ctx.calls.filter(c => c.method === 'arc').find(call => call.args[2] === 15);
  const [, y0] = fret0Arc.args;

  // Fret 5
  ctx.calls.length = 0;
  drawFretboard(ctx, canvas, { string: 2, fret: 5, note: 'C' }, false);
  const fret5Arc = ctx.calls.filter(c => c.method === 'arc').find(call => call.args[2] === 15);
  const [, y5] = fret5Arc.args;

  assert.notStrictEqual(y0, y5,
    'Different frets should have different y positions');
  assert.ok(y5 > y0,
    'Higher frets should be positioned lower on vertical fretboard');
});
