export interface DbTransaction {
  getBankAccount(
    bankCode: string,
    accountNumber: string,
  ): Promise<BankAccount | null>;

  addBankAccount(bankAccount: BankAccount, userId: string): Promise<void>;

  getDerivAccount(account: {
    currency: string;
    accountId: string;
  }): Promise<DerivAccount | null>;

  addDerivAccount(derivAccount: DerivAccount, userId: string): Promise<void>;
  getTransaction(transactionId: string): Promise<Transaction | null>;
  updateTransaction<T extends { [x: string]: any }>(
    transactionId: string,
    data: T,
  ): Promise<void>;
}
