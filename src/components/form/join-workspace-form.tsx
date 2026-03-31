"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useForm } from "@tanstack/react-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendJoinWorkspaceRequest } from "@/action/workspace";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, Loader } from "lucide-react";
import { convertToSlug } from "@/lib/text-formatter";
import { Field, FieldError, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { validators } from "tailwind-merge";
import Link from "next/link";
import { routeConfig } from "@/lib/routeConfig";

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
          toast({
            title: "Error",
            description: result.error || "Failed to send join request",
            variant: "destructive",
          });
          return;
        } 
        
        toast({
          title: "Success!",
          description: `Your request to join "${result.data?.workspaceName}" has been sent to the workspace owner.`,
        });
        
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
            type="submit"
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
        <CardFooter className="text-center text-sm text-muted-foreground">
          If you want to create a new workspace instead,{" "}
          <Link href={routeConfig.workspace.new} className="text-primary hover:underline">
            Create Workspace
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
