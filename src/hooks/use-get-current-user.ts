"use client";

import { getCurrentUser } from "@/action/user.actions";
import { useEffect, useState } from "react";

type Data = Awaited<ReturnType<typeof getCurrentUser>>;

export const useGetCurrentUser = () => {
  const [isPending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setPending(true);

      try{
        const result = await getCurrentUser();
        if(!result) {
          setError("No user data found");
        }

        setData(result);
      }
      catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
      finally {
        setPending(false);
      }
    };

    fetchData();
  }, []);

  return { isPending, error, data };
};