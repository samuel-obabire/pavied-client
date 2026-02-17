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

interface PaviedEmailVerificationProps {
  userFirstname?: string;
  verificationLink?: string;
}

export const PaviedEmailVerification = ({
  userFirstname,
  verificationLink,
}: PaviedEmailVerificationProps) => {
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
      <Preview>Verify your email to secure your Pavied account</Preview>
      <Tailwind config={EMAIL_TAILWIND_CONFIG}>
        <Body className={EMAIL_BODY_CLASS}>
          <Container className={EMAIL_CONTAINER_CLASS}>
            <Section>
              <Text className="m-0 text-[12px] font-medium uppercase tracking-[0.08em] text-secondary">
                Pavied
              </Text>
              <Text className={EMAIL_HEADING_CLASS}>
                Confirm your email address
              </Text>
            </Section>

            <Section className="mt-6">
              <Text className="m-0 text-[16px] leading-[26px] text-ink">
                Hi {userFirstname},
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-ink">
                Thanks for joining Pavied. Please verify your email to activate
                your account and continue securely.
              </Text>
            </Section>

            <Section className="mt-7 mb-7 text-center">
              <Button
                href={verificationLink}
                className="rounded-lg bg-primary px-8 py-4 text-[15px] font-semibold text-white no-underline"
              >
                Verify email
              </Button>
            </Section>

            <Section>
              <Text className="m-0 text-[14px] leading-[24px] text-[#4b4b59]">
                If the button doesn&apos;t work, copy and paste this link in
                your browser:
              </Text>
              <Link
                href={verificationLink}
                className="mt-2 inline-block break-all text-[14px] leading-[22px] text-primary underline"
              >
                {verificationLink}
              </Link>
              <Text className="mt-6 mb-0 text-[14px] leading-[24px] text-[#4b4b59]">
                If you didn&apos;t create a Pavied account, you can safely
                ignore this email.
              </Text>
            </Section>

            <Section className="mt-8 border-t border-solid border-[#f1f2f6] pt-5">
              <Text className="m-0 text-[12px] leading-[20px] text-[#6b6b7a]">
                This verification link will expire in 15 minutes.
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

PaviedEmailVerification.PreviewProps = {
  userFirstname: "Samuel",
  verificationLink: "https://pavied.com/verify?token=example-token",
} as PaviedEmailVerificationProps;

export default PaviedEmailVerification;
