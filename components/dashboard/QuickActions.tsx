import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { ArrowDownToLine, ArrowUpToLine, Building2, Link as LinkIcon } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Deposit",
      description: "Fund your Deriv account",
      icon: <ArrowDownToLine className="size-6 text-white" />,
      link: ROUTES.DERIV.DEPOSIT,
      colorClass: "bg-success",
    },
    {
      title: "Withdraw",
      description: "Withdraw to your bank",
      icon: <ArrowUpToLine className="size-6 text-white" />,
      link: ROUTES.DERIV.WITHDRAWAL,
      colorClass: "bg-failed",
    },
    {
      title: "Add Bank",
      description: "Link a bank account",
      icon: <Building2 className="size-6 text-white" />,
      link: ROUTES.SETUP_BANK,
      colorClass: "bg-primary",
    },
    {
      title: "Connect Deriv",
      description: "Link a Deriv account",
      icon: <LinkIcon className="size-6 text-black-2" />,
      link: ROUTES.SETUP_DERIV,
      colorClass: "bg-secondary",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-20-medium text-black-1 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.link}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-black-2 sm:p-6"
          >
            <div className={`mb-3 flex size-12 items-center justify-center rounded-full ${action.colorClass} shadow-md`}>
              {action.icon}
            </div>
            <h3 className="text-16-bold text-center text-black-1 dark:text-white">{action.title}</h3>
            <p className="mt-1 text-center text-12-regular text-gray-500 dark:text-gray-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
