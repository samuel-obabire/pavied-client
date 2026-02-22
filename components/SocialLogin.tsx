"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "./ui/button";

const SocialLogin = () => {
  const handleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: ROUTES.DASHBOARD,
      newUserCallbackURL: ROUTES.ONBOARD_BIO,
    });
  };

  return (
    <Button
      type="button"
      onClick={handleSignIn}
      variant="outline"
      size="lg"
      className="group w-full h-14 bg-white_dark-black-1 border-black-1/5 dark:border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300 shadow-xs cursor-pointer"
    >
      <div className="flex items-center justify-center gap-3">
        <FcGoogle className="size-6 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-16-bold group-hover:text-secondary transition-colors">
          Continue with Google
        </span>
      </div>
    </Button>
  );
};

export default SocialLogin;
