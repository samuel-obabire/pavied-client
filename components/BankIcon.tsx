import Image from "next/image";
import { nigeriaBanks } from "@/lib/constants/nigerianBanks";

const BankIcon = ({ bankCode }: { bankCode: string }) => {
  const { icon } = nigeriaBanks.find(({ code }) => bankCode === code)!;

  return (
    <div className="relative size-6 rounded-md overflow-hidden">
      <Image src={icon} fill alt="bank" />
    </div>
  );
};

export default BankIcon;
