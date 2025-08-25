import BrandName from "@/components/BrandName";
import AccountRegister from "@/components/forms/AccountRegister";

const Register = () => {
  return (
    <main className="container max-w-lg space-y-6  pt-8">
      <header className="space-y-5">
        <div className="mb-8 text-center">
          <BrandName />
        </div>

        <h1 className="text-28-bold text-primary">
          Register <span className="text-secondary">account</span>
        </h1>
        <p>
          Please ensure you provide your legal name as it appears on your
          government issued ID
        </p>
      </header>

      <section>
        <AccountRegister />
      </section>
    </main>
  );
};

export default Register;
