import { XCircleIcon } from "lucide-react";

export default function FailedPayment() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <XCircleIcon className="mb-4 h-16 w-16 text-red-500" />
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">
        Payment Failed
      </h2>
      <p className="max-w-md text-gray-600">
        Your payment could not be processed successfully. If funds were
        deducted, please contact support with your transaction details for
        assistance.
      </p>
    </div>
  );
}
