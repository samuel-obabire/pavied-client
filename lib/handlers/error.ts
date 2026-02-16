import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-errors";
import logger from "../logger";

export type ResponseType = "api" | "server";

const INTERNAL_SERVER_ERROR_MESSAGE = "An unexpected error occurred";

type PrismaErrorResponse = {
  status: number;
  message: string;
};

const getPrismaKnownErrorResponse = (
  error: PrismaClientKnownRequestError,
): PrismaErrorResponse => {
  switch (error.code) {
    case "P2001":
    case "P2025":
      return {
        status: 404,
        message: "The requested resource could not be found",
      };
    case "P2002":
      return {
        status: 409,
        message: "A record with the provided details already exists",
      };
    case "P2003":
      return {
        status: 400,
        message: "The operation violates a related resource constraint",
      };
    default:
      return {
        status: 500,
        message: "A database error occurred",
      };
  }
};

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`,
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`,
    );

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const prismaErrorResponse = getPrismaKnownErrorResponse(error);

    logger.error(
      {
        err: error,
        prisma: {
          code: error.code,
          clientVersion: error.clientVersion,
          meta: error.meta,
        },
      },
      `Prisma Known Request Error (${error.code})`,
    );

    return formatResponse(
      responseType,
      prismaErrorResponse.status,
      prismaErrorResponse.message,
    );
  }

  if (error instanceof PrismaClientValidationError) {
    logger.error({ err: error }, "Prisma Validation Error");

    return formatResponse(responseType, 400, "Invalid data provided");
  }

  if (error instanceof PrismaClientInitializationError) {
    logger.error({ err: error }, "Prisma Initialization Error");

    return formatResponse(responseType, 503, "Service temporarily unavailable");
  }

  if (error instanceof PrismaClientRustPanicError) {
    logger.error({ err: error }, "Prisma Engine Panic Error");

    return formatResponse(responseType, 500, INTERNAL_SERVER_ERROR_MESSAGE);
  }

  if (error instanceof Error) {
    logger.error({ err: error }, "Unhandled application error");

    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(responseType, 500, INTERNAL_SERVER_ERROR_MESSAGE);
};

export default handleError;
