"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStore } from "@/store/workspace";
import { CreateWorkspaceResponse } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components";

const WorkspaceForm = () => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setWorkspace } = useWorkspaceStore();
  
  const handleJoin = async () => {
    // Handle join logic here
    try {
      setLoading(true);
      const res = await fetch(`/api/workspace/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workspaceName! }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!data.success) {
        setError(data.error);
        console.error(data.error);
        return toast.error(data.error);
      }

      const workspaceData: CreateWorkspaceResponse = data.data;
      toast.success("Workspace joined successfully");
      console.log("Joining workspace:", workspaceData);
      const members = Array.isArray(workspaceData.members)
        ? workspaceData.members.map((member) => {
            // If already an object, use it directly
            if (typeof member === "object" && member !== null) {
              return member;
            }
            // Create proper member object structure from string
            return {
              id: String(member),
              name: "",
              userName: "",
              email: "",
              role: "",
            };
          })
        : [];
      setWorkspace(workspaceData.id, workspaceData.name, members);
      router.push("/workspace/" + workspaceData.id);
    } catch (error: unknown) {
      console.error(error);
      toast.error("An error occurred while joining the workspace");
      setError("An error occurred while joining the workspace");
    } finally {
      setLoading(false);
      setWorkspaceName("");
    }
  };

  const handleCreate = async () => {
    // Handle create logic here
    try {
      setLoading(true);
      const res = await fetch("/api/workspace/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: workspaceName,
        }),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (!data.success) {
        setError(data.error || "Failed to create workspace");
        console.error("Cannot create workspace with Name:", workspaceName);
        return toast.error(
          `Cannot create workspace with Name: ${workspaceName}`,
        );
      }

      const workspaceData = data.data;
      toast.success("Workspace created successfully");
      console.log("Joining workspace:", workspaceData);

      if (!workspaceData || !workspaceData.id || !workspaceData.name) {
        throw new Error("Invalid workspace data received");
      }

      const members = Array.isArray(workspaceData.members)
        ? workspaceData.members.map((member: any) => {
            // Create proper member object structure from string
            return {
              id: String(member),
              name: "",
              userName: "",
              email: "",
              role: "",
            };
          })
        : [];

      setWorkspace(workspaceData.id, workspaceData.name, members);
      router.push(`/workspace/${workspaceData.id}`);
    } catch (error: unknown) {
      console.error(error);
      toast.error("An error occurred while creating the workspace");
      setError("An error occurred while creating the workspace");
    } finally {
      setLoading(false);
      setWorkspaceName("");
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background/80 to-secondary/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%] px-4 sm:px-6 xl:px-8 py-3 sm:py-4 bg-gradient-to-r from-white/30 via-background/80 to-primary/20 dark:from-slate-950/40 dark:via-slate-900/80 dark:to-primary/30 backdrop-blur-md rounded-2xl border border-white/80 dark:border-slate-600/50 shadow-[0_4px_10px_rgb(0,0,0,0.1)] dark:shadow-[0_4px_10px_rgb(0,0,0,0.25)]">
        <Link
          href="/"
          className="flex items-end gap-1 sm:gap-2 align-bottom justify-end cursor-pointer"
        >
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={30}
            height={30}
            className="h-auto w-6 sm:w-7 xl:w-8"
          />
          <span>
            <p className="group text-[32px] sm:text-[36px] font-extrabold text-white duration-75 hover:text-white drop-shadow-lg">
              Collaro
            </p>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 w-full mt-28">
        <Tabs defaultValue="join" className="w-full max-w-md mx-auto rounded-lg border bg-gradient-to-br from-background/80 via-white/60 to-primary/10 dark:from-slate-900 dark:via-slate-950 dark:to-primary/10 shadow-sm backdrop-blur">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-md bg-gradient-to-r from-muted/60 via-background/80 to-primary/10 dark:from-slate-800 dark:via-slate-900 dark:to-primary/20 p-1">
          <TabsTrigger
            value="join"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200"
            aria-label="Join workspace tab"
          >
            Join
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200"
            aria-label="Create workspace tab"
          >
            Create
          </TabsTrigger>
          </TabsList>

          {/* Join Workspace Form */}
          <TabsContent value="join">
          <Card className="rounded-lg border bg-gradient-to-br from-card/80 via-background/80 to-primary/10 dark:from-slate-900 dark:via-slate-950 dark:to-primary/10 shadow-md">
            <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-primary dark:text-primary-300 drop-shadow-lg">Join Workspace</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-slate-300">
              Enter the workspace name to join.
            </CardDescription>
            {error && (
              <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-gradient-to-r from-destructive/10 to-destructive/30 px-3 py-2 text-sm text-destructive font-semibold shadow-sm"
              >
              {error}
              </p>
            )}
            </CardHeader>
            <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleJoin();
            }}
            >
            <CardContent className="space-y-2">
              <Label htmlFor="join-workspace-id" className="font-semibold text-primary dark:text-primary-300">{`Workspace Name`}</Label>
              <Input
              id="join-workspace-id"
              value={workspaceName}
              disabled={loading}
              aria-invalid={Boolean(error)}
              placeholder="e.g., team-alpha"
              autoComplete="off"
              autoFocus
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white/80 dark:bg-slate-900/80 text-primary dark:text-primary-200 placeholder:text-muted-foreground dark:placeholder:text-slate-400 border border-primary/30 dark:border-primary/40 transition-all duration-200 focus:scale-[1.03]"
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setError("");
              }}
              />
              <p className="text-xs text-muted-foreground dark:text-slate-400">
              Names are case-sensitive.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="default"
                className="w-full bg-gradient-to-r from-primary/80 to-secondary/80 text-white dark:text-primary-foreground shadow-md hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 focus:scale-[1.03] focus:outline-2 focus:outline-primary"
                onClick={handleJoin}
                disabled={loading || workspaceName.trim().length === 0}
                aria-label="Join workspace"
                title="Join workspace"
              >
                {loading ? (
                  <span className="flex w-full items-center justify-center gap-3">
                  <Loader2 className="size-4 animate-spin text-primary dark:text-primary-300" aria-live="polite" />
                  <span className="font-semibold">Joining Workspace</span>
                  </span>
                ) : (
                  <span className="font-semibold">Join Workspace</span>
                )}
              </Button>
            </CardFooter>
            </form>
          </Card>
          </TabsContent>

          {/* Create Workspace Form */}
          <TabsContent value="create">
          <Card className="rounded-lg border bg-gradient-to-br from-card/80 via-background/80 to-primary/10 dark:from-slate-900 dark:via-slate-950 dark:to-primary/10 shadow-md">
            <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-primary dark:text-primary-300 drop-shadow-lg">Create Workspace</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-slate-300">
              Enter a new workspace name.
            </CardDescription>
            {error && (
              <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-gradient-to-r from-destructive/10 to-destructive/30 px-3 py-2 text-sm text-destructive font-semibold shadow-sm"
              >
              {error}
              </p>
            )}
            </CardHeader>
            <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            >
            <CardContent className="space-y-2">
              <div className="space-y-1">
              <Label htmlFor="create-workspace-name" className="font-semibold text-primary dark:text-primary-300">Workspace Name</Label>
              <Input
                id="create-workspace-name"
                value={workspaceName}
                disabled={loading}
                placeholder="e.g., devs-hub"
                autoComplete="off"
                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white/80 dark:bg-slate-900/80 text-primary dark:text-primary-200 placeholder:text-muted-foreground dark:placeholder:text-slate-400 border border-primary/30 dark:border-primary/40 transition-all duration-200 focus:scale-[1.03]"
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                Choose a concise, memorable name.
              </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="default"
                className="w-full bg-gradient-to-r from-primary/80 to-secondary/80 text-white dark:text-primary-foreground shadow-md hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 focus:scale-[1.03] focus:outline-2 focus:outline-primary"
                onClick={handleCreate}
                disabled={loading || workspaceName.trim().length === 0}
                aria-label="Create workspace"
                title="Create workspace"
              >
                {loading ? (
                  <span className="flex w-full items-center justify-center gap-3">
                  <Loader2 className="size-4 animate-spin text-primary dark:text-primary-300" aria-live="polite" />
                  <span className="font-semibold">Creating Workspace</span>
                  </span>
                ) : (
                  <span className="font-semibold">Create Workspace</span>
                )}
              </Button>
            </CardFooter>
            </form>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkspaceForm;
