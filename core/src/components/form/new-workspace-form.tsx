"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createWorkspace } from "@/action";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function NewWorkspaceForm() {
  const router = useRouter();

  const [isPending, setPending] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    resolver: zodResolver(NewWorkspaceFormSchema),
  });

  const onSubmit = async (data: { name: string; slug: string }) => {
    setPending(true);
    try {
      const result = await createWorkspace(data);

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
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md relative z-10"
      >
      <Card className="relative backdrop-blur-xl bg-card/80 shadow-lg overflow-hidden">
        <Link href={routeConfig.workspace.base}>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4"/>
            Back
          </Button>
        </Link>
        <CardHeader className="space-y-4 text-center relative">
          <CardTitle className="text-2xl font-bold text-secondary">
            Create Workspace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Choose labels and a slug to create your workspace.
            Choose a name and a URL-friendly slug for your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IconBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="Workspace Name"
                      className="pl-10"
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug based on the name
                        const generatedSlug = convertToSlug(e.target.value);
                        form.setValue("slug", generatedSlug, { shouldValidate: true });
                      }}
                      aria-invalid={!!form.formState.errors.slug}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="workspace-slug"
                      className="pl-10"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      aria-invalid={!!form.formState.errors.slug}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-muted-foreground">
                  This will be the URL of your workspace.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full transition-transform active:scale-95"
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
      </Card>
      </form>
    </Form>
  );
}