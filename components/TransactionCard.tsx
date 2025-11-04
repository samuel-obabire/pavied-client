import Image from "next/image";
import {
  formatCustomDate,
  formatNairaAmount,
  getTransactionDetailsByType,
} from "@/lib/utils";
import Divider from "./Divider";
import StatusBadge from "./StatusBadge";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const { icon, label } = getTransactionDetailsByType(transaction);

  return (
    <>
      <div className="bg-white_dark-black-1 flex justify-between">
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

      <Divider className="mt-4" />
    </>
  );
};

export default TransactionCard;
