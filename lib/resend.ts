import { Resend } from "resend";
import PaviedEmailVerification from "@/components/ui/reactMail/emailVerification";
import PaviedPasswordResetVerification from "@/components/ui/reactMail/passwordResetVerification";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (
  name: string,
  link: string,
  email: string,
) => {
  await resend.emails.send({
    from: "Pavied <no-reply@pavied.com>",
    to: email,
    subject: "Verify your email",
    react: PaviedEmailVerification({
      verificationLink: link,
      userFirstname: name,
    }),
  });
};

export const sendPasswordResetVerification = async (
  name: string,
  link: string,
  email: string,
) => {
  await resend.emails.send({
    from: "Pavied <no-reply@pavied.com>",
    to: email,
    subject: "Reset your password",
    react: PaviedPasswordResetVerification({
      resetLink: link,
      userFirstname: name,
    }),
  });
};
