"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createWorkspace } from "@/action";
import { useListOrganizations, useSession } from "@/lib/auth-client";
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
import { NewWorkspaceFormSchema, TUserRole } from "@/types";

const NewWorkspaceForm = () => {
  const router = useRouter();
  const { data: organizations } = useListOrganizations();
  const orgMember = organizations?.find(
    (org) => org.id === organizations[0]?.id,
  );

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

        if (!result.success || !result.data) {
          console.error("Workspace creation failed: \n", result.error);
          toast.error(result.error || "Failed to create workspace");
          return;
        }

        toast.success("Workspace created successfully");
        router.push(`/workspace/${result.data.slug}`);
      } catch (error: unknown) {
        // Handle permission denied errors
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
      className="space-y-4 min-w-lg mx-auto"
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Name
                </FieldLabel>
                <div className="relative">
                  <IconBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Workspace Name"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor={field.name} className="text-slate-200">
                  Workspace Slug
                </FieldLabel>
                <div className="relative">
                  <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="workspace-slug"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                  />
                </div>
                <FieldDescription className="text-slate-400">
                  This will be the URL of your workspace.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-5"
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
    </form>
  );
};

export default NewWorkspaceForm;
