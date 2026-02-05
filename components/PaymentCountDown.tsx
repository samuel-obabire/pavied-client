"use client";
import { useEffect, useRef, useState } from "react";

import { calculatePaymentExpiry } from "@/lib/utils";

type PaymentCountdownProps = {
  transactionDate: Date;
  limitMinutes: number;
  onExpire?: () => void;
};

export default function PaymentCountdown({
  transactionDate,
  limitMinutes,
  onExpire,
}: PaymentCountdownProps) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [remainingTimeText, setRemainingTimeText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateRemaining = () => {
      const { remainingMs: remaining, remainingText } = calculatePaymentExpiry(
        transactionDate,
        limitMinutes
      );

      if (remaining <= 0) {
        setRemainingTime(0);

        if (onExpire) onExpire();

        // Stop the interval when expired
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      setRemainingTime(remaining);
      setRemainingTimeText(remainingText);
    };

    updateRemaining();
    intervalRef.current = setInterval(updateRemaining, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [transactionDate, limitMinutes, onExpire]);

  if (remainingTime <= 0) {
    return <p className="font-medium text-red-500">Order Expired</p>;
  }

  return (
    <p className="font-medium text-green-600">Time left: {remainingTimeText}</p>
  );
}
