const fs = require("fs");

function generateReconciliationReport(internalFilePath, sourceFilePath) {
  let mismatchedTransactions = [];
  let missingInInternal = [];
  let missingInSource = [];

  // Reading Files synchronously
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

    const sourceAmount = Number(parseFloat(sourceRow[4]).toFixed(2));
    const sourceStatus = sourceRow[6];

    sourceValues.push(sourceData[i].split(","));

    if (!internalMap.has(transactionId)) {
      const missingObj = {
        transactionId: sourceRow[0],
        amount: sourceRow[4],
        currency: sourceRow[5],
        status: sourceRow[6],
      };
      missingInInternal.push(missingObj);
    } else {
      const internalRow = internalMap.get(transactionId);
      const internalAmount = Number(parseFloat(internalRow[1]).toFixed(2));
      const internalStatus = internalRow[3];
      if (sourceAmount !== internalAmount || sourceStatus !== internalStatus) {
        const mismatchObj = {
          transaction_id: transactionId,
          discrepancies: {},
        };
        if (sourceAmount !== internalAmount) {
          mismatchObj.discrepancies.amount = {
            source: sourceAmount,
            internal: internalAmount,
          };
        }
        if (sourceStatus !== internalStatus) {
          mismatchObj.discrepancies.status = {
            source: sourceStatus,
            internal: internalStatus,
          };
        }
        mismatchedTransactions.push(mismatchObj);
      }

      internalMap.delete(transactionId);
    }
  }

  // Checking for missing transactions in source data
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
  fs.writeFileSync(
    "documents/reconciliation_report.json",
    JSON.stringify(reconciliationReport, null, 2),
    "utf-8"
  );
  return reconciliationReport;
}
const sourcePath = "documents/source_transactions.csv";
const internalPath = "documents/system_transactions.csv";
const reconciliationReport = generateReconciliationReport(
  internalPath,
  sourcePath
);
console.dir(reconciliationReport, { depth: null });
