import { Suspense } from "react";
import { redirect } from "next/navigation";
import ConnectedDepositFlow from "@/components/deposit-flow/ConnectedDepositFlow";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivDepositPage = async () => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  return (
    <>
      <header>
        <h1 className="text-14-medium md:text-16-medium">
          Deposit to deriv account
        </h1>
      </header>

      <section className="space-y-1">
        <Suspense fallback={<FormSkeleton />}>
          <ConnectedDepositFlow userId={user.id} />
        </Suspense>
      </section>
    </>
  );
};

export default DerivDepositPage;
