export const transactionTypes = {
  derivDeposit: "deriv_deposit",
  derivWithdrawal: "deriv_withdrawal",
  airtimePurchase: "airtime_purchase",
  dataPurchase: "data_purchase",
  airtimeToCash: "airtime_to_cash",
} as const;

export const transactionStatusTypes: BaseTransaction["status"][] = [
  "pending",
  "processing",
  "success",
  "failed",
] as const;
