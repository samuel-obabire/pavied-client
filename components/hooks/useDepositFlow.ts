import { useCallback, useReducer } from "react";

import { sanitizeTwoDecimals, truncateTo2 } from "@/lib/utils";

export type DepositFlowState = {
step: number;
isLoading: boolean;
errorMessage: string;
selectedDerivAccount: DerivAccount | null;
selectedBankAccount: BankAccount | null;
depositAmount: string;
convertedAmount: string;
};

export type DepositFlowAction =
| { type: "SET_STEP"; payload: number }
| { type: "SET_LOADING"; payload: boolean }
| { type: "SET_ERROR"; payload: string }
| { type: "SELECT_DERIV_ACCOUNT"; payload: DerivAccount }
| { type: "SELECT_BANK_ACCOUNT"; payload: BankAccount }
| { type: "SET_DEPOSIT_AMOUNT"; payload: string }
| { type: "SET_CONVERTED_AMOUNT"; payload: string };

const initialState: DepositFlowState = {
step: 1,
isLoading: false,
errorMessage: "",
selectedDerivAccount: null,
selectedBankAccount: null,
depositAmount: "",
convertedAmount: "",
};

function reducer(state: DepositFlowState, action: DepositFlowAction): DepositFlowState {
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

export function useDepositFlow(rateRes: ActionResponse<CurrencyConfig[]>) {
const [state, dispatch] = useReducer(reducer, initialState);

const setStep = useCallback((step: number) => dispatch({ type: "SET_STEP", payload: step }), []);
const setLoading = useCallback((v: boolean) => dispatch({ type: "SET_LOADING", payload: v }), []);
const setError = useCallback((msg: string) => dispatch({ type: "SET_ERROR", payload: msg }), []);

const selectDerivAccount = useCallback((acc: DerivAccount) => dispatch({ type: "SELECT_DERIV_ACCOUNT", payload: acc }), []);
const selectBankAccount = useCallback((acc: BankAccount) => dispatch({ type: "SELECT_BANK_ACCOUNT", payload: acc }), []);

const handleDepositAmountChange = useCallback((rawValue: string) => {
const raw = sanitizeTwoDecimals(rawValue);
dispatch({ type: "SET_DEPOSIT_AMOUNT", payload: raw });

const rate = rateRes.data?.find((ex) => ex.code === (state.selectedDerivAccount?.currency));
if (!rate || raw === "") {
dispatch({ type: "SET_CONVERTED_AMOUNT", payload: "" });
return;
}

const converted = truncateTo2(parseFloat(raw) / rate.depositRate);
dispatch({ type: "SET_CONVERTED_AMOUNT", payload: converted });
}, [rateRes, state.selectedDerivAccount]);

const handleConvertedAmountChange = useCallback((rawValue: string) => {
const raw = sanitizeTwoDecimals(rawValue);
dispatch({ type: "SET_CONVERTED_AMOUNT", payload: raw });

const rate = rateRes.data?.find((ex) => ex.code === (state.selectedDerivAccount?.currency));
if (!rate || raw === "") {
dispatch({ type: "SET_DEPOSIT_AMOUNT", payload: "" });
return;
}

const converted = truncateTo2(parseFloat(raw) * rate.depositRate);
dispatch({ type: "SET_DEPOSIT_AMOUNT", payload: converted });
}, [rateRes, state.selectedDerivAccount]);

return {
state,
setStep,
setLoading,
setError,
selectDerivAccount,
selectBankAccount,
handleDepositAmountChange,
handleConvertedAmountChange,
dispatch,
} as const;
}
