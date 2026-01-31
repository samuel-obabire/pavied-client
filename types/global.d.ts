type BankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  active?: boolean;
  userId?: string;
  dateAdded?: Date;
};

type DerivAccount = {
  accountId: string;
  currency: string;
  active?: boolean;
  userId?: string;
  token?: string;
  dateAdded?: Date;
};

type User = {
  fullName: string;
  id: string;
  email: string;
  telegramId: string;
  disabled?: boolean;
  phone: string;
  whatsApp: string;
  countryOfResidence?: string;
  provider: string;
  providerAccountId: string;
  createdAt: Date;
  updatedAt?: Date;
  onboardingStep: "bio" | "deriv" | "bank" | "complete";
};

type UserStats = {
  userId: string;
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalSuccessfulTransactions: number;
  totalFailedTransactions: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type SiteConfig = {
  maintenanceMode: false;
  paymentsPaused: false;

  deriv: {
    autopaymentsEnabled: true;

    deposits: {
      enabled: boolean;
      maxAmount: number;
    };

    withdrawals: {
      enabled: boolean;
      maxAmount: number;
    };

    updatedAt: Date;
    updatedBy: string;
    changeReason: string;
  };
};

type AdminBankAccount = {
  id: string;
  default?: boolean;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  syncedBanks: string[];
  blackListedBanks: string[];
  minAmountAllowed: number;
  maxAmountAllowed: number;
  requireManualConfirmation: boolean;
  dailyCap: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type OnboardingStep = User["onboardingStep"];

type Referral = {
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
  referralCount?: number;
  referrerId: string;
  refereeId: string;
  joinedAt: string;
};

type Fullfillment = {
  fulfilled: boolean;
  fulfilledAt?: Date;
  actor?: string;
  actorId?: string;
  referenceId?: string;
  note?: string;
};

interface BaseTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  createdAt: Date;
  updatedAt: Date;
  fulfillment: Fullfillment;
}

type DerivDeposit = BaseTransaction & {
  type: "deriv_deposit";
  assignedBank: {
    bankName: string;
    acountName: string;
    accountNumber: string;
    id: string;
  };
  extra: {
    currency: string;
    amount: number;
    derivLoginId: string;
    paidFromBankName: string;
    paidFromBankCode: string;
    paidFromAccountNumber: string;
    paidFromAccountName: string;
    recieptPath?: string;
    isPaymentConfirmed?: boolean;
    fundingInProgress?: boolean;
  };
};

type DerivWithdrawal = BaseTransaction & {
  type: "deriv_withdrawal";
  extra: {
    currency: string;
    amount: number;
    derivLoginId: string;
    receivingBankAccountNumber: string;
    recievingBankAccountName: string;
    receivingBankCode: string;
    receivingBankName: string;
  };
};

type DerivTransaction = DerivDeposit | DerivWithdrawal;

// Airtime Purchase
interface AirtimePurchaseTransaction extends BaseTransaction {
  type: "airtime_purchase";
  extra: {
    phoneNumber: string;
    network: string; // "MTN", "Airtel", "Glo"
  };
}

// Data Purchase
interface DataPurchaseTransaction extends BaseTransaction {
  type: "data_purchase";
  extra: {
    phoneNumber: string;
    bundleId: string; // e.g. "1GB_DAILY"
    network: string;
  };
}

// Airtime to Cash
interface AirtimeToCashTransaction extends BaseTransaction {
  type: "airtime_to_cash";
  extra: {
    phoneNumber: string;
    network: string;
  };
}

// interface BonusCredit extends BaseTransaction {
//   type: "bonus_credit";
//   extra: {
//     reason?: string;
//   };
// }

// Union type of ALL transaction variations
type Transaction =
  | DerivTransaction
  | AirtimePurchaseTransaction
  | DataPurchaseTransaction
  | AirtimeToCashTransaction;
// | BonusCredit;

type TransactionStatus = BaseTransaction["status"];

type AuditLog = {
  id: string;
  transactionId: string;
  type: EventType;
  message?: string;
  timestamp: Date;
  actor: "system" | "admin";
  actorId?: string;
  meta: {
    source: string; // MacroDroid, email
    autoConfirmed: boolean;
  };
};

type CurrencyConfig = {
  active: boolean;
  code: string;
  depositMax: number;
  depositMin: number;
  depositRate: number;
  lastUpdated: Date;
  name: string;
  smallAmountCharge: number;
  withdrawalMax: number;
  withdrawalMin: number;
  withdrawalRate: number;
};

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIResponse<T> = NextResponse<ErrorResponse | SuccessResponse<T>>;
type APIErrorResponse = NextResponse<ErrorResponse>;
