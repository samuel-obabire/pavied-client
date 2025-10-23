"use client";
import { useQueryState } from "nuqs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  transactionStatusTypes,
  transactionTypes,
} from "@/lib/constants/transaction";

import DateFilter from "../DateFilter";

const TransactionTableFilter = () => {
  const [transactionType, setTransactionType] = useQueryState("type", {
    shallow: false,
    defaultValue: "",
  });

  const [transactionStatus, setTransactionStatus] = useQueryState("status", {
    shallow: false,
    defaultValue: "",
  });

  // Todo: Open modal for DateFilter

  return (
    <div className="mb-2 gap-2 space-y-2 xl:flex">
      <div className="flex gap-2">
        <Select
          onValueChange={(val) => {
            setTransactionType(val === "all" ? "" : val);
          }}
          value={transactionType}
        >
          <SelectTrigger className="select no-ring !h-[44px] w-[180px]  max-md:max-w-[165px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent className="bg-white_dark-black-1">
            <SelectItem className="select-item" value="all">
              All
            </SelectItem>

            {Object.values(transactionTypes).map((type) => (
              <SelectItem
                className="select-item capitalize"
                key={type}
                value={type}
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) => {
            setTransactionStatus(val === "all" ? "" : val);
          }}
          value={transactionStatus}
        >
          <SelectTrigger className="no-ring select !h-[44px]  w-[180px] max-md:max-w-[165px]">
            <SelectValue className="" placeholder="Transaction Status" />
          </SelectTrigger>
          <SelectContent className="bg-white_dark-black-1">
            <SelectItem className="select-item" value="all">
              All
            </SelectItem>

            {transactionStatusTypes.map((status) => (
              <SelectItem
                className="select-item capitalize"
                key={status}
                value={status}
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <DateFilter />
      </div>
    </div>
  );
};

export default TransactionTableFilter;
