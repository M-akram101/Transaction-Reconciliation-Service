const fs = require("fs");

function generateReconciliationReport(internalFilePath, sourceFilePath) {
  let mismatchedTransactions = [];
  let missingInInternal = [];
  let missingInSource = [];

  // Reading Files
  const sourceData = fs.readFileSync(sourceFilePath, "utf-8").split("\n");
  const internalData = fs.readFileSync(internalFilePath, "utf-8").split("\n");

  // Creating a map for intenal data for faster access
  const internalMap = new Map();
  for (let i = 1; i < internalData.length - 1; i++) {
    const internalRow = internalData[i].trim();

    const values = internalRow.split(",");
    internalMap.set(values[0], values.slice(1, 5));
  }

  // Getting Missing in Internal and Mismatched Transactions
  let sourceValues = [];
  for (let i = 1; i < sourceData.length - 1; i++) {
    const sourceRow = sourceData[i].split(",");
    const transactionId = sourceRow[0];

    const sourceAmount = Math.round(sourceRow[4] * 100);
    const sourceStatus = sourceRow[6];

    sourceValues.push(sourceData[i].split(","));

    // Checking for missing transactions in internal, by source's transaction id

    if (!internalMap.has(transactionId)) {
      const missingObj = {
        transactionId: sourceRow[0],
        amount: sourceRow[4],
        currency: sourceRow[5],
        status: sourceRow[6],
      };
      missingInInternal.push(missingObj);
    }
    // Checking for the missmatched transactions, on the common rows of both tables
    else {
      const internalRow = internalMap.get(transactionId);
      const internalAmount = Math.round(internalRow[1] * 100);
      const internalStatus = internalRow[3];
      if (sourceAmount !== internalAmount || sourceStatus !== internalStatus) {
        const mismatchObj = {
          transaction_id: transactionId,
          discrepancies: {},
        };
        if (sourceAmount !== internalAmount) {
          mismatchObj.discrepancies.amount = {
            source: sourceAmount / 100,
            internal: internalAmount / 100,
          };
        }
        if (sourceStatus !== internalStatus) {
          mismatchObj.discrepancies.status = {
            source: sourceStatus,
            internal: internalStatus,
          };
        }
        // Deleting the row from map to later extract missing in source
        mismatchedTransactions.push(mismatchObj);
      }

      internalMap.delete(transactionId);
    }
  }

  // Looping on missing transactions in source data
  for (const [transactionId, internalRow] of internalMap) {
    const missingObj = {
      providerTransactionId: transactionId,
      amount: internalRow[1],
      currency: internalRow[2],
      status: internalRow[3],
    };
    missingInSource.push(missingObj);
  }

  const reconciliationReport = {
    missing_in_internal: missingInInternal,
    missing_in_source: missingInSource,
    mismatched_transactions: mismatchedTransactions,
  };
  // Writing the report to a JSON file, for better readability.
  fs.writeFileSync(
    "results/reconciliation_report.json",
    JSON.stringify(reconciliationReport, null, 2),
    "utf-8"
  );
  return reconciliationReport;
}
const sourcePath = "data/source_transactions.csv";
const internalPath = "data/system_transactions.csv";
const reconciliationReport = generateReconciliationReport(
  internalPath,
  sourcePath
);
console.dir(reconciliationReport, { depth: null });
