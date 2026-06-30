import { StreamClientConfig } from "./interface";
import { StreamVideoClient } from "@stream-io/video-react-sdk";

export const streamClientConfig = (config: StreamClientConfig) => {
  const client = StreamVideoClient.getOrCreateInstance({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY || "",
    tokenProvider: config.tokenProvider,
    user: {
      id: String(config.user.id),
      name: config.user.name,
      image: config.user.userName,
      custom: {
        email: config.user.email,
        userName: config.user.userName,
        createdAt: config.user.createdAt.toISOString(),
      },
      invisible: false,
      type: 'authenticated'
    }
  })

  return client;
}