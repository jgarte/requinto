import { test } from 'node:test';
import assert from 'node:assert';
import * as fc from 'fast-check';
import { drawFretboard, drawFrets, drawNut, drawStrings, drawStringNames } from './draw.js';

// Mock canvas context that tracks calls
function createMockContext() {
  const calls = [];
  return {
    calls, // Expose for assertions
    strokeStyle: null,
    fillStyle: null,
    lineWidth: null,
    textAlign: null,
    font: null,
    beginPath() { calls.push('beginPath'); },
    moveTo(x, y) { calls.push(['moveTo', x, y]); },
    lineTo(x, y) { calls.push(['lineTo', x, y]); },
    stroke() { calls.push('stroke'); },
    arc(x, y, r, start, end) { calls.push(['arc', x, y, r, start, end]); },
    fill() { calls.push('fill'); },
    fillText(text, x, y) { calls.push(['fillText', text, x, y]); },
    clearRect(x, y, w, h) { calls.push(['clearRect', x, y, w, h]); }
  };
}

function createMockCanvas(width = 300, height = 500) {
  return { width, height };
}

// All valid notes in the requinto (C-D-G-C tuning)
const allValidNotes = [
  { string: 4, fret: 0, note: "C" },
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

test('property: drawFretboard never throws for any valid note and showingAnswer combination', () => {
  // Test EVERY possible case: 11 notes × 2 showingAnswer states = 22 cases
  fc.assert(
    fc.property(
      fc.constantFrom(...allValidNotes),
      fc.boolean(),
      (note, showingAnswer) => {
        const ctx = createMockContext();
        const canvas = createMockCanvas();

        // Should never throw
        assert.doesNotThrow(() => {
          drawFretboard(ctx, canvas, note, showingAnswer);
        });
      }
    ),
    { numRuns: 22 } // We have exactly 22 combinations to test
  );
});

test('property: drawFretboard handles null note gracefully', () => {
  fc.assert(
    fc.property(
      fc.boolean(),
      (showingAnswer) => {
        const ctx = createMockContext();
        const canvas = createMockCanvas();

        assert.doesNotThrow(() => {
          drawFretboard(ctx, canvas, null, showingAnswer);
        });
      }
    )
  );
});

test('property: drawFretboard always clears canvas first', () => {
  fc.assert(
    fc.property(
      fc.option(fc.constantFrom(...allValidNotes), { nil: null }),
      fc.boolean(),
      (note, showingAnswer) => {
        const ctx = createMockContext();
        const canvas = createMockCanvas();

        drawFretboard(ctx, canvas, note, showingAnswer);

        // First call should be clearRect
        assert.strictEqual(ctx.calls[0][0], 'clearRect');
      }
    )
  );
});

test('property: drawFretboard calls arc when note is provided', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...allValidNotes),
      fc.boolean(),
      (note, showingAnswer) => {
        const ctx = createMockContext();
        const canvas = createMockCanvas();

        drawFretboard(ctx, canvas, note, showingAnswer);

        // Should have at least one arc call for highlighting the note
        const arcCalls = ctx.calls.filter(call => Array.isArray(call) && call[0] === 'arc');
        assert.ok(arcCalls.length > 0, 'Expected arc calls for note highlighting');
      }
    )
  );
});

test('property: drawFretboard shows note text only when showingAnswer is true', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...allValidNotes),
      (note) => {
        // Test with showingAnswer = false
        const ctx1 = createMockContext();
        const canvas1 = createMockCanvas();
        drawFretboard(ctx1, canvas1, note, false);

        const textCallsHidden = ctx1.calls.filter(
          call => Array.isArray(call) && call[0] === 'fillText' && call[1] === note.note
        );
        assert.strictEqual(textCallsHidden.length, 0, 'Should not show note text when hidden');

        // Test with showingAnswer = true
        const ctx2 = createMockContext();
        const canvas2 = createMockCanvas();
        drawFretboard(ctx2, canvas2, note, true);

        const textCallsShown = ctx2.calls.filter(
          call => Array.isArray(call) && call[0] === 'fillText' && call[1] === note.note
        );
        assert.strictEqual(textCallsShown.length, 1, 'Should show note text when revealed');
      }
    )
  );
});

test('property: drawFrets creates correct number of horizontal lines', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 1000 }),
      fc.integer({ min: 100, max: 1000 }),
      (width, height) => {
        const ctx = createMockContext();
        const canvas = { width, height };
        const config = {
          padding: 40,
          numFrets: 5,
          fretSpacing: (height - 80) / 5
        };

        drawFrets(ctx, canvas, config);

        // Should have 6 lines (0 through 5 = 6 frets)
        const strokes = ctx.calls.filter(call => call === 'stroke');
        assert.strictEqual(strokes.length, 6);
      }
    )
  );
});

test('property: drawStrings creates correct number of vertical lines', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 1000 }),
      fc.integer({ min: 100, max: 1000 }),
      (width, height) => {
        const ctx = createMockContext();
        const canvas = { width, height };
        const config = {
          padding: 40,
          numStrings: 4,
          stringSpacing: (width - 80) / 3
        };

        drawStrings(ctx, canvas, config);

        // Should have 4 lines (4 strings)
        const strokes = ctx.calls.filter(call => call === 'stroke');
        assert.strictEqual(strokes.length, 4);
      }
    )
  );
});

test('property: drawStringNames labels all strings', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 1000 }),
      (width) => {
        const ctx = createMockContext();
        const canvas = { width, height: 500 };
        const config = {
          padding: 40,
          numStrings: 4,
          stringNames: ["C", "D", "G", "C"],
          stringSpacing: (width - 80) / 3
        };

        drawStringNames(ctx, canvas, config);

        // Should have 4 fillText calls (one per string)
        const textCalls = ctx.calls.filter(call => Array.isArray(call) && call[0] === 'fillText');
        assert.strictEqual(textCalls.length, 4);

        // Verify all string names appear
        const texts = textCalls.map(call => call[1]);
        assert.deepStrictEqual(texts, ["C", "D", "G", "C"]);
      }
    )
  );
});

test('property: drawNut creates exactly one stroke', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 1000 }),
      (width) => {
        const ctx = createMockContext();
        const canvas = { width, height: 500 };
        const config = { padding: 40 };

        drawNut(ctx, canvas, config);

        // Should have exactly 1 stroke for the nut
        const strokes = ctx.calls.filter(call => call === 'stroke');
        assert.strictEqual(strokes.length, 1);
      }
    )
  );
});

// Exhaustive test: every single note with both showingAnswer states
test('exhaustive: all 11 notes × 2 states = 22 cases', () => {
  let testCount = 0;

  for (const note of allValidNotes) {
    for (const showingAnswer of [false, true]) {
      const ctx = createMockContext();
      const canvas = createMockCanvas();

      assert.doesNotThrow(() => {
        drawFretboard(ctx, canvas, note, showingAnswer);
      }, `Failed on note ${note.note} (string ${note.string}, fret ${note.fret}), showing=${showingAnswer}`);

      testCount++;
    }
  }

  assert.strictEqual(testCount, 22, 'Should have tested exactly 22 cases');
});

test('property: explore mode shows all notes with labels', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();

  drawFretboard(ctx, canvas, null, false, allValidNotes);

  // Should have 11 arc calls (one per note)
  const arcCalls = ctx.calls.filter(call => Array.isArray(call) && call[0] === 'arc');
  // Plus natural note markers (11 natural notes in the array)
  assert.ok(arcCalls.length >= 11, `Expected at least 11 arc calls, got ${arcCalls.length}`);

  // Should have 11 fillText calls with note names
  const noteLabelCalls = ctx.calls.filter(
    call => Array.isArray(call) &&
           call[0] === 'fillText' &&
           allValidNotes.some(n => n.note === call[1])
  );
  assert.strictEqual(noteLabelCalls.length, 11, 'Should show all 11 note labels in explore mode');
});

test('property: explore mode and training mode are mutually exclusive', () => {
  const ctx = createMockContext();
  const canvas = createMockCanvas();
  const singleNote = allValidNotes[0];

  // Call with both currentNote and allNotes - allNotes should take precedence
  drawFretboard(ctx, canvas, singleNote, false, allValidNotes);

  // Should have note labels for all notes, not just one
  const noteLabelCalls = ctx.calls.filter(
    call => Array.isArray(call) &&
           call[0] === 'fillText' &&
           allValidNotes.some(n => n.note === call[1])
  );
  assert.strictEqual(noteLabelCalls.length, 11, 'Should show all notes when in explore mode');
});
