import { z } from "zod";

const envSchema = z.object({
  // Auth
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // API URLs (public)
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_API_BASE_URL must be a valid URL"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional(),
  NEXT_PUBLIC_URL: z.string().url("NEXT_PUBLIC_URL must be a valid URL"),

  // API
  SHARED_API_URL: z.string().url("SHARED_API_URL must be a valid URL"),
  SHARED_API_TOKEN_CLIENT: z
    .string()
    .min(1, "SHARED_API_TOKEN_CLIENT is required"),

  // Deriv
  DERIV_APP_ID: z.string().min(1, "DERIV_APP_ID is required"),

  // Encryption
  TOKEN_ENCRYPTION_KEY: z.string().min(1, "TOKEN_ENCRYPTION_KEY is required"),

  // Firebase
  FIREBASE_SERVICE_ACCOUNT: z
    .string()
    .min(1, "FIREBASE_SERVICE_ACCOUNT is required"),

  // QStash
  QSTASH_TOKEN: z.string().min(1, "QSTASH_TOKEN is required"),
  QSTASH_URL: z.string().url("QSTASH_URL must be a valid URL"),
  QSTASH_CURRENT_SIGNING_KEY: z
    .string()
    .min(1, "QSTASH_CURRENT_SIGNING_KEY is required"),
  QSTASH_NEXT_SIGNING_KEY: z
    .string()
    .min(1, "QSTASH_NEXT_SIGNING_KEY is required"),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url("UPSTASH_REDIS_REST_URL must be a valid URL"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, "UPSTASH_REDIS_REST_TOKEN is required"),

  // Sentry
  SENTRY_AUTH_TOKEN: z.string().min(1, "SENTRY_AUTH_TOKEN is required"),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Runtime (optional - added by Next.js)
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),

  // CI flag (optional)
  CI: z.string().optional(),

  // Log level (optional)
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .optional()
    .default("info"),
});

type Env = z.infer<typeof envSchema>;

// Validate environment variables at startup
const validateEnv = (): Env => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    });
    throw new Error("Invalid environment variables. Application cannot start.");
  }

  console.log("✅ Environment variables validated successfully");
  return result.data;
};

export const ENV = validateEnv();
