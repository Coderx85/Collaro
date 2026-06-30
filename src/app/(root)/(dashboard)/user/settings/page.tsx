import { headers } from "next/headers";
import { UserCog } from "lucide-react";
import { auth } from "@/lib/auth/auth-server";
import { getCurrentUser } from "@/lib/dal";
import { UserSettingsClient } from "./_components";
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateUserForm } from "@/components/form/update-user-form";
import { IconUserCircle } from "@tabler/icons-react";

type TOrgRole = "owner" | "admin" | "member";

type TSettingsOrganization = {
	id: string;
	name: string;
	slug: string;
	role: TOrgRole;
};

export default async function UserSettingsPage() {
	const user = await getCurrentUser();
	const requestHeaders = await headers();

	const organizations = await auth.api
		.listOrganizations({
			headers: requestHeaders,
		})
		.catch(() => []);

	const organizationsWithRoles: TSettingsOrganization[] = await Promise.all(
		organizations.map(async (organization) => {
			const orgWithMembers = await auth.api
				.getFullOrganization({
					headers: requestHeaders,
					query: {
						organizationId: organization.id,
					},
				})
				.catch(() => null);

			const currentUserMember = orgWithMembers?.members.find(
				(member) => member.userId === String(user.id),
			);

			const normalizedRole =
				currentUserMember?.role === "owner" ||
				currentUserMember?.role === "admin" ||
				currentUserMember?.role === "member"
					? currentUserMember.role
					: "member";

			return {
				id: organization.id,
				name: organization.name,
				slug: organization.slug,
				role: normalizedRole,
			};
		}),
	);

	return (
		<div className="relative min-h-dvh overflow-hidden p-6 md:p-8">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -top-32 right-[-6rem] h-80 w-80 rounded-full bg-primary/8 blur-[140px]" />
				<div className="absolute bottom-[-8rem] left-[-3rem] h-72 w-72 rounded-full bg-secondary/10 blur-[120px]" />
			</div>

			<div className="mx-auto w-full max-w-5xl space-y-8">
				<section className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm md:p-8">
					<div className="flex items-start gap-4">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<UserCog className="size-5" />
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
								User Settings
							</h1>
							<p className="text-sm text-muted-foreground">
								Update your profile and manage your organizations from one place.
							</p>
						</div>
					</div>
				</section>

				<div className="space-y-8">
					<Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-xl">
								<IconUserCircle className="size-5" />
								User Settings.
							</CardTitle>
							<CardDescription>
								Edit your account details.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<UpdateUserForm user={{
								...user,
								userName: user.userName!,
							}} />
						</CardContent>
					</Card>
				</div>

				{/* 
					<UserSettingsClient
						user={{
							id: user.id,
							name: user.name,
							email: user.email,
							userName: user.userName!,
							createdAt: new Date(user.createdAt),
							updatedAt: new Date(user.updatedAt),
						}}
						workspaces={organizationsWithRoles}
					/> 
				*/}

			</div>
		</div>
	);
}
