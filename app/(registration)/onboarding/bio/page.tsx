import BioRegister from "@/components/forms/BioResgister";
import { verifySession } from "@/lib/server";

const BioRegistrationPage = async () => {
  const session = await verifySession();

  return (
    <main className="container max-w-lg space-y-6 pt-8">
      <header className="space-y-5">
        <h1 className="text-28-bold text-primary dark:text-white">
          Register <span className="text-secondary">account</span>
        </h1>
        <p>
          Please ensure you provide your legal name as it appears on your
          government issued ID
        </p>
      </header>

      <section>
        <BioRegister defaultName={session?.user?.name} />
      </section>
    </main>
  );
};

export default BioRegistrationPage;
