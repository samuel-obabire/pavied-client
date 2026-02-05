import * as Sentry from "@sentry/nextjs";
import { ENV } from "./lib/env";

export async function register() {
  if (ENV.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (ENV.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
