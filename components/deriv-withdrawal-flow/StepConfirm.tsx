import { withdrawalErrorFaqs } from "@/lib/constants/faqs";
import { DerivAccount, BankAccount } from "@/prisma/lib/generated/prisma/client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import BankAccountCard from "../BankAccountCard";
import CustomButton from "../CustomButton";
import DerivAccountCard from "../DerivAccountCard";
import DerivCurrencyIcon from "../DerivCurrencyIcon";
import type { WithdrawalFlowState } from "../hooks/useWithdrawalFlow";
import { Input } from "../ui/input";

const StepConfirm = ({
  state,
  onWithdrawChange,
  onConvertedChange,
  onSubmit,
  onBack,
}: {
  state: WithdrawalFlowState;
  onWithdrawChange: (v: string) => void;
  onConvertedChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const {
    selectedBankAccount,
    selectedDerivAccount,
    withdrawalAmount,
    convertedAmount,
    isLoading,
    errorMessage,
  } = state;

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p>From</p>
        <DerivAccountCard derivAccount={selectedDerivAccount as DerivAccount} />
      </div>

      <div>
        <p>To</p>
        <BankAccountCard
          bankAccount={selectedBankAccount as BankAccount}
          removeable={false}
        />
      </div>

      <div className="space-y-3">
        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <div className="text-14-medium flex shrink-0 items-center">
            <DerivCurrencyIcon
              currency={selectedDerivAccount?.currency as string}
            />{" "}
            &nbsp; |
          </div>
          <Input
            className="inputClass no-spinners"
            type="text"
            placeholder={`Enter ${selectedDerivAccount?.currency} amount`}
            value={convertedAmount}
            onChange={(e) => onConvertedChange(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(
                /[eE+-]/g,
                "",
              ))
            }
          />
        </div>

        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <div className="text-14-medium shrink-0 opacity-40">NGN &nbsp; |</div>
          <Input
            className="inputClass no-spinners"
            type="text"
            placeholder="Enter naira amount"
            value={withdrawalAmount}
            onChange={(e) => onWithdrawChange(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(
                /[eE+-]/g,
                "",
              ))
            }
          />
        </div>
      </div>

      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="mt-4 grid grid-cols-2 gap-4 items-center">
        <CustomButton
          type="button"
          disabled={isLoading}
          variant="outline"
          className="w-full"
          onClick={onBack}
        >
          Back
        </CustomButton>
        <CustomButton
          disabled={
            !selectedBankAccount || !selectedDerivAccount || !withdrawalAmount
          }
          className="btn-secondary w-full"
          onClick={onSubmit}
          isLoading={isLoading}
        >
          Continue to payment
        </CustomButton>

        
      </div>
      {errorMessage && (
          <div className="mt-6 w-full space-y-2">
            <h3 className="text-black-1_dark-white px-1">
              Frequently Asked Questions
            </h3>
            <div className="bg-white_dark-black-1 rounded-xl px-4">
              <Accordion type="single" collapsible className="w-full">
                {withdrawalErrorFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="card-border border-b border-0 last:border-0"
                  >
                    <AccordionTrigger className="text-black-1_dark-white hover:no-underline py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-14-regular text-gray-500 dark:text-gray-400 pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )}
    </div>
  );
};

export default StepConfirm;
