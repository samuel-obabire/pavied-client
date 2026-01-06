import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/auth";
import { ROUTES } from "@/lib/constants/routes";

import { Button } from "./ui/button";

const SocialLogin = () => {
  return (
    <form
      className="w-full max-w-sm"
      action={async () => {
        "use server";

        await signIn("google", { redirectTo: ROUTES.ONBOARD_BIO });
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="lg"
        className="group w-full h-14 bg-white_dark-black-1 border-black-1/5 dark:border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300 shadow-xs cursor-pointer"
      >
        <div className="flex items-center justify-center gap-3">
          <FcGoogle className="size-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-16-bold group-hover:text-secondary transition-colors">Continue with Google</span>
        </div>
      </Button>
    </form>
  );
};

export default SocialLogin;
