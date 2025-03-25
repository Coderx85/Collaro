"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { deleteCookie } from "cookies-next";
import { useEffect } from "react";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  useEffect(() => {
    function deleteCookies() {
      deleteCookie("workspaceId");
      deleteCookie("username");
      deleteCookie("role");
    }
    deleteCookies();
  }, [signOut]);

  return (
    <Button onClick={() => signOut({ redirectUrl: "/" })}>Sign out</Button>
  );
};
