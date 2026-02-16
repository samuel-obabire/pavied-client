"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addDerivAccounts } from "@/lib/actions/deriv.action";
import { useSession } from "@/lib/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { OnboardingStep } from "@/prisma/lib/generated/prisma/enums";
import ActionState, { type ActionStatusProps } from "./ActionState";
import CustomButton from "./CustomButton";
import DerivCurrencyIcon from "./DerivCurrencyIcon";
import SaveStepFooter from "./SaveOnboardingStep";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type DerivAccountLink = {
  accountId: string;
  currency: string;
  token: string;
};

const DerivAccountSelectionList = ({
  parsedAccounts,
}: {
  parsedAccounts: DerivAccountLink[];
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<DerivAccountLink[]>(
    [],
  );
  const [actionState, setActionState] =
    useState<ActionStatusProps["state"]>("idle");

  const { data: session } = useSession();

  const router = useRouter();

  const handleAccountSelection = (
    account: DerivAccountLink,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedAccounts((prev) => [...prev, account]);
    } else {
      setSelectedAccounts((prev) =>
        prev.filter((a) => a.accountId !== account.accountId),
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setActionState("pending");

      const response = await addDerivAccounts(selectedAccounts);

      if (response.success) {
        setActionState("success");
      } else {
        setActionState("error");
      }
    } catch (error) {
      setActionState("error");
      console.error(error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <ActionState
          pendingTitle="Adding Accounts"
          state={actionState}
          errorMessage="error"
          successTitle="Account(s) Under Review"
          successMessage={
            <>
              <p className="text-center">
                Your account submitted deriv account is currently under review,
                It will be ready for transaction once we have verified it
              </p>

              {session?.user?.onboardingStep !== OnboardingStep.COMPLETE ? (
                <SaveStepFooter
                  label="Continue to Next Step"
                  onboardingStep="BANK"
                  nextRoute="ONBOARD_BANK"
                  buttonClass="btn-secondary"
                />
              ) : (
                <Button
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                  className="btn-secondary"
                >
                  Continue to dashboard
                </Button>
              )}
            </>
          }
        />
        {parsedAccounts.map((account, index) => {
          const checkboxId = `account-${account.accountId}`;

          return (
            <React.Fragment key={account.accountId}>
              <div className="mb-1">Account {index + 1}</div>
              <div className="bg-white_dark-black-1 inputClass flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <DerivCurrencyIcon currency={account.currency} />
                  <span>|</span>
                  <span>{account.currency}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor={checkboxId}>{account.accountId}</Label>
                  <Checkbox
                    id={checkboxId}
                    onCheckedChange={(checked) => {
                      handleAccountSelection(account, Boolean(checked));
                    }}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <CustomButton
        className={cn("btn-secondary w-full", {
          "opacity-50": !selectedAccounts.length,
        })}
        disabled={!selectedAccounts.length || actionState === "pending"}
        onClick={handleSubmit}
        isLoading={actionState === "pending"}
      >
        Confirm
      </CustomButton>
    </>
  );
};

export default DerivAccountSelectionList;
