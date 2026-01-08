export const ROUTES = {
  HOME: "/",
  CONTACT: "/contact",
  SIGN_IN: "/signin",
  SETTINGS: "/settings",
  SETTINGS_BIO: "/settings/bio",
  SETUP_DERIV: "/settings/deriv",
  SETUP_BANK: "/settings/bank",
  DASHBOARD: "/dashboard",
  ONBOARD_BIO: "/onboarding/bio",
  ONBOARD_DERIV: "/onboarding/deriv",
  ONBOARD_BANK: "/onboarding/bank",
  TRANSACTIONS: "/transactions",
  HANDLE_DERIV: "/handle-deriv",
  CONNECT_DERIV: "/connect-deriv",
  DERIV: {
    DEPOSIT: "/deriv/deposit",
    WITHDRAWAL: "/deriv/withdrawal",
  },
  PAYMENT: (paymentId: string) => `/payment-checkout/${paymentId}`,
  VERIFY_DERIV_WITHDRAW: (transactionId: string) =>
    `/verify-deriv-withdrawal?tx=${transactionId}`,
};
