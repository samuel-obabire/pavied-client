"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { useOnInView } from "react-intersection-observer";
import { getUserTransactions } from "@/lib/actions/payment.action";
import Divider from "./Divider";
import TransactionCard from "./TransactionCard";

const options = {
  threshold: 0.1,
  triggerOnce: true,
};

const MobileTransactionList = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [updatedTransactions, setUpdatedTransactions] =
    useState<Transaction[]>(transactions);

  const [type] = useQueryState("type");
  const [status] = useQueryState("status");

  const session = useSession();

  const queryOptions = {
    type: type ?? undefined,
    status: status ?? undefined,
  };

  const trackingRef = useOnInView(async (inView) => {
    try {
      if (inView && transactions.length && session.status === "authenticated") {
        const { success, data } = await getUserTransactions(
          session.data?.user.id as string,
          {
            page: Math.ceil(transactions.length / 20) + 1,
            perPage: 20,
            ...queryOptions,
          },
        );

        if (success && data?.length)
          setUpdatedTransactions([...updatedTransactions, ...data]);
      }
    } catch (error) {
      console.error(error);
    }
  }, options);

  return (
    <div className="md:hidden">
      {updatedTransactions.map((transaction, index, currTx) => {
        const isLast = index === currTx.length - 1;

        return (
          <div
            key={transaction.transactionId}
            ref={isLast ? trackingRef : null}
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
