import zod, { ZodError, type ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { verifySession } from "../server";

type ActionProps<T> = {
  params: T;
  schema: ZodType<T>;
  authorise?: boolean;
};
const action = async <T>({
  params,
  schema,
  authorise = true, // must be authorised by default
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

  const session = await verifySession();

  if (authorise && !session?.user) {
    return new UnauthorizedError(
      "Your are not authorized to perform this operation",
    );
  }

  return { params: parsedResult, session };
};

export default action;
