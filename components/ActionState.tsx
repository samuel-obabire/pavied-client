"use client";

import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ActionStateType = "idle" | "pending" | "success" | "error";

export type ActionStatusProps = {
  state: ActionStateType;
  pendingTitle: string;
  successTitle?: string;
  successMessage?: ReactNode;
  errorMessage?: string;
  retryAction?: () => void;
};

const ActionState = ({
  state,
  pendingTitle,
  successTitle,
  errorMessage = "Action has failed due to incorrect data or unstable network connection.",
  successMessage,
  retryAction,
}: ActionStatusProps) => {
  const [open, setOpen] = useState(false);

  // Open the dialog automatically when state is not idle
  useEffect(() => {
    if (state !== "idle") {
      setOpen(true);
    }

    return () => setOpen(false);
  }, [state]);

  const RenderActionState = () => {
    switch (state) {
      case "idle":
        return null;
      case "pending":
        return <ActionPending pendingTitle={pendingTitle} />;
      case "success":
        return (
          <ActionSuccess
            successTitle={successTitle}
            successMessage={successMessage}
          />
        );
      case "error":
        return (
          <ActionError retryAction={retryAction} errorMessage={errorMessage} />
        );

      default: {
        const exhaustiveCheck: never = state;
        return exhaustiveCheck;
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white_dark-black-1 !max-w-[432px] border-0 shadow-sm outline-0">
        <RenderActionState />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionState;

const ActionPending = ({
  pendingTitle,
}: {
  pendingTitle: ActionStatusProps["pendingTitle"];
}) => {
  return (
    <div className="flex flex-col gap-3">
      <AlertDialogTitle className="text-16-bold text-center">
        {pendingTitle}
      </AlertDialogTitle>
      <AlertDialogDescription className="text-14-medium text-center">
        This will only take a few seconds
      </AlertDialogDescription>

      <div className="flex-center flex p-4">
        <Image
          className="animate-spin"
          src="/assets/spinner.svg"
          alt="spinner"
          height={36}
          width={36}
        />
      </div>
    </div>
  );
};

const ActionSuccess = ({
  successMessage,
  successTitle,
}: Pick<ActionStatusProps, "successMessage" | "successTitle">) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex-center flex p-4">
        <Image
          src="/assets/check-circle.svg"
          alt="check-circle"
          height={36}
          width={36}
        />
      </div>

      <AlertDialogTitle className="text-16-bold text-center">
        {successTitle || "Action Success"}
      </AlertDialogTitle>

      {successMessage || (
        <AlertDialogFooter className="mx-auto flex w-[70%] flex-row !justify-around">
          <AlertDialogCancel className="btn-outline">Close</AlertDialogCancel>
        </AlertDialogFooter>
      )}
    </div>
  );
};

const ActionError = ({
  errorMessage,
  retryAction,
}: Pick<ActionStatusProps, "errorMessage" | "retryAction">) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex-center flex p-4">
        <Image
          src="/assets/caution.svg"
          alt="action-failed"
          height={36}
          width={36}
        />
      </div>

      <AlertDialogTitle className="text-16-bold text-center">
        Action Error
      </AlertDialogTitle>

      <p className="text-center">{errorMessage}</p>

      <AlertDialogFooter className="mx-auto flex w-[70%] flex-row items-baseline !justify-around">
        <AlertDialogCancel className="btn-outline">Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="btn-secondary"
          onClick={() => {
            if (retryAction) {
              retryAction();
            }
          }}
        >
          Retry
        </AlertDialogAction>
      </AlertDialogFooter>
    </div>
  );
};
