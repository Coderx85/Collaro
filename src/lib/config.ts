export const config = {
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database:
    process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/mydb",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  betterSecret: process.env.BETTER_AUTH_SECRET,
  lokiUrl: process.env.LOKI_URL,
  SIGN_UP: process.env.SIGN_UP_URL || "/auth/register",
  SIGN_IN: process.env.SIGN_IN_URL || "/auth/login",

  // SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_EMAIL_FROM:
    process.env.SMTP_EMAIL_FROM || "Collaro <noreply@collaro.app>",

  // Inngest Configuration
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  INNGEST_BASE_URL: process.env.INNGEST_BASE_URL || "https://inngest.com",
};
