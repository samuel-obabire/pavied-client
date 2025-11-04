export type State = {
  step: number;
  isLoading: boolean;
  errorMessage: string;
  selectedDerivAccount: DerivAccount | null;
  selectedBankAccount: BankAccount | null;
  depositAmount: string;
  convertedAmount: string;
};

export const initialState: State = {
  step: 1,
  isLoading: false,
  errorMessage: "",
  selectedDerivAccount: null,
  selectedBankAccount: null,
  depositAmount: "",
  convertedAmount: "",
};

export type Action =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SELECT_DERIV_ACCOUNT"; payload: DerivAccount }
  | { type: "SELECT_BANK_ACCOUNT"; payload: BankAccount }
  | { type: "SET_DEPOSIT_AMOUNT"; payload: string }
  | { type: "SET_CONVERTED_AMOUNT"; payload: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload };
    case "SELECT_DERIV_ACCOUNT":
      return {
        ...state,
        selectedDerivAccount:
          state.selectedDerivAccount?.accountId === action.payload.accountId
            ? null
            : action.payload,
      };
    case "SELECT_BANK_ACCOUNT":
      return {
        ...state,
        selectedBankAccount:
          state.selectedBankAccount?.accountNumber === action.payload.accountNumber &&
          state.selectedBankAccount?.bankCode === action.payload.bankCode
            ? null
            : action.payload,
      };
    case "SET_DEPOSIT_AMOUNT":
      return { ...state, depositAmount: action.payload };
    case "SET_CONVERTED_AMOUNT":
      return { ...state, convertedAmount: action.payload };
    default:
      return state;
  }
}
