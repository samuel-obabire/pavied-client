import { sendTelegramMessage } from "./telegram.config";

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!CHAT_ID) {
  throw new Error("Chat id not set");
}

export const notifyAdmin = async (message: string) => {
  if (!message) return;

  await sendTelegramMessage(CHAT_ID, message, { parseMode: "Markdown" });
};
