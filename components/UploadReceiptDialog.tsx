"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { uploadPaymentReciept } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import CustomButton from "./CustomButton";
import Dropzone from "./Dropzone";

const UploadReceiptDialog = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
    setErrorMessage("");
  }, []);

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paymentId", transactionId);

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await uploadPaymentReciept(formData);

      if (result.success) {
        router.push(ROUTES.PAYMENT(transactionId));
      } else {
        setErrorMessage(
          result.error?.message || "Failed to upload receipt. Please try again.",
        );
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[550px] rounded-2xl bg-white dark:bg-black-1 card-border p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
          <Upload className="size-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Upload Payment Receipt
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete your deposit by uploading proof of payment
          </p>
        </div>
      </div>

      <Dropzone handleFileChange={handleFileChange} />

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <CustomButton
        className="w-full btn-secondary"
        disabled={!file}
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        Submit Receipt
      </CustomButton>
    </div>
  );
};

export default UploadReceiptDialog;
