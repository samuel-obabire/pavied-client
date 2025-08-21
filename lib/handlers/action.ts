import zod, { ZodError, ZodType } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";

type ActionProps<T> = {
  params: T;
  schema: ZodType<T>;
  authorise?: boolean;
};
const action = async <T>({
  params,
  schema,
  authorise = false,
}: ActionProps<T>) => {
  let parsedResult: zod.infer<typeof schema>;

  if (params && schema) {
    try {
      parsedResult = schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(error.flatten().fieldErrors);
      }

      return new Error("Schema validation failed");
    }
  } else {
    return new Error("Schema validation failed");
  }

  const session = await auth();

  if (authorise && !session?.user) {
    return new UnauthorizedError(
      "Your are not authorized to perform this operation"
    );
  }

  return { params: parsedResult, session };
};

export default action;
