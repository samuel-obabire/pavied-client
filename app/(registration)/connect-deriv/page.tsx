import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ConnectDeriv from "@/components/ConnectDeriv";
import DerivAccountSelectionList from "@/components/DerivAccountSelectionList";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";
import { parseSelectedDerivAccounts } from "@/lib/utils/deriv";

const ConnectDerivPage = async () => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id) redirect(ROUTES.HOME);

  const cookieStore = await cookies();

  const derivAccounts = cookieStore.get("deriv-accounts")?.value ?? "";
  const parsedAccounts = parseSelectedDerivAccounts(derivAccounts);

  return (
    <main className="flex-center container -mt-32 max-w-lg flex-col  space-y-14">
      {!parsedAccounts.length ? (
        <ConnectDeriv />
      ) : (
        <div className="w-full space-y-8">
          <div className="mt-6">Add deriv account</div>
          <section className="space-y-4">
            <DerivAccountSelectionList parsedAccounts={parsedAccounts} />
          </section>
        </div>
      )}
    </main>
  );
};

export default ConnectDerivPage;
