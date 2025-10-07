Transaction Reconciliation Service

A Node.js-based reconciliation utility that compares two transaction datasets — one from an external source and one from an internal system — to identify:
• Missing transactions in either dataset
• Mismatched transaction amounts or statuses
• Generates a structured JSON report summarizing all the past functionalities

## Running

1. git clone https://github.com/M-akram101/Transaction-Reconciliation-Service.git

cd transaction-reconciliation-service

2. Project Structure

   project/
   ├── main.js
   ├── data/
   │ ├── source_transactions.csv
   │ └── system_transactions.csv
   └── results/
   └── reconciliation_report.json (auto-generated)

3. Run the script

   node main.js

## Technical Design Rationale

1. File Handling
   • Uses Node.js fs.readFileSync().
   • Synchronous reading ensures clean, predictable data processing for small–medium datasets.
   • Can easily be converted to async (fs.promises.readFile) for API or large-scale use cases.

2. Efficient Data Matching
   • The internal dataset is stored in a Map keyed by transactionId ; allows O(1) lookups.
   • Each source transaction is checked once:
   • If missing in internal ; pushed to missing_in_internal
   • If present ; validated for amount/status mismatches
   • Matched transactions are deleted from the map to later detect missing in source

3. Accuracy in Comparison
   • Amounts rounded to two decimal places to prevent floating-point precision issues, and similar to the amount col in both tables.
   • Status compared as case-sensitive strings to ensure exact matches.

4. Final Report
   • All results consolidated into one structured JSON object:
   • missing_in_internal
   • missing_in_source
   • mismatched_transactions
   • Automatically written to results/reconciliation_report.json.

## Code Review Notes

    • Readable & Maintainable: Clear variable names and logical structure.
    • Performance: Uses Map and single-pass iteration (O(n) time).
    • Extensible: Can easily add new comparison fields or output formats.

    Potential Improvements:
    •	error handling—should be expanded to handle missing files  or invalid CSV data.
    • Use csv-parser instead of fs:
        1.Skips empty rows
        2.Auto-trims headers
        3.Parses header names automatically
        4.Can handle streaming large files
        5.Clean readable code
