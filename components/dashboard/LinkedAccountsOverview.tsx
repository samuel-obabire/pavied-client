import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { Building2, Link as LinkIcon, Plus } from "lucide-react";

export const LinkedAccountsSkeleton = () => (
  <div className="flex-1 overflow-hidden p-5 border border-gray-100 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-black-2">
    <div className="bg-accent animate-pulse w-40 h-6 mb-4 rounded-md"></div>
    <div className="grid grid-cols-2 gap-4">
       <div className="bg-accent animate-pulse h-[100px] rounded-lg"></div>
       <div className="bg-accent animate-pulse h-[100px] rounded-lg"></div>
    </div>
  </div>
);

const LinkedAccountsOverview = async ({ userId }: { userId: string }) => {
  const [bankRes, derivRes] = await Promise.all([
    getUserBankAccounts(userId, { onlyActive: true }),
    getUserDerivAccounts(userId, { onlyActive: true })
  ]);

  const bankAccounts = bankRes.data || [];
  const derivAccounts = derivRes.data || [];

  return (
    <article className="flex-[1.5] overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-18-bold text-black-1 dark:text-white">Linked Accounts</h2>
        <Link 
          href={ROUTES.SETTINGS} 
          className="text-14-medium text-secondary transition-opacity hover:opacity-80"
        >
          Manage
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Bank Accounts Summary */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:bg-gray-50 dark:border-white/5 dark:bg-black-1/50 dark:hover:bg-black-1">
          <div className="mb-2 flex items-center gap-2 text-black-1 dark:text-white">
            <Building2 className="size-5 text-primary dark:text-gray-400" />
            <h3 className="text-16-medium">Bank Accounts</h3>
          </div>
          
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-24-bold text-black-1 dark:text-white">{bankAccounts.length}</p>
              <p className="text-12-regular text-gray-500">Active accounts</p>
            </div>
            {bankAccounts.length === 0 && (
              <Link 
                href={ROUTES.SETUP_BANK}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-12-medium text-primary transition-colors hover:bg-primary/20 dark:bg-secondary/10 dark:text-secondary dark:hover:bg-secondary/20"
              >
                <Plus className="size-3" /> Add Bank
              </Link>
            )}
          </div>
        </div>

        {/* Deriv Accounts Summary */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:bg-gray-50 dark:border-white/5 dark:bg-black-1/50 dark:hover:bg-black-1">
          <div className="mb-2 flex items-center gap-2 text-black-1 dark:text-white">
            <LinkIcon className="size-5 text-secondary dark:text-secondary" />
            <h3 className="text-16-medium">Deriv Accounts</h3>
          </div>
          
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-24-bold text-black-1 dark:text-white">{derivAccounts.length}</p>
              <p className="text-12-regular text-gray-500">Active accounts</p>
            </div>
            {derivAccounts.length === 0 && (
              <Link 
                href={ROUTES.SETUP_DERIV}
                className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-12-medium text-secondary transition-colors hover:bg-secondary/20"
              >
                <Plus className="size-3" /> Connect Deriv
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default LinkedAccountsOverview;
