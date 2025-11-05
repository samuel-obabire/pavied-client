import { useCallback, useReducer } from "react";
import { sanitizeTwoDecimals, truncateTo2 } from "@/lib/utils";

export type WithdrawalFlowState = {
  step: number;
  isLoading: boolean;
  errorMessage: string;
  selectedDerivAccount: DerivAccount | null;
  selectedBankAccount: BankAccount | null;
  withdrawalAmount: string;
  convertedAmount: string;
};

export type WithdrawalFlowAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SELECT_DERIV_ACCOUNT"; payload: DerivAccount }
  | { type: "SELECT_BANK_ACCOUNT"; payload: BankAccount }
  | {
      type: "UPDATE_AMOUNT";
      payload: { source: "withdraw" | "converted"; value: string };
    };

const initialState: WithdrawalFlowState = {
  step: 1,
  isLoading: false,
  errorMessage: "",
  selectedDerivAccount: null,
  selectedBankAccount: null,
  withdrawalAmount: "",
  convertedAmount: "",
};

export function useWithdrawalFlow(rateRes: ActionResponse<CurrencyConfig[]>) {
  const reducer = useCallback(
    (
      state: WithdrawalFlowState,
      action: WithdrawalFlowAction,
    ): WithdrawalFlowState => {
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
              state.selectedBankAccount?.accountNumber ===
                action.payload.accountNumber &&
              state.selectedBankAccount?.bankCode === action.payload.bankCode
                ? null
                : action.payload,
          };

        case "UPDATE_AMOUNT": {
          const { source, value } = action.payload;

          const clean = sanitizeTwoDecimals(value);

          const rate = state.selectedDerivAccount
            ? rateRes.data?.find(
                (ex) => ex.code === state.selectedDerivAccount?.currency,
              )
            : null;

          if (!rate || clean === "") {
            return { ...state, withdrawalAmount: "", convertedAmount: "" };
          }

          const withdrawalRate = rate.withdrawalRate;

          if (source === "withdraw") {
            return {
              ...state,
              withdrawalAmount: clean,
              convertedAmount: truncateTo2(
                Number.parseFloat(clean) / withdrawalRate,
              ),
            };
          }

          return {
            ...state,
            convertedAmount: clean,
            withdrawalAmount: truncateTo2(
              Number.parseFloat(clean) * withdrawalRate,
            ),
          };
        }

        default:
          return state;
      }
    },
    [rateRes],
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const setStep = useCallback(
    (step: number) => dispatch({ type: "SET_STEP", payload: step }),
    [],
  );
  const setLoading = useCallback(
    (v: boolean) => dispatch({ type: "SET_LOADING", payload: v }),
    [],
  );
  const setError = useCallback(
    (msg: string) => dispatch({ type: "SET_ERROR", payload: msg }),
    [],
  );

  const selectDerivAccount = useCallback(
    (acc: DerivAccount) =>
      dispatch({ type: "SELECT_DERIV_ACCOUNT", payload: acc }),
    [],
  );
  const selectBankAccount = useCallback(
    (acc: BankAccount) =>
      dispatch({ type: "SELECT_BANK_ACCOUNT", payload: acc }),
    [],
  );

  const handleWithdrawalAmountChange = useCallback(
    (v: string) =>
      dispatch({
        type: "UPDATE_AMOUNT",
        payload: { source: "withdraw", value: v },
      }),
    [],
  );

  const handleConvertedAmountChange = useCallback(
    (v: string) =>
      dispatch({
        type: "UPDATE_AMOUNT",
        payload: { source: "converted", value: v },
      }),
    [],
  );

  return {
    state,
    setStep,
    setLoading,
    setError,
    selectDerivAccount,
    selectBankAccount,
    handleWithdrawalAmountChange,
    handleConvertedAmountChange,
    dispatch,
  } as const;
}
