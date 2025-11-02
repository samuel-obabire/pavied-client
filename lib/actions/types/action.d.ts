export type DerivWithdrawalParams = {
  currency: string;
  derivLoginId: string;
  receivingBankAccountNumber: string;
  recievingBankAccountName: string;
  receivingBankCode: string;
  receivingBankName: string;
  amount: number;
};

export type DerivDepositParams = {
  currency: string;
  derivLoginId: string;
  paidFromBankName: string;
  paidFromBankCode: string;
  paidFromAccountNumber: string;
  paidFromAccountName: string;
  amount: number;
};

export type PaymentAgentWithdrawParams = {
  amount: number;
  currency: string;
  paymentagent_loginid: string;
  verification_code: string;
  token: string;
};

export type TransactionQueryParams = {
  page?: number;
  perPage?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  type?: string | null;
  status?: string | null;
};

export type FundDerivSuccess = {
  clientAccount: string | undefined;
  clientName: string | undefined;
  transactionId: number | undefined;
  paymentAgentTransfer: PaymentagentTransfer | undefined;
  amount: number;
  agentAccount: string;
  currency: string;
};
