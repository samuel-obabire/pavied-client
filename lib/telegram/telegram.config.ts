import "server-only";
import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");

const bot = new Bot(token, {
	client: {
		// Prevents Next.js fetch instrumentation from aggressive caching leading to "Network request failed!"
		baseFetchConfig: {
			cache: "no-store",
		},
	},
});

type SendTelegramMessageOptions = {
	parseMode?: "HTML" | "Markdown" | "MarkdownV2";
};

export async function sendTelegramMessage(
	chatId: string | number,
	text: string,
	options?: SendTelegramMessageOptions,
) {
	try {
		return await bot.api.sendMessage(chatId, text, {
			parse_mode: options?.parseMode,
		});
	} catch (error: any) {
		const innerError = error?.error?.message || error?.cause || "";
		throw new Error(
			`Failed to send Telegram message to ${chatId}: ${error instanceof Error ? error.message : String(error)}${innerError ? `. Inner: ${innerError}` : ""}`
		);
	}
}
