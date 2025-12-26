# better-auth setup guide ✅

A compact, practical guide to install and configure `better-auth` in your project. This covers typical Node/Express and Next.js integrations, environment variables, basic testing, and troubleshooting tips.

---

## 1) Quick summary

- Purpose: add authentication (sign up / sign in / sessions) with minimal boilerplate.
- Scope: **server-side** auth (API routes, server components). You may combine with client components for UI.

---

## 2) Requirements

- Node 18+ (or your runtime of choice)
- A database connection (Postgres recommended) if you plan to persist users/sessions
- Package manager: npm, pnpm or bun

---

## 3) Install

Choose one of the common package managers:

```bash
# npm
npm install better-auth

# pnpm
pnpm add better-auth

# bun
bun add better-auth
```

---

## 4) Environment variables

Add required env vars to your `.env` (or secret store):

- `DATABASE_URL` — connection string to your DB
- `AUTH_SECRET` — a strong random string used to sign cookies/tokens
  Note: Keep secrets out of source control and rotate periodically.

---

## 5) Basic wiring (Next.js example)

Server route (Next.js App Router) example:

```ts
// app/api/auth/[...all]/route.ts
import { handleAuth } from "better-auth";

export const GET = handleAuth;
export const POST = handleAuth;
```

Client usage (call sign in or secure pages):

```ts
// client sign-in call
await fetch("/api/auth/sign-in", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

Middleware (optional) for protecting pages:

```ts
// middleware.ts
import { withAuth } from "better-auth";

export default withAuth((req, res) => {
  // allow protected route or redirect
});
```

Refer to the package docs for full API shapes and helpers.

---

## 6) Basic wiring (Express / Node)

```js
// server.js
const express = require("express");
const { createAuthRouter } = require("better-auth");

const app = express();
app.use("/api/auth", createAuthRouter());
```

---

## 7) Database / Migrations

- Create the tables the library expects (users, sessions) if using DB-backed sessions.
- If `better-auth` provides migration SQL, run that against your DB, or inspect the package docs for schema.

---

## 8) Local testing

- Start your app (e.g., `npm run dev`) and call the auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/sign-in`
  - `POST /api/auth/sign-out`
- Use curl or a REST client to test flows and examine cookies/response codes.

Example:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password"}' \
  http://localhost:3000/api/auth/register
```

---

## 9) Security & production tips ⚠️

- Use HTTPS in production; set cookies `Secure` and `SameSite` appropriately.
- Use a strong `AUTH_SECRET` and keep it in a secrets manager.
- Rate-limit authentication endpoints to reduce brute-force attacks.
- Ensure database credentials have least privilege.

---

## 10) Troubleshooting

- 401 or 403 on protected endpoints: verify cookie/token signing secret and cookie scope (domain/path).
- Missing DB tables: check migrations and run predefined SQL if included.
- Local dev vs container: ensure the app is reachable (hostnames like `host.docker.internal` may be needed in containers).

---

## 11) Where to go next

- Add email verification, password resets, and OAuth providers as needed.
- Add audit logging for auth events.
- Add observability: log auth events and add metrics for sign-ins, failures, latencies.

---

Need the guide adapted to a specific framework (Next.js, Remix, Express) or a copy-paste example for a particular provider? Let me know which one and I’ll add a tailored section. ✨