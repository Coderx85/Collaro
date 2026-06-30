import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-server";
import { serializeNotification } from "@/lib/notification-utils";
import { UserStore } from "@/modules/user/user-store";
import type { TUserId } from "@/types";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const userStore = UserStore.getInstance();
		const notifications = await userStore.listNotifications(
			session.user.id as unknown as TUserId,
		);

		return NextResponse.json(
			{
				success: true,
				data: notifications.map(serializeNotification),
			},
			{
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch (error) {
		console.error("Failed to fetch notifications:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch notifications",
			},
			{ status: 500 },
		);
	}
}
