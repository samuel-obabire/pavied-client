import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

type PublishOptions = {
  url: string;
  body: Record<string, unknown>;
  delay?: number;
};

export const publishToQStash = async (options: PublishOptions) => {
  if (process.env.NODE_ENV === "development") return;

  const { url, body, delay = 0 } = options;

  return client.publishJSON({
    url,
    body,
    delay,
  });
};

export const scheduleOrderCancellation = async (
  transactionId: string,
  reason: string,
  delayInSeconds: number = 15 * 60,
) => {
  if (process.env.NODE_ENV === "development") return;

  return publishToQStash({
    url: `${process.env.NEXT_PUBLIC_URL}/api/cancel-order`,
    body: { transactionId, reason },
    delay: delayInSeconds,
  });
};

export const scheduleWithdrawalPayout = async (
  transactionId: string,
  delayInSeconds: number = 15 * 60,
) => {
  if (process.env.NODE_ENV === "development") return;

  return publishToQStash({
    url: `${process.env.NEXT_PUBLIC_URL}/api/withdrawal-payout`,
    body: { transactionId },
    delay: delayInSeconds,
  });
};
