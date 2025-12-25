"use client";

import { type ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "@/lib/auth-client";
import { tokenProvider } from "@/action";
import Loader from "@/components/Loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending || !session?.user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: session.user.id,
        name: session.user.userName || session.user.name || session.user.id,
        image: session.user.image || undefined,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [session, isPending]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
