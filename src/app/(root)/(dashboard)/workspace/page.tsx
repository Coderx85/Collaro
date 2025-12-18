import { redirect, RedirectType } from "next/navigation";
import WorkspaceForm from "./components/WorkspaceForm";
import { currentUser } from "@clerk/nextjs/server";
import { usersTable } from "@/db/schema/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";

async function fetchUserWorkspace(userId: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, userId))
    .execute();

  return user?.workspaceId || null;
}

const WorkspacePage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const workspaceId = await fetchUserWorkspace(user.id);

  if (workspaceId) {
    redirect(`/workspace/${workspaceId}`, RedirectType.replace);
  }

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center rounded-sm">
      <WorkspaceForm />
    </div>
  );
};

export default WorkspacePage;
