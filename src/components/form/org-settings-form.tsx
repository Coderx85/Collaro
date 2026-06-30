"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import {
  IconAt,
  IconImageInPicture,
  IconUserPentagon,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { UpdateWorkspaceSchema } from "@/db/schema/type";
import { updateWorkspace } from "@/action/workspace/workspace.actions";
import { TWorkspaceId } from "@/types";

interface OrgSettingsFormProps {
  workspaceId: TWorkspaceId;
  initialName: string;
  initialSlug: string;
  initialLogo?: string;
}

function FormFieldWithIcon({
  icon,
  label,
  placeholder,
  value,
  onChange,
  error,
  inputClassName = "pl-10",
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
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
      </FormControl>
      {error && <FormMessage />}
    </FormItem>
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
    resolver: zodResolver(UpdateWorkspaceSchema.pick({
      name: true,
      slug: true,
      logo: true,
    }).required({ logo: true })),
  });

  const onSubmit = async (data: { name: string; slug: string; logo: string }) => {
    setIsSaving(true);
    try {
      const result = await updateWorkspace(workspaceId, {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
      });

      if (result.success) {
        toast.success("Workspace settings updated successfully");

        if (data.slug !== initialSlug) {
          router.push(`/workspace/${data.slug}/workspace-settings`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to update workspace settings");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...orgForm}>
      <form
        onSubmit={orgForm.handleSubmit(onSubmit)}
      >
      <div className="flex flex-1 gap-6 py-3">
        <FormField
          control={orgForm.control}
          name="name"
          render={({ field }) => {
            const isInvalid = orgForm.formState.errors.name !== undefined;
            return (
              <FormFieldWithIcon
                icon={<IconUserPentagon className="w-full h-full" />}
                label="Workspace Name"
                placeholder="My Workspace"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={isInvalid}
                inputClassName="pl-10"
              />
            );
          }}
        />

        <FormField
          control={orgForm.control}
          name="slug"
          render={({ field }) => {
            const isInvalid = orgForm.formState.errors.slug !== undefined;
            return (
              <FormFieldWithIcon
                icon={<IconAt className="w-full h-full" />}
                label="Workspace Slug"
                placeholder="my-workspace"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={isInvalid}
                inputClassName="lowercase pl-9"
              />
            );
          }}
        />
      </div>

      <FormField
        control={orgForm.control}
        name="logo"
        render={({ field }) => {
          const isInvalid = orgForm.formState.errors.logo !== undefined;
          return (
            <FormFieldWithIcon
              icon={<IconImageInPicture className="w-full h-full" />}
              label="Workspace Logo URL"
              placeholder="https://example.com/logo.png"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={isInvalid}
              inputClassName="pl-10"
              type="file"
            />
          );
        }}
      />

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
    </Form>
  );
}