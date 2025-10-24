export default function ExpiredPayment() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-semibold text-red-600">Payment Expired</h2>
      <p className="mt-2 text-gray-500">
        This payment window has closed. Please try again.
      </p>
    </div>
  );
}
