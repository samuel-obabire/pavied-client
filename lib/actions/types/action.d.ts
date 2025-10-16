export type DerivDepositParams = {
  depositBankAccount: BankAccount;
  depositDerivAccount: DerivAccount;
  nairaAmount: number;
  convertedAmount: number;
};

export type UpdatePaymentTransactionParams = {
  status?: Exclude<BaseTransaction["status"], "pending">;
  fulfilled?: boolean;
  recieptPath: string;
  fulfilledAt?: Date;
  actorId?: string;
  referenceId?: string;
  note?: string;
};
