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
            href="http://localhost:3000/api/deriv-oauth?acct1=cr709393&token1=a1-f7pnteezo4jzhpxclctizt27hyeot&cur1=usd&acct2=vrtc1859315&token2=a1clwe3vfuuus5kraceykdsoqm4snfq&cur2=usd&acct3=CR12345&token3=a1-Yxh5gJS8m406Jopon5JlvKNRsxLMC&cur3=usdc&acct4=CR67890&token4=a1-yUqdjiIN0t6ICRc4eIMHDr1i6uKSV&cur4=tusdt&acct5=VRW1160&token5=a1-testtoken&cur5=usdc"
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
