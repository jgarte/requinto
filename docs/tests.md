# Test Documentation

This document explains the purpose and behavior of each test in the Requinto project.

## notes.test.js

Tests for the banjo note data structure that maps fret positions to musical notes.

### Test 1: "every note name matches its pitch on the C-G-D-A fretboard"

**Purpose:** Validates that each note's name corresponds to the correct pitch on the banjo.

**How it works:**
- Iterates through all notes in the `notes` array
- For each note, calculates the expected pitch based on:
  - The open string pitch for that string (C, G, D, or A)
  - The fret number (each fret raises the pitch by one semitone)
- Asserts that the note's name matches the calculated expected pitch

**Why it matters:** Ensures the note data is musically correct. A fretboard with incorrect pitches would be useless for learning.

### Test 2: "includes only natural notes (no sharps)"

**Purpose:** Verifies that all notes in the dataset are natural notes (C, D, E, F, G, A, B) without any sharps.

**How it works:**
- Iterates through all notes in the `notes` array
- Checks that each note's name does not contain a "#" character
- Asserts if any sharp notes are found

**Why it matters:** The application is designed to teach only natural notes. This test ensures we're not accidentally including sharp notes like C# or F#.

### Test 3: "covers exactly the natural notes in frets 0-5"

**Purpose:** Validates that the dataset contains the correct number of notes—all natural notes that can be played on frets 0-5 across all 4 strings.

**How it works:**
- Calculates how many natural notes exist across all 4 strings in frets 0-5
- Counts: for each string, iterates through frets 0-5, and counts each natural note
- Asserts that the length of the `notes` array matches this expected count

**Why it matters:** Ensures the dataset is complete and not missing any notes, and not accidentally including extra notes.

---

## draw.property.test.js

Property-based tests for the canvas drawing functions that render the banjo fretboard UI.

These tests use [fast-check](https://github.com/dubzzz/fast-check) for property-based testing, which automatically generates test cases rather than using hardcoded examples.

### Test 1: "property: drawFretboard never throws for any valid note and showingAnswer combination"

**Purpose:** Ensures the `drawFretboard` function is robust and never crashes, regardless of input.

**How it works:**
- Property generator creates all 32 combinations of:
  - 16 valid notes from the banjo
  - 2 boolean states for `showingAnswer` (true/false)
- For each combination, calls `drawFretboard` and asserts it doesn't throw
- Uses a mock canvas context to track function calls

**Why it matters:** Crash safety is critical for user-facing code. If the drawing function throws, it breaks the app. This tests all possible valid inputs.

### Test 2: "property: drawFretboard always clears canvas first"

**Purpose:** Validates that the canvas is cleared before drawing begins.

**How it works:**
- For each note and `showingAnswer` combination, calls `drawFretboard`
- Checks that the first call made to the canvas context is `clearRect`
- Asserts if a different call is first

**Why it matters:** If the canvas isn't cleared, old drawings would accumulate and overlap, creating visual corruption. This ensures proper initialization.

### Test 3: "property: drawFretboard calls arc when note is provided"

**Purpose:** Verifies that the drawing function calls the `arc()` method to highlight the note position.

**How it works:**
- For each note and `showingAnswer` combination, calls `drawFretboard`
- Filters the mock context's call log for `arc` calls
- Asserts that at least one arc call exists

**Why it matters:** The `arc()` call draws the circle that highlights where the note is on the fretboard. Without this, the user wouldn't see which fret/string to target.

### Test 4: "property: drawFretboard shows note text only when showingAnswer is true"

**Purpose:** Validates the answer reveal mechanism—text should only be visible when showing the answer.

**How it works:**
- For each note, calls `drawFretboard` twice:
  - Once with `showingAnswer = false`
  - Once with `showingAnswer = true`
- When `showingAnswer = false`: asserts that no `fillText` call contains the note name
- When `showingAnswer = true`: asserts that exactly one `fillText` call contains the note name

**Why it matters:** The app's core feature is a quiz mode where the user first tries to identify a note, then reveals the answer. This test ensures that reveal behavior works correctly.

---

## Test Coverage Summary

| Module | Tests | Coverage |
|--------|-------|----------|
| `notes.js` | 3 | Data structure integrity, completeness, and constraints |
| `draw.js` | 4 | Function robustness, visual correctness, and interactive behavior |

All tests are property-based or exhaustive, ensuring comprehensive validation beyond single examples.
