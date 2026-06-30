"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/action/user.actions";
import tryCatch from "@/lib/try-catch-wrapper";

type Params = Awaited<ReturnType<typeof getCurrentUser>>;
type TUser = Params["user"];
type Result = {
  user: Params["user"] | undefined;
  loading: boolean;
}

export async function useUser(): Promise<Result> {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    void tryCatch({
      ctx: async () => {
        setLoading(true);
        try {
          const { user } = await getCurrentUser();
          setUser(user);
        } finally {
          setLoading(false);
        }
      }
    });
  }, []);

  return { user, loading };
}