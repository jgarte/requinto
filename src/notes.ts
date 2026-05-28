export type Note = {
  string: number;
  fret: number;
  note: string;
};

export const notes: Note[] = [
  { string: 4, fret: 0, note: "C" },
  { string: 4, fret: 2, note: "D" },
  { string: 4, fret: 4, note: "E" },
  { string: 4, fret: 5, note: "F" },

  { string: 3, fret: 0, note: "G" },
  { string: 3, fret: 2, note: "A" },
  { string: 3, fret: 4, note: "B" },
  { string: 3, fret: 5, note: "C" },

  { string: 2, fret: 0, note: "D" },
  { string: 2, fret: 2, note: "E" },
  { string: 2, fret: 3, note: "F" },
  { string: 2, fret: 5, note: "G" },

  { string: 1, fret: 0, note: "A" },
  { string: 1, fret: 2, note: "B" },
  { string: 1, fret: 3, note: "C" },
  { string: 1, fret: 5, note: "D" },
];
