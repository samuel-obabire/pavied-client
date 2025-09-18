import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

import { formatCustomDate, getTransactionDetailsByType } from "@/lib/utils";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const { icon, label } = getTransactionDetailsByType(transaction);

  return (
    <>
      <div className="bg-white_dark-black-1 flex justify-between">
        <div className="flex items-center gap-2">
          <div>
            <Image
              src={icon}
              alt="Transaction Icon"
              className="rounded-full"
              width={36}
              height={36}
            />
          </div>

          <div className="flex flex-col">
            <div className="text-16-regular">{label}</div>
            <p className="text-12-regular">
              {formatCustomDate(transaction.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* <span className="text-12-semibold">*****122</span> */}
          <span className="text-16-regular">{transaction.amount}</span>
        </div>
      </div>

      <Separator className="my-4 border border-gray-200 opacity-50" />
    </>
  );
};

export default TransactionCard;
