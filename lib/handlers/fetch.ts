import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

export const fetchHandler = async <T>(
  url: string,
  options?: RequestInit
): Promise<ActionResponse<T>> => {
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    let body = null;
    try {
      body = await response.json();
    } catch {
      // Response had no JSON
    }

    if (!response.ok) {
      const message =
        body?.error?.message ||
        body?.message ||
        `Request failed with status ${response.status}`;

      throw new RequestError(response.status, message);
    }

    return body as SuccessResponse<T>;
  } catch (error) {
    logger.error(error);

    // Ensure consistent typed error return
    return handleError(error) as ErrorResponse;
  }
};
