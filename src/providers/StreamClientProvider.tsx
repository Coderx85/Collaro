"use client";

import { type ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useGetCurrentUser } from "@/lib/auth";
import { tokenProvider } from "@/action";
import Loader from "@/components/Loader";
import { StreamClient } from "@/modules/stream/class";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, isPending } = useGetCurrentUser();

  useEffect(() => {
    if (isPending || !session?.user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = StreamClient.initialize({
      tokenProvider,
      user: session.user
    });

    setVideoClient(client);
  }, [session, isPending]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
