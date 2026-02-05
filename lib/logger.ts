import pino from "pino";
import { ENV } from "./env";

const isEdge = ENV.NEXT_RUNTIME === "edge";
const isProduction = ENV.NODE_ENV === "production";

const logger = pino({
  level: ENV.LOG_LEVEL,
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
