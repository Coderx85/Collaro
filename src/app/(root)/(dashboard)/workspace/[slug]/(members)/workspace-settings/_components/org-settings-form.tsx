"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { updateWorkspace } from "@/action/workspace.action";
import { useRouter } from "next/navigation";

const orgFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().optional(),
});

type OrgFormValues = z.infer<typeof orgFormSchema>;

interface OrgSettingsFormProps {
  workspaceId: string;
  initialName: string;
  initialSlug: string;
  initialDescription?: string;
}

export function OrgSettingsForm({
  workspaceId,
  initialName,
  initialSlug,
  initialDescription = "",
}: OrgSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const orgForm = useForm<OrgFormValues>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: {
      name: initialName,
      slug: initialSlug,
      description: initialDescription,
    },
  });

  async function onOrgSubmit(data: OrgFormValues) {
    setIsSaving(true);

    try {
      const result = await updateWorkspace(workspaceId, {
        name: data.name,
        slug: data.slug,
      });

      if (result.success) {
        toast({
          title: "Workspace Updated",
          description: "Workspace settings have been updated successfully.",
        });

        // Redirect to new slug if it changed
        if (data.slug !== initialSlug) {
          router.push(`/workspace/${data.slug}/org-settings`);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...orgForm}>
      <form
        onSubmit={orgForm.handleSubmit(onOrgSubmit)}
        className="flex flex-col gap-4 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={orgForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Workspace" {...field} />
                </FormControl>
                <FormDescription>
                  The display name for your workspace.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={orgForm.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-workspace" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (lowercase, numbers, hyphens only).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={orgForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your workspace..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of what this workspace is for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
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
      </form>
    </Form>
  );
}
