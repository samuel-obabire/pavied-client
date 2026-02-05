"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    processDerivWithdrawal,
    sendWithdrawEmail,
} from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import ActionState, { type ActionStateType } from "./ActionState";
import InputWithdrawalOTP from "./InputWithdrawalOTP";
import WithdrawalSuccess from "./WithdrawalSuccess";

const DerivWithdrawalVerification = ({
  transactionId,
  userId,
  accountId,
}: {
  transactionId: string;
  userId: string;
  accountId: string;
}) => {
  const [isWithdrawalSuccess, setIsWithdrawalSuccess] = useState(false);
  const [actionState, setActionState] = useState<ActionStateType>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;

    hasSent.current = true;
    (async () => {
      await sendWithdrawEmail({ userId, accountId });
    })();
  }, [userId, accountId]);

  const onSubmit = useCallback(
    async (data: { pin: string }) => {
      setActionState("pending");

      try {
        const response = await processDerivWithdrawal({
          transactionId,
          pin: data.pin,
        });

        if (response.success) {
          setIsWithdrawalSuccess(true);
          setActionState("success");
        } else {
          setActionState("error");
          setErrorMessage(response.error?.message || "");
        }
      } catch (error) {
        console.error(error);

        setActionState("error");
      }
    },
    [transactionId],
  );

  return (
    <div className="px-4">
      <ActionState
        pendingTitle="Processing payment"
        successTitle="Withdrawal Succesful"
        state={actionState}
        errorMessage={errorMessage}
        successMessage={
          actionState === "success" && (
            <div className="space-y-3">
              <p className="text-center">
                Your transaction is being processed. You will be credited in a
                bit.
              </p>
              <Link
                className="btn btn-secondary flex-center  flex h-4 text-center"
                href={ROUTES.TRANSACTIONS}
              >
                View Transaction
              </Link>
            </div>
          )
        }
      />

      {isWithdrawalSuccess ? (
        <WithdrawalSuccess />
      ) : (
        <InputWithdrawalOTP onInput={onSubmit} />
      )}
    </div>
  );
};

export default DerivWithdrawalVerification;
