"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    // Sign out using better-auth
    await signOut();

    // Redirect to home page
    router.push("/auth/sign-in");
    router.refresh();
  };

  return <Button onClick={handleSignOut}>Sign out</Button>;
};
