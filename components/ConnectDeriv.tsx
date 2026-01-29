import Image from "next/image";
import InfoCard from "./InfoCard";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <h3 className="text-20-bold text-black-1_dark-white text-center md:text-left">
            Connect Deriv Account
          </h3>
          <p className="text-14-regular text-gray-500 text-center md:text-left">
            Link your Deriv trading account to enable seamless deposits and withdrawals.
          </p>
        </div>

        <section className="space-y-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-secondary w-full h-12 text-16-bold shadow-sm hover:shadow-md transition-all">
                Connect Deriv Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white_dark-black-1 card-border text-black-1_dark-white">
              <DialogHeader>
                <DialogTitle>Connect Deriv Account</DialogTitle>
                <DialogDescription>
                  You are about to be redirected to Deriv to authorize this application. Do you want to
                  proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row justify-center gap-2 items-center">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button asChild className="btn-secondary">
                  <a
                    href="https://oauth.deriv.com/oauth2/authorize?app_id=107466"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Proceed
                  </a>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
            </div>
          </div>

          <InfoCard
            message="Please note: Our platform currently only supports the following Deriv account
           currencies: USD, tUSDT, USDC, and eUSDT."
          />
        </section>
      </div>
    </>
  );
};

export default ConnectDeriv;
