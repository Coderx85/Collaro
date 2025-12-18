"use client";
import { CreateWorkspaceSchema } from "@/db/schema/schema";
import React, { useState } from "react";
import { z } from "zod";
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
import { Link, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NewWorkspaceFormSchema = CreateWorkspaceSchema.pick({
  name: true,
  slug: true,
});

const NewWorkspaceForm = () => {
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
        if (!result.success || !result.data) {
          toast.error(result.error || "Failed to create workspace");
          return;
        }

        toast.success("Workspace created successfully");
        router.push(`/workspace/${result.data.slug}`);
      } catch (error: unknown) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Login error:", error);
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
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
