import arcjet, { tokenBucket } from "@arcjet/next";

const API_KEY: string = process.env.NEXT_PUBLIC_ARCJET_KEY!;

export const aj = arcjet({
  key: API_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      capacity: 10,
      refillRate: 1,
      interval: 3600,
    }),
  ],
});
