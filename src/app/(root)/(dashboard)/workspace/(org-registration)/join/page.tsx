import Link from "next/link";
import { JoinWorkspaceForm } from "@/components/form";

const JoinWorkspacePage = () => {
  return (
    <div className="relative min-h-screen p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-8 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Join a Workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Request access from the workspace owner.
            </p>
          </div>
          <Link
            href="/workspace"
            className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            Back to workspaces
          </Link>
        </div>

        <JoinWorkspaceForm />
      </div>
    </div>
  );
};

export default JoinWorkspacePage;
