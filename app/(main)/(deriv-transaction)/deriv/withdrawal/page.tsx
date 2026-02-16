import { Suspense } from "react";
import { redirect } from "next/navigation";
import ConnectedWithdrawalFlow from "@/components/deriv-withdrawal-flow/ConnectedWithdrawalFlow";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivWithdrawalPage = async () => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  return (
    <>
      <header>
        <h1 className="text-14-medium md:text-16-medium">
          Withdraw from your deriv account
        </h1>
      </header>
      <section className="space-y-1 ">
        <Suspense fallback={<FormSkeleton />}>
          <ConnectedWithdrawalFlow userId={user.id} />
        </Suspense>
      </section>
    </>
  );
};

export default DerivWithdrawalPage;
