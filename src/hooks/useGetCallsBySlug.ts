"use client";

import React, { useEffect, useState } from "react";
import type { Call } from "@/types/action";
import { getCallsBySlug } from "@/action";
import { APISuccessResponse } from "@/types";

export const useGetCallsBySlug = (slug: string) => {
  const [data, setData] = useState<Call[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    const fetchCalls = async () => {
      setIsPending(true);
      const res = await getCallsBySlug(slug);

      if (!res || !res.success || !res.data) {
        setData([]);
      }

      const { data } = res as APISuccessResponse<Call[]>;

      setData(data);
      setIsPending(false);
    };

    fetchCalls();
  }, [slug]);

  return { data, isPending };
};
