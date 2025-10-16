export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Transaction Not Found
      </h2>
      <p className="mt-2 text-gray-500">We couldn’t find this transaction.</p>
    </div>
  );
}
