import "server-only";

import crypto from "crypto";

import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, "utf8");

export const encryptToken = (token: string) => {
  const iv = crypto.randomBytes(12); // AES-GCM needs 12 byte IV
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Return base64(iv + encrypted + tag)
  return Buffer.concat([iv, encrypted, authTag]).toString("base64");
};

export const decryptToken = (encryptedToken: string) => {
  const data = Buffer.from(encryptedToken, "base64");

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(data.length - 16);
  const encrypted = data.subarray(12, data.length - 16);

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

export const encryptDerivAccounts = (accounts: DerivAccountLink[]) => {
  return accounts.map((acc) => ({
    ...acc,
    token: encryptToken(acc.token),
  }));
};
