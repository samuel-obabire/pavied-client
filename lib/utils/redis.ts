import { Redis } from "@upstash/redis";
import { ENV } from "../env";

const UPSTASH_REDIS_REST_URL = ENV.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = ENV.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_TOKEN || !UPSTASH_REDIS_REST_URL)
  throw new Error("Redis env missing");

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});
