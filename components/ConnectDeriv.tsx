import Image from "next/image";
import InfoCard from "./InfoCard";
import { Button } from "./ui/button";

const ConnectDeriv = () => {
  return (
    <>
      <div className="flex-center flex">
        <Image
          src="/assets/wavyTech.png"
          alt="Add account"
          height={182}
          width={182}
        />
      </div>
      <div className="w-full space-y-8">
        <div className="mt-6">Connect your deriv account</div>

        <section className="space-y-4">
          <a
            href="https://oauth.deriv.com/oauth2/authorize?app_id=107466"
            rel="noreferrer"
            target="_blank"
            className="block"
          >
            <Button className="btn-secondary w-full">
              Connect deriv account
            </Button>
          </a>

          <InfoCard
            message="Please note: Our platform currently only supports the following deriv account
           currencies: USD, tUSDT, USDC, and eUSDT."
          />
        </section>
      </div>
    </>
  );
};

export default ConnectDeriv;
