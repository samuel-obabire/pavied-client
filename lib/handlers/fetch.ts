import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

export const fetchHandler = async <T>(
  url: string,
  options?: RequestInit
): Promise<ActionResponse<T>> => {
  const defaultHeaders = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const config = {
    ...defaultHeaders,
    ...options,
  };
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `Request failed with status ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    logger.error(error);
    return handleError(error) as ErrorResponse;
  }
};
