import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import {
  EMAIL_BODY_CLASS,
  EMAIL_CONTAINER_CLASS,
  EMAIL_FONT_FALLBACK,
  EMAIL_FONT_FAMILY,
  EMAIL_FONT_WEB,
  EMAIL_HEADING_CLASS,
  EMAIL_TAILWIND_CONFIG,
} from "@/components/ui/reactMail/styles";

interface PaviedPasswordResetVerificationProps {
  userFirstname?: string;
  resetLink?: string;
}

export const PaviedPasswordResetVerification = ({
  userFirstname,
  resetLink,
}: PaviedPasswordResetVerificationProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily={EMAIL_FONT_FAMILY}
          fallbackFontFamily={EMAIL_FONT_FALLBACK}
          webFont={EMAIL_FONT_WEB}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your Pavied account password</Preview>
      <Tailwind config={EMAIL_TAILWIND_CONFIG}>
        <Body className={EMAIL_BODY_CLASS}>
          <Container className={EMAIL_CONTAINER_CLASS}>
            <Section>
              <Text className="m-0 text-[12px] font-medium uppercase tracking-[0.08em] text-secondary">
                Pavied
              </Text>
              <Text className={EMAIL_HEADING_CLASS}>Reset your password</Text>
            </Section>

            <Section className="mt-6">
              <Text className="m-0 text-[16px] leading-[26px] text-ink">
                Hi {userFirstname},
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-ink">
                We received a request to reset your Pavied account password.
                Click the button below to continue.
              </Text>
            </Section>

            <Section className="mt-7 mb-7 text-center">
              <Button
                href={resetLink}
                className="rounded-lg bg-primary px-8 py-4 text-[15px] font-semibold text-white no-underline"
              >
                Reset password
              </Button>
            </Section>

            <Section>
              <Text className="m-0 text-[14px] leading-[24px] text-[#4b4b59]">
                If the button doesn&apos;t work, copy and paste this link in
                your browser:
              </Text>
              <Link
                href={resetLink}
                className="mt-2 inline-block break-all text-[14px] leading-[22px] text-primary underline"
              >
                {resetLink}
              </Link>
              <Text className="mt-6 mb-0 text-[14px] leading-[24px] text-[#4b4b59]">
                If you didn&apos;t request a password reset, you can safely
                ignore this email.
              </Text>
            </Section>

            <Section className="mt-8 border-t border-solid border-[#f1f2f6] pt-5">
              <Text className="m-0 text-[12px] leading-[20px] text-[#6b6b7a]">
                This reset link will expire in 15 minutes.
              </Text>
              <Text className="mt-2 mb-0 text-[12px] leading-[20px] text-[#6b6b7a]">
                © {new Date().getFullYear()} Pavied. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PaviedPasswordResetVerification.PreviewProps = {
  userFirstname: "Samuel",
  resetLink: "https://pavied.com/reset-password?token=example-token",
} as PaviedPasswordResetVerificationProps;

export default PaviedPasswordResetVerification;
