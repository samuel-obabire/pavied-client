import { Client } from "@upstash/qstash";
import { ENV } from "../env";

const client = new Client({ token: ENV.QSTASH_TOKEN });

type PublishOptions = {
  url: string;
  body: Record<string, unknown>;
  delay?: number;
};

export const publishToQStash = async (options: PublishOptions) => {
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
  return publishToQStash({
    url: `${ENV.NEXT_PUBLIC_URL}/api/cancel-order`,
    body: { transactionId, reason },
    delay: delayInSeconds,
  });
};
