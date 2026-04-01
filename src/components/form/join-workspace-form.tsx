"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { sendJoinWorkspaceRequest } from "@/action/workspace";
import { LogIn, Loader } from "lucide-react";
import { convertToSlug } from "@/lib/text-formatter";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { routeConfig } from "@/lib/routeConfig";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "sonner";

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

export function JoinWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      workspaceName: "",
      workspaceSlug: "",
    },
    validators: {
      onSubmit: joinWorkspaceSchema
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const result = await sendJoinWorkspaceRequest(value.workspaceSlug, value.workspaceName);

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
    }
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }} 
      className="w-full max-w-md relative z-10"
    >
      <Card className="relative backdrop-blur-xl bg-card/80 shadow-lg overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 left-4"
        >
          <Link href={routeConfig.workspace.base} className="flex items-center gap-1 text-primary">
            <IconArrowLeft className="h-4 w-4 text-primary"/>
            Back
          </Link>
        </Button>
        <CardHeader className="space-y-4 text-center relative">
          <CardTitle className="text-2xl font-bold text-secondary">
            Join Workspace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Choose labels and a slug to create your workspace.
            Provide the workspace name and slug so the owner can approve your
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <form.Field name="workspaceName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground dark:text-foreground"
                    >
                      Workspace Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);

                        // Auto-generate slug based on the name
                        const generatedSlug = convertToSlug(e.target.value);
                        field.form.setFieldValue("workspaceSlug", generatedSlug);
                      }}
                      aria-invalid={isInvalid}
                      placeholder="Workspace Name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="workspaceSlug">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground dark:text-foreground"
                    >
                      Workspace Slug
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Workspace Slug"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <Button
            variant={"default"}
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
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground flex flex-col gap-2">
          If you want to create a new workspace instead,{" "}
          <Link href={routeConfig.workspace.new} className="text-secondary-foreground hover:underline">
            Create Workspace
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
