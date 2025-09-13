# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

Potential issues through my POV:
1. Quoted fields and escapes: support fields like "last, first" and "quoted" according to standard CSV rules
2. Consistent column counts: fail fast (with row/column diagnostics) when a row’s number of fields differs from the first row or the schema’s expectation
3. Header row handling: optional hasHeader: boolean | "auto" and name-based access (map columns by header names)
4. Options & inputs: accept strings/streams in addition to file paths as well as options object for delimiter, quote, escape, trimming, empty-line behavior

- #### Step 2: Use an LLM to help expand your perspective.

Prompt A (pretty broad): “I’m working on a TypeScript CSV parser used by other developers. What missing features or edge cases should I consider to improve both functionality and extensibility?”  
Prompt B (more edge‑case heavy): “List CSV pitfalls beyond naive "line.split(',')": quoting, escaped quotes, CRLF vs LF, BOM, trailing commas, empty lines, whitespace, etc.”

Both prompts agree on moving beyond naive split(','), handling quoting/newlines, and exposing configurable options. Prompt A emphasized higher-level architecture-streaming/async iteration along with an options object while Prompt B listed specific correctness pitfalls (UTF-8 BOM, CRLF vs LF, trailing commas as empty cells, etc.) directly translatable into tests. In conclusion: implement B’s safeguards first for reliability and then layer A’s scalability and developer-experience features.

- #### Step 3: use an LLM to help expand your perspective.
1.
a. Proper CSV quoting & escapes, Functionality, Origin: Both (me and LLM) 
   User story: As a developer, I would want the parser to correctly handle quoted fields, embedded commas, and escaped double-quotes such that valid CSVs parse into their intended cells.
b. Consistent column counts with diagnostics, Functionality, Origin: Both  
   User story: As a developer, I would prefer early detection when any row has a different number of columns than expected so I can fix the data or adjust rules quickly.
c. Header-aware parsing, Extensibility, Origin: Mine
   User story: As a developer, I would want to opt into a header row and map data by column names so that my code is more clear and less index-fragile.
d. Options object & streaming API, Extensibility, Origin: LLM  
   User story: As a developer processing large CSVs, I would want a configurable parser (delimiter, quote, escape, trim, etc.) and an async-iterator interface in a way that I can process rows incrementally without loading the entire file.
2.
My initial ideas centered on spec-correctness (quotes/escapes, column consistency) and ergonomics (headers, options). The LLM, when consulted with, added operational robustness like BOM handling and scalability (e.g. streaming). Prompt A’s architecture focus complements Prompt B’s testable edge cases: together, they form a practical roadmap. What resonated most with me was prioritizing quoting/escapes and column diagnostics. Meanwhile, less compelling for this sprint was immediately implementing a full streaming API and an overly wide options surface that could over-scope the week.