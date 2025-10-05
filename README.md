# Transaction-Reconciliation-Service

A transaction reconciliation service or function that reads transactions from two provided JSON files, compares them, identify discrepancies, and generate a structured reconciliation report

## 1

# Read files synchronously, can be read async too but if ots gonna be used in an API.

## 2

# For better performance Filtered columns [Left Common columns between the two tables only]

# Old Source Headers [providerTransactionId email userId provider amount currency status transactionType paymentMethod createdAt updatedAt providerReference fraudRisk details_invoiceId details_customerName details_description]

# New Source Headers [providerTransactionId email userId provider amount currency status transactionType paymentMethod ][2 3 5 6 7 9]

////////////////////////////////////////////////////////////////////////////////////////

# Internal Headers [transactionId userId amount currency status paymentMethod createdAt updatedAt referenceId metadata_orderId metadata_description]

# New Internal Headers Internal Headers [transactionId userId amount currency status paymentMethod][1 2 3 4 5]
