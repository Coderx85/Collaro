import { db } from "../db/client";
import { workspacesTable } from "../db/schema/schema";
import { auth } from "./auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function checkWorkspaceAccess(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const workspace = await db.query.workspacesTable.findFirst({
    where: eq(workspacesTable.slug, slug),
  });

  if (!workspace) {
    notFound();
  }

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const hasAccess = organizations?.find((org) => org.id === workspace.id);

  if (!hasAccess) {
    redirect("/forbidden");
  }

  return { workspace, session };
}
