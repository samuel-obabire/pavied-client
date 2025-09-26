type BankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  userId?: string;
  dateAdded?: Date;
};

type DerivAccount = {
  accountId: string;
  currency: string;
  userId?: string;
  dateAdded?: Date;
};

type User = {
  fullName: string;
  id: string;
  email: string;
  telegramId: string;
  phone: string;
  whatsApp: string;
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
  referralCount?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  provider: string;
  providerAccountId: string;
  createdAt: Date;
  updatedAt?: Date;
  onboardingStep: "bio" | "deriv" | "bank" | "complete";
};

type OnboardingStep = User["onboardingStep"];

type Referral = {
  referrerId: string;
  refereeId: string;
  joinedAt: string;
};

// Common fields for ALL transactions
interface BaseTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  provider: string; // e.g. "Deriv", "MTN", "Airtel"
  reference: string;
  fulfilledTo: string;
  createdAt: Date;
  updatedAt: Date;
}

// Deriv Deposit / Withdrawal
interface DerivTransaction extends BaseTransaction {
  type: "deriv_deposit" | "deriv_withdrawal";
  accountId: string; // Deriv login ID
}

// Airtime Purchase
interface AirtimePurchaseTransaction extends BaseTransaction {
  type: "airtime_purchase";
  phoneNumber: string;
  network: string; // "MTN", "Airtel", "Glo"
}

// Data Purchase
interface DataPurchaseTransaction extends BaseTransaction {
  type: "data_purchase";
  phoneNumber: string;
  bundleId: string; // e.g. "1GB_DAILY"
  network: string;
}

// Airtime to Cash
interface AirtimeToCashTransaction extends BaseTransaction {
  type: "airtime_to_cash";
  phoneNumber: string;
  network: string;
}

// Union type of ALL transaction variations
type Transaction =
  | DerivTransaction
  | AirtimePurchaseTransaction
  | DataPurchaseTransaction
  | AirtimeToCashTransaction;

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
