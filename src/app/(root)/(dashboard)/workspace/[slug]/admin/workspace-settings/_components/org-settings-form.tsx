"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import {
  IconAt,
  IconImageInPicture,
  IconUserPentagon,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/use-toast";
import { UpdateWorkspaceSchema } from "@/db/schema/type";
import { updateWorkspace } from "@/action/workspace.actions";

interface OrgSettingsFormProps {
  workspaceId: string;
  initialName: string;
  initialSlug: string;
  initialLogo?: string;
}

interface FormFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  errors?: any[];
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
}

function FormFieldWithIcon({
  icon,
  label,
  placeholder,
  value,
  onChange,
  error,
  errors,
  inputClassName = "pl-10",
  type = "text",
}: FormFieldProps) {
  return (
    <Field data-invalid={error}>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground">
          {icon}
        </div>
        <Input
          placeholder={placeholder}
          value={value || ""}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error}
          className={inputClassName}
        />
      </div>
      {error && <FieldError errors={errors} />}
    </Field>
  );
}

export function OrgSettingsForm({
  workspaceId,
  initialName,
  initialSlug,
  initialLogo,
}: OrgSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const orgForm = useForm({
    defaultValues: {
      name: initialName,
      slug: initialSlug,
      logo: initialLogo || "",
    },
    validators: {
      onSubmit: UpdateWorkspaceSchema.pick({
        name: true,
        slug: true,
        logo: true,
      }).required({ logo: true }),
    },
    onSubmit: async ({ value }) => {
      setIsSaving(true);
      try {
        const result = await updateWorkspace(workspaceId, {
          name: value.name,
          slug: value.slug,
          logo: value.logo,
        });

        if (result.success) {
          toast({
            title: "Workspace Updated",
            description: "Workspace settings have been updated successfully.",
          });

          if (value.slug !== initialSlug) {
            router.push(`/workspace/${value.slug}/workspace-settings`);
          } else {
            router.refresh();
          }
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update workspace settings.",
            variant: "destructive",
          });
        }
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        orgForm.handleSubmit(e);
      }}
    >
      {/* Basic Information */}
      <div className="flex flex-1 gap-6 py-3">
        <orgForm.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FormFieldWithIcon
                icon={<IconUserPentagon className="w-full h-full" />}
                label="Workspace Name"
                placeholder="My Workspace"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                error={isInvalid}
                errors={field.state.meta.errors}
                inputClassName="pl-10"
              />
            );
          }}
        </orgForm.Field>

        <orgForm.Field name="slug">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FormFieldWithIcon
                icon={<IconAt className="w-full h-full" />}
                label="Workspace Slug"
                placeholder="my-workspace"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                error={isInvalid}
                errors={field.state.meta.errors}
                inputClassName="lowercase pl-9"
              />
            );
          }}
        </orgForm.Field>
      </div>

      {/* Logo */}
      <orgForm.Field name="logo">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FormFieldWithIcon
              icon={<IconImageInPicture className="w-full h-full" />}
              label="Workspace Logo URL"
              placeholder="https://example.com/logo.png"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              error={isInvalid}
              errors={field.state.meta.errors}
              inputClassName="pl-10"
              type="file"
            />
          );
        }}
      </orgForm.Field>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="mt-5">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
