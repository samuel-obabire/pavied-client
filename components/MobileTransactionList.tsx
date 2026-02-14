"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { useOnInView } from "react-intersection-observer";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { useSession } from "@/lib/auth-client";
import { PER_PAGE } from "@/lib/constants";
import Divider from "./Divider";
import TransactionCard from "./TransactionCard";

const options = {
  threshold: 0.1,
  triggerOnce: true,
};

const MobileTransactionList = ({
  transactions,
  infiniteScrollEnabled = true,
}: {
  transactions: Transaction[];
  infiniteScrollEnabled?: boolean;
}) => {
  const [updatedTransactions, setUpdatedTransactions] =
    useState<Transaction[]>(transactions);

  const [type] = useQueryState("type");
  const [status] = useQueryState("status");

  const { data: session } = useSession();

  const queryOptions = {
    type: type ?? undefined,
    status: status ?? undefined,
  };

  useEffect(() => {
    setUpdatedTransactions(transactions);
  }, [transactions]);

  const trackingRef = useOnInView(async (inView) => {
    if (!inView) return;

    try {
      if (updatedTransactions.length && session?.user?.id) {
        const { success, data } = await getUserTransactions(
          session.user.id as string,
          {
            page: Math.ceil(updatedTransactions.length / PER_PAGE) + 1,
            perPage: PER_PAGE,
            ...queryOptions,
          },
        );

        if (success && data?.length) {
          setUpdatedTransactions((prevTrx) => [...prevTrx, ...data]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, options);

  return (
    <div className="md:hidden">
      {updatedTransactions.map((transaction, index, currTx) => {
        const isLast = index === currTx.length - 1;

        return (
          <div
            key={`mobile-${transaction.transactionId}`}
            ref={infiniteScrollEnabled && isLast ? trackingRef : null}
          >
            <TransactionCard transaction={transaction} />
            {!isLast && <Divider className="my-4" />}
          </div>
        );
      })}
    </div>
  );
};

export default MobileTransactionList;
