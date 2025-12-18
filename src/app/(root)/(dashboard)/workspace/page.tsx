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
        <h1 className="text-xl font-bold">Your Workspace</h1>
        <Link href="/workspace/new" className="mt-5">
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
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{org.slug}</p>
                <p className="text-sm text-muted-foreground">{org.logo}</p>
              </CardContent>
            </Card>
            // </Link>
          ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
