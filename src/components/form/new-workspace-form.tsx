"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createWorkspace } from "@/action";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IconLink, IconLoader2, IconBriefcase } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewWorkspaceFormSchema } from "@/types";
import { convertToSlug } from "../../lib/text-formatter";
import Link from "next/link";
import { routeConfig } from "@/lib/routeConfig";
import { IconArrowLeft } from "@tabler/icons-react";

export function NewWorkspaceForm() {
  const router = useRouter();

  const [isPending, setPending] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: NewWorkspaceFormSchema,
    },
    onSubmit: async ({ value }) => {
      setPending(true);
      try {
        const result = await createWorkspace(value);

        if (!result.success) {
          console.error("Workspace creation failed:", result.error);
          toast.error(result.error || "Failed to create workspace");
          return;
        }

        toast.success("Workspace created successfully", { description: "Your workspace is ready to collaborate.", });
        router.push(`/workspace/${result.data.slug}`);
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("permission")) {
          toast.error(
            "You don't have permission to create a workspace. Contact your admin.",
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        console.error("Workspace creation error:", error);
      } finally {
        setPending(false);
      }
    },
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
          asChild
        >
          <Link href={routeConfig.workspace.base} className="flex items-center gap-1 text-primary">
            <IconArrowLeft className="h-4 w-4 text-primary"/>
            Back
          </Link>
        </Button>
        <CardHeader className="space-y-4 text-center relative">
          <CardTitle className="text-2xl font-bold text-secondary">
            Create Workspace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Choose labels and a slug to create your workspace.
            Choose a name and a URL-friendly slug for your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground dark:text-foreground"
                    >
                      Name
                    </FieldLabel>
                    <div className="relative">
                      <IconBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
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
                          field.form.setFieldValue("slug", generatedSlug);
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Workspace Name"
                        className="pl-10"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="slug">
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
                    <div className="relative">
                      <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {field.handleChange(e.target.value)}}
                        aria-invalid={isInvalid}
                        placeholder="workspace-slug"
                        className="pl-10"
                      />
                    </div>
                    <FieldDescription className="text-muted-foreground">
                      This will be the URL of your workspace.
                    </FieldDescription>
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
            disabled={isPending}
            className="w-full transition-transform active:scale-95"
            variant={"secondary"}
          >
            {isPending ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Workspace</>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center relative">
          <Link
            href={routeConfig.workspace.join}
            className="text-primary hover:underline"
          >
            Join an existing workspace
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
};
