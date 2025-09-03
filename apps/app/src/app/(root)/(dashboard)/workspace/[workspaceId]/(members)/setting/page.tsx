/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@repo/design/components/ui/separator";
import { Button } from "@repo/design/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Input } from "@repo/design/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@repo/design/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/components/ui/avatar";
import { FaTools } from "react-icons/fa";
import { profileFormSchema } from "@/types/form";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.fullName || "",
      username: user?.username || "",
      bio: (user?.publicMetadata.bio as string) || "",
      url: (user?.publicMetadata.website as string) || "",
    },
  });

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsSaving(true);

    // Simulating API request
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div>
        <h2 className="text-3xl animate-pulse flex font-bold tracking-tight">
          <FaTools className="inline mr-2 duration-150 shadow-2xl" />
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 space-y-4">
          <Separator />

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || "User"}
              />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Change avatar</Button>
          </div>

          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
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
                    Save changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
