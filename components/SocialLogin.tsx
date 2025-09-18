import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/auth";
import { ROUTES } from "@/lib/constants/routes";

import { Button } from "./ui/button";

const SocialLogin = () => {
  // Todo - Redirect to callBackUrl

  return (
    <>
      <form
        action={async () => {
          "use server";

          await signIn("google", { redirectTo: ROUTES.ONBOARD_BIO });
        }}
      >
        <Button
          type="submit"
          className="bg-white_dark-black-1 cursor-pointer text-2xl shadow-sm"
          variant="ghost"
          size="lg"
        >
          <FcGoogle className="!size-6" />
          <span className="text-16-bold">Continue with Google</span>
        </Button>
      </form>
    </>
  );
};

export default SocialLogin;
