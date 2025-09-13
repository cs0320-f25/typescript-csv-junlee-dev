1. Correctness
A CSV parser is correct when it accepts exactly the values permitted by the CSV schema. This means it must correctly implement the rules, e.g., for quoting and escaping. It must also enforce consistent column counts across rows, raising errors for malformed rows. When headers are enabled, it should guarantee that each row has the same number of fields as the header and that header names are unique. Finally, correctness includes robustness: malformed input must not cause crashes or silent corruption, but should yield detailed errors. 

2. Random, On‑Demand Generation
Random data lets me move from example‑based tests to property based testing. I would generate tables with edge cases (quotes, escaped quotes, trailing delimiters, etc.). I'd also be able to test how the parser works when I give it a lot of data (e.g., more than 10,000 rows).

3. Overall experience, Bugs encountered and resolved
This sprint emphasized schema that allows for more robust parsing. The biggest surprise was how fragile naive parsing is: once I added tests with commas in quotes, failures appeared immediately. I encountered errors with error handling (returning the actual error). I fixed it by looking at documentation. I also had a minor logic error with returning the correct row that raises the error. I fixed it by correctly incrementing the index.