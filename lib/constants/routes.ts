export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/",
  REGISTER_BIO: "/settings/bio",
  SETUP_DERIV: "/settings/deriv",
  SETUP_BANK: "/settings/bank",
  DASHBOARD: "/dashboard",
  ONBOARD_BIO: "/onboarding/bio",
  ONBOARD_DERIV: "/onboarding/deriv",
  ONBOARD_BANK: "/onboarding/bank",
  TRANSACTIONS: "/transactions",
  CONNECT_DERIV: "/connect-deriv",
  DERIV: {
    DEPOSIT: "/deriv/deposit",
    WITHDRAWAL: "/deriv/withdrawal",
  },
  PAYMENT: (paymentId: string) => `/payment-checkout/${paymentId}`,
};
