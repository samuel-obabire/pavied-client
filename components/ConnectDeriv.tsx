import Image from "next/image";

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

        <section>
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
        </section>
      </div>
    </>
  );
};

export default ConnectDeriv;
