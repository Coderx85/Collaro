"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("User is not authenticated");
  if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
  if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.generateUserToken({
    user_id: session.user.id,
    exp: expirationTime,
    iat: issuedAt,
  });

  return token;
};
