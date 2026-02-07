export function pickRandom<T>(arr: readonly T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export class BankAccountSelector {
  accounts: AdminBankAccount[];

  constructor(accounts: AdminBankAccount[]) {
    this.accounts = accounts;
  }

  withoutBlacklisted(clientBankCode: string): BankAccountSelector {
    return new BankAccountSelector(
      this.accounts.filter(
        (acc) => !acc.blackListedBanks.includes(clientBankCode),
      ),
    );
  }

  withinAmountRange(amount: number): BankAccountSelector {
    return new BankAccountSelector(
      this.accounts.filter(
        (acc) =>
          acc.minAmountAllowed <= amount && acc.maxAmountAllowed >= amount,
      ),
    );
  }

  get value(): AdminBankAccount[] {
    return [...this.accounts];
  }
}
