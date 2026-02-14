/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import type { DecimalToNumber } from "@/lib/prisma-adapters/utils";
import {
  formatCustomDate,
  formatNairaAmount,
  getTransactionDetailsByType,
} from "@/lib/utils";
import type { Transaction } from "@/prisma/lib/generated/prisma/browser";
import StatusBadge from "./StatusBadge";

const TransactionCard = ({
  transaction,
}: {
  transaction: DecimalToNumber<Transaction>;
}) => {
  const { icon, label } = getTransactionDetailsByType(transaction);
  const router = useRouter();

  const handleClick = (txid: string) => {
    router.push(`${ROUTES.TRANSACTIONS}/${txid}`);
  };

  return (
    <div
      className="flex cursor-pointer items-center justify-between"
      onClick={() => handleClick(transaction.transactionId)}
    >
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={icon}
            alt="Transaction Icon"
            className="rounded-full"
            width={36}
            height={36}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-16-regular">{label}</div>
          <p className="text-12-regular">
            {formatCustomDate(transaction.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-16-medium">
          {formatNairaAmount(transaction.amount)}
        </span>
        <StatusBadge variant={transaction.status}>
          {transaction.status}
        </StatusBadge>
      </div>
    </div>
  );
};

export default TransactionCard;
