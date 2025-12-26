import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const WorkspacePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const org = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (org.length === 0) {
    return (
      <div className="mx-auto flex h-full flex-col py-15 items-center justify-center rounded-sm">
        <h1 className="text-3xl font-bold">Your Workspace</h1>
        <Link
          href="/workspace/new"
          className="mt-5 bg-accent hover:opacity-60 dark:text-accent dark:bg-white/75 py-3 px-2.5 rounded-xl"
        >
          Create Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full flex-col py-15 items-center justify-center rounded-sm">
      {/* <WorkspaceForm /> */}
      <h1 className="text-xl font-bold">Your Workspace</h1>
      {/* {session?.session?.activeOrganizationId} */}

      <div className="flex gap-5 mt-5">
        {org.length > 0 &&
          org.map((org) => (
            // <Link href={`/workspace/${org.id}`} key={org.id}>
            <Card
              key={org.id}
              className="w-[300px] bg-primary text-primary-foreground"
            >
              <CardHeader className="pb-2">
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{org.logo}</p>

                <Link href={`/workspace/${org.slug}`} className="" children={org.slug} />
              </CardContent>
            </Card>
            // </Link>
          ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
