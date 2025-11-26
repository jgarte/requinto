# Requinto Tablature Format

**Version 1.0** • 2025-11-26

A compact text format for encoding tablature sequences. Each note is written as `string:fret/duration`.

## Syntax

```
string:fret/duration
```

- **string** — positive integer (e.g., 1, 2, 3, 4)
- **fret** — non-negative integer (0 for open string)
- **duration** — positive number (integers or decimals)

Notes are separated by whitespace (spaces, tabs, or newlines).

## Grammar

```ebnf
document = { note } ;
note     = string ":" fret "/" duration ;

string   = positive-int ;
fret     = "0" | positive-int ;
duration = positive-int [ "." { digit } ] ;

positive-int  = digit-nonzero { digit } ;
digit-nonzero = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
digit         = "0" | digit-nonzero ;
```

## Examples

**Simple sequence:**
```
4:0/1 3:2/1 2:0/1 1:0/1
```

**With varied durations:**
```
4:0/2 3:2/1 2:4/0.5
```

**Multi-line formatting:**
```
4:0/1 3:2/1 2:0/1 1:0/1
1:4/1 1:2/1 1:0/1 2:4/1
```

## Notes

String numbering is instrument-specific. String 1 is typically the highest-pitched string.

Duration is relative. A value of 1 represents one base time unit; absolute timing is implementation-defined.

The format does not encode tuning information—this is expected to be provided separately or assumed by convention.

---

CC0 1.0 Universal — Public Domain
