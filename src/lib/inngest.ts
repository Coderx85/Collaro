import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "collaro",
  signingKey: process.env.INNGEST_SIGNING_KEY,
  baseUrl: process.env.INNGEST_BASE_URL,
});
