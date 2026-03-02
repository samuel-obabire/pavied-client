import { sendTelegramMessage } from "@/lib/telegram";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	// Parse URL params securely and predictably
	const chatId = request.nextUrl.searchParams.get("chatId");

	if (!chatId) {
		return NextResponse.json(
			{ error: "Provide a ?chatId=YOUR_ID parameter." },
			{ status: 400 },
		);
	}

	try {
		await sendTelegramMessage(
			chatId,
			"*Test Message*\nIf you received this, your Next.js grammY integration is working perfectly!",
			{ parseMode: "Markdown" },
		);

		return NextResponse.json({
			success: true,
			message: `Message successfully sent to Chat ID: ${chatId}`,
		});
	} catch (error) {
		console.error("Test telegram error:", error);
		return NextResponse.json(
			{
				error: "Failed to send message.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
