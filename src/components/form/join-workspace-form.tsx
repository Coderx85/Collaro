"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendJoinWorkspaceRequest } from "@/action/workspace";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, Loader } from "lucide-react";
import { convertToSlug } from "@/lib/text-formatter";

const joinWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(1, "Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters"),
  workspaceSlug: z
    .string()
    .min(1, "Workspace slug is required")
    .min(3, "Workspace slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Workspace slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

type JoinWorkspaceFormData = z.infer<typeof joinWorkspaceSchema>;

export function JoinWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<JoinWorkspaceFormData>({
    resolver: zodResolver(joinWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
    },
  });

  async function onSubmit(data: JoinWorkspaceFormData) {
    setIsLoading(true);
    try {
      const result = await sendJoinWorkspaceRequest(data.workspaceSlug, data.workspaceName);

      if (result.success) {
        toast({
          title: "Success!",
          description: `Your request to join "${result.data?.workspaceName}" has been sent to the workspace owner.`,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send join request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-border bg-card/80 shadow-sm">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-secondary/15" />
        <CardHeader className="relative space-y-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <LogIn className="h-4 w-4" />
            Join Workspace
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Request access in minutes
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Provide the workspace name and slug so the owner can approve your
            request quickly.
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Workspace Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., My Amazing Workspace"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        // Auto-generate slug from name 
                        const generatedSlug = convertToSlug(e.target.value)
                        form.setValue("workspaceSlug", generatedSlug)
                      }}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    The exact name of the workspace you want to join
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workspaceSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Workspace Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., my-amazing-workspace"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    The URL-friendly identifier of the workspace (lowercase,
                    numbers, and hyphens only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Request to Join
                </>
              )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
