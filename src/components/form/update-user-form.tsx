"use client";

import { UpdateUserSchema } from "@/db/schema/type";
import { IUserDTO } from "@/types";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconAt, IconChecks, IconLoader2, IconMail, IconSettings2, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/action";
import { useState } from "react";

const userUpdateSchema = UpdateUserSchema.pick({
  name: true,
  userName: true,
  email: true,
}).required({
  name: true,
  userName: true,
  email: true,
})

export function UpdateUserForm({user}: {user: IUserDTO}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm({
    defaultValues: {
      name: user.name,
      userName: user.userName,
      email: user.email,
    },
    resolver: zodResolver(userUpdateSchema),
  });

  const onSubmit = async (data: { name: string; userName: string; email: string; }) => {
    setIsSaving(true);
    
    const result = await updateUserAction({
      name: data.name,
      userName: data.userName,
      email: data.email,
    });

    if (!result.success) {
      toast.error(result.error || "Failed to update profile.");
      setIsSaving(false);
      return;
    }

    toast.success("Profile updated successfully.");
    router.refresh();
    setIsSaving(false);
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconSettings2 className="size-5" />
            User Settings.
          </CardTitle>
          <CardDescription>
            Edit your account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="md:col-span-2 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Full name
                  </FormLabel>
                  <FormControl>
                    <div>
                      <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="Your name"
                        onBlur={field.onBlur}
                        autoComplete="name"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Username
                  </FormLabel>
                  <FormControl>
                    <div>
                      <IconAt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="Your username"
                        onBlur={field.onBlur}
                        autoComplete="username"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Email address
                  </FormLabel>
                  <FormControl>
                    <div>
                      <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="your@email.com"
                        onBlur={field.onBlur}
                        autoComplete="email"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-full px-8"
              >
                {isSaving ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconChecks className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}