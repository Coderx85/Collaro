"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { sendJoinWorkspaceRequest } from "@/action/workspace";
import { LogIn, Loader } from "lucide-react";
import { convertToSlug } from "@/lib/text-formatter";

import Link from "next/link";
import { routeConfig } from "@/lib/routeConfig";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const joinWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(1, "Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters"),
  workspaceSlug: z
    .string()
    .min(1, "Workspace slug is required")
    .min(3, "Workspace slug must be at least 3 characters"),
});

export function JoinWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
    },
    resolver: zodResolver(joinWorkspaceSchema),
  });

  const onSubmit = async (data: { workspaceName: string; workspaceSlug: string }) => {
    setIsLoading(true);
    try {
      const result = await sendJoinWorkspaceRequest(data.workspaceSlug, data.workspaceName);

      if (!result.success) {
        toast.error(result.error || "Failed to send join request");
        return;
      } 
      
      toast.success(`Your request to join "${result.data?.workspaceName}" has been sent to the workspace owner.`);
      
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
      }} 
      className="w-full max-w-md relative z-10"
    >
      <Card className="relative backdrop-blur-xl bg-card/80 shadow-lg overflow-hidden">
        <Link href={routeConfig.workspace.base} className="flex items-center gap-1 text-primary">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4"
          >
            <IconArrowLeft className="h-4 w-4 text-primary"/>
            Back
          </Button>
        </Link>
        <CardHeader className="space-y-4 text-center relative">
          <CardTitle className="text-2xl font-bold text-secondary">
            Join Workspace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Choose labels and a slug to create your workspace.
            Provide the workspace name and slug so the owner can approve your
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Workspace Name"
                    onChange={(e) => {
                      field.onChange(e);
                      // Auto-generate slug based on the name
                      const generatedSlug = convertToSlug(e.target.value);
                      form.setValue("workspaceSlug", generatedSlug, { shouldValidate: true });
                    }}
                    aria-invalid={!!form.formState.errors.workspaceName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workspaceSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Workspace Slug"
                    onChange={(e) => field.onChange(e)}
                    aria-invalid={!!form.formState.errors.workspaceSlug}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <Button
          variant="default"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" />
              Sending Request...
            </>
          ) : (
            <>
              <LogIn className="mr-2" />
              Join Workspace
            </>
          )}
        </Button>
      </Card>
    </form>
  );
}