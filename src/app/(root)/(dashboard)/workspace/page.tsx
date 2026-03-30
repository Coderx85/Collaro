import { headers } from "next/headers";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconPlus,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const WorkspacePage = async () => {
  let workspaceLoadError = false;
  let workspaces: Awaited<ReturnType<typeof auth.api.listOrganizations>> = [];

  try {
    workspaces = await auth.api.listOrganizations({
      headers: await headers(),
    });
  } catch (error) {
    workspaceLoadError = true;
    console.error("Failed to load workspaces", error);
  }

  const workspaceCount = workspaces.length;

  return (
    <div className="relative overflow-hidden px-6 pb-16 pt-8 md:px-10 md:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-6rem] h-72 w-72 rounded-full bg-primary/12 blur-[140px]" />
        <div className="absolute bottom-[-6rem] left-0 h-72 w-72 rounded-full bg-secondary/12 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[180px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-12">
        <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-linear-to-br from-background/90 via-card/85 to-muted/70 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_65%)]" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Workspace Hub
                <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
              </span>
              <h1
                className={`${displayFont.className} text-4xl font-semibold tracking-tight text-foreground md:text-5xl`}
              >
                Your Workspaces
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Curate spaces for every team, project, and live session. Jump back
                in or spin up something new in seconds.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1">
                  {workspaceCount} active spaces
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1">
                  Real-time meetings, rooms, and notes
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Team Pulse
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <IconUsers className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Everything in sync
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Keep your teams aligned across ongoing projects and
                      meetings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/16 text-secondary">
                    <IconSparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Lightweight setup
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Create a workspace and invite collaborators in moments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

        <section className="space-y-6">
          {workspaceLoadError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              We could not load your workspaces right now. Please try again in a
              moment.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2
                className={`${displayFont.className} text-2xl font-semibold tracking-tight text-foreground md:text-3xl`}
              >
                Pick up where you left off
              </h2>
              <p className="text-sm text-muted-foreground">
                Jump into your spaces or start a new one.
              </p>
            </div>
            <Button asChild className="group rounded-full px-6">
              <Link href="/workspace/new">
                Create workspace
                <IconPlus className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {workspaceCount > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {workspaces.map((workspace) => (
                <Link href={`/workspace/${workspace.slug}`} key={workspace.id}>
                  <Card className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/12">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col justify-between gap-6 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <IconBuildingSkyscraper className="size-6" />
                          </div>
                          <div>
                            <h3
                              className={`${displayFont.className} text-lg font-semibold text-foreground`}
                            >
                              {workspace.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              /{workspace.slug}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Open workspace
                        </p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground">
                          <IconArrowRight className="size-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}

              <Link href="/workspace/new">
                <Card className="group relative flex h-full min-h-[240px] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-primary/40 bg-linear-to-br from-primary/8 via-background/80 to-secondary/12 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/70">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-110">
                      <IconPlus className="size-6" />
                    </div>
                    <div>
                      <p
                        className={`${displayFont.className} text-lg font-semibold text-foreground`}
                      >
                        Create a new workspace
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Spin up a dedicated space for a team
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/30 bg-linear-to-br from-primary/8 via-background/80 to-secondary/12 p-10 text-center shadow-[0_25px_60px_-50px_rgba(15,23,42,0.6)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-primary">
                <IconBuildingSkyscraper className="size-8" />
              </div>
              <h3
                className={`${displayFont.className} mt-6 text-2xl font-semibold text-foreground`}
              >
                No workspaces yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Build a shared space for meetings, docs, and live rooms.
              </p>
              <Button asChild className="mt-6 rounded-full px-6">
                <Link href="/workspace/new">Create your first workspace</Link>
              </Button>
            </div>
          )}
        </section>

        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="space-y-3">
            <h2
              className={`${displayFont.className} text-2xl font-semibold tracking-tight text-foreground md:text-3xl`}
            >
              Join a workspace
            </h2>
            <p className="text-sm text-muted-foreground">
              Request access when you already have a workspace name and slug from
              the owner.
            </p>
            <Button asChild variant="secondary" className="group rounded-full px-6">
              <Link href="/workspace/join">
                Open Join Form
                <IconArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-background/70 via-card/80 to-muted/60 p-6 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.6)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_65%)]" />
            <div className="relative grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Step 01
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Share your slug
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ask the workspace owner for the exact slug.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Step 02
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Submit your request
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We'll notify you as soon as access is approved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkspacePage;
