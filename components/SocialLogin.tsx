import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/auth";

import { Button } from "./ui/button";

const SocialLogin = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signIn("google");
        }}
      >
        <Button
          type="submit"
          className="cursor-pointer bg-white text-2xl shadow-sm"
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
