import { useState } from "react";

export default function MockRazorpayModal({ amount, onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);

    // simulate Razorpay processing delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6 animate-scaleIn">
        <h2 className="text-2xl font-bold text-center mb-4">
          Razorpay Checkout (Mock)
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Pay <b>₹{amount}</b> to Pizza App
        </p>

        {processing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-3"></div>
            <p className="text-green-600 font-semibold">
              Processing Payment...
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handlePay}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Pay ₹{amount}
            </button>

            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
