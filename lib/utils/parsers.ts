import { parseAsIndex, parseAsInteger } from "nuqs";

export const paginationParsers = {
  pageIndex: parseAsIndex.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
