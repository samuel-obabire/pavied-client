type BankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  userId?: string;
  dateAdded?: number;
};

type Currency = "USD" | "USDC" | "tUSDT";

type DerivAccount = {
  accountId: string;
  currency: Currency;
  userId?: string;
  dateAdded?: number;
};

type User = {
  fullName: string;
  id: string;
  email: string;
  telegramId: string;
  phone: string;
  whatsApp: string;
  bankAccounts?: BankAccount[];
  derivAccounts?: DerivAccount[];
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
  referralCount?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  provider: string;
  providerAccountId: string;
  createdAt: number;
  updatedAt: number;
  onboardingStep: "bio" | "deriv" | "bank" | "complete";
};

type OnboardingStep = User["onboardingStep"];

type Referral = {
  referrerId: string;
  refereeId: string;
  joinedAt: string;
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
