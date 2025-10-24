export default function ProcessingPayment() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-semibold text-yellow-600">
        Processing Payment
      </h2>
      <p className="mt-2 text-gray-500">
        Your payment is being verified. Please wait...
      </p>
    </div>
  );
}
