const fs = require("fs");

let mismatchedTransactions = [];
let missingInInternal = [];
let missingInSource = [];

// Reading Files synchronously
const sourceData = fs
  .readFileSync("documents/source_transactions.csv", "utf-8")
  .split("\n");

const internalData = fs
  .readFileSync("documents/system_transactions.csv", "utf-8")
  .split("\n");

// Extracting table headers
const internalHeaders = internalData[0].split(",");
const sourceHeaders = sourceData[0].split(",");
console.log("Internal Headers:", internalHeaders);
console.log("Source Headers:", sourceHeaders);

// Creating a map for intenal data for faster access

const internalMap = new Map();

for (let i = 1; i < internalData.length; i++) {
  const internalRow = internalData[i].trim();

  const values = internalRow.split(",");
  internalMap.set(values[0], values.slice(2, 6));
}
console.log("Internal Map:", internalMap);

let sourceValues = [];
for (let i = 1; i < sourceData.length; i++) {
  const sourceRow = sourceData[i].split(",");
  const transactionId = sourceRow[0];

  sourceValues.push(sourceData[i].split(","));
  if (!internalMap.has(transactionId)) {
    const missingObj = {
      [internalHeaders[0]]: sourceRow[0],
      [internalHeaders[1]]: sourceRow[2],
      [internalHeaders[2]]: sourceRow[4],
      [internalHeaders[3]]: sourceRow[5],
      [internalHeaders[4]]: sourceRow[6],
      [internalHeaders[5]]: sourceRow[8],
    };
    missingInInternal.push(missingObj);
  }
}
console.log("Missing in internal:", missingInInternal);

// const reconciliationReport = {
//   missing_in_internal: missingInInternal,
//   missing_in_source: missingInSource,
//   mismatched_transactions: mismatchedTransactions,
// };
