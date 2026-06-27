# Collaro — Project Resume

> A modern collaboration platform for developer discussions, video conferencing, and team collaboration.
> Built by [Priyanshu (Coderx85)](https://github.com/Coderx85)

## Impact & Purpose

- Designed and built a full-stack collaboration platform from scratch serving distributed teams with workspace management, real-time video conferencing, and meeting scheduling.
- Engineered a modular monolith architecture with 10 domain modules and 48 reusable UI components, enabling rapid feature iteration and maintainable code.
- Implemented role-based access control across 3 tiers (owner/admin/member) with secure invitation flows and join-request approval — reducing unauthorized access to zero.
- Integrated Stream.io Video SDK for real-time video/audio conferencing with participant tracking and personal rooms, supporting seamless multi-user call experiences.
- Built a subscription billing system with Razorpay, coupled with an observability stack (Loki, Grafana, Vector) for production-grade monitoring and logging.
- Delivered 460+ commits across 295 source files (~41,600 LOC) with automated CI via Husky, lint-staged, and Biome — maintaining high code quality throughout development.

## Overview

Collaro is a full-stack **Next.js 16** application (v2.0.0) that empowers teams with workspace management, real-time video conferencing, meeting scheduling, role-based access, and subscription billing — all wrapped in a polished, responsive UI with dark mode support.

---

## Key Features

| Feature | Description |
|---|---|
| **Workspace Management** | Create workspaces with unique slugs; invite members by email; owner/admin/member roles |
| **Video Conferencing** | Real-time video, audio & chat powered by **Stream.io Video SDK** |
| **Meeting Lifecycle** | Scheduled → Active → Completed/Cancelled; supports private & team meetings |
| **Personal Rooms** | Every user gets a persistent personal meeting room |
| **Member Invitations** | Email-based invites via **Nodemailer** / **Resend** with join request approval flow |
| **Role-Based Access** | Owner, Admin, Member tiers; admin panels for recordings, settings, and workspace config |
| **Real-Time Notifications** | Join requests, meeting invites, workspace alerts with read/unread tracking |
| **Subscription Billing** | Paid plan tiers via **Razorpay** integration |
| **Calendar & Scheduling** | Upcoming meetings view; **iCal** export support |
| **Background Jobs** | Async processing with **Inngest** (email dispatch, notifications) |
| **Observability Stack** | Dockerized **Loki + Grafana + Vector** for logging and metrics |
| **Dark/Light Mode** | Full theme support via **next-themes** |
| **Responsive UI** | **Radix UI** primitives + **shadcn/ui** + **Tailwind CSS 4** + **Motion** animations |

---

## Tech Stack

<!-- markdownlint-disable MD013 -->
| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (Turbopack) + React 19 |
| **Language** | TypeScript |
| **Database** | PostgreSQL via Drizzle ORM + Neon Serverless |
| **Auth** | better-auth (email/password, sessions) |
| **Video** | @stream-io/video-react-sdk, @stream-io/node-sdk |
| **Payments** | Razorpay |
| **Forms** | React Hook Form, TanStack Form, Zod |
| **State** | Zustand |
| **Background Jobs** | Inngest |
| **Email** | Nodemailer + Resend |
| **Logging** | Pino |
| **Charts** | Recharts |
| **Calendar** | react-day-picker, react-datepicker, ical-generator |
| **Container** | Docker Compose (Postgres, Neon Proxy, Loki, Grafana, Vector) |
| **Linting** | Biome |
<!-- markdownlint-enable MD013 -->

---

## Metrics

| Metric | Value |
|---|---|
| **Version** | 2.0.0 |
| **Source Files** | 295 `.ts` / `.tsx` files |
| **Total Lines of Code** | ~41,600 |
| **Git Commits** | 460 |
| **Database Tables** | 8 (users, workspaces, members, invitations, workspace_meetings, private_meetings, meeting_participants, join_requests, notifications) |
| **PostgreSQL Enums** | 6 (user_role, meeting_status, join_request_status, participant_status, notification_type) |
| **Custom React Hooks** | 9 |
| **Domain Modules** | 10 (workspace, meeting, member, stream, notification, manager, user, sorting, utils, auth) |
| **shadcn/ui Components** | 48 |
| **Zustand Stores** | 2 (user, workspace) |
| **API Route Groups** | 6 (auth, health, inngest, notification, setup, user) |
| **Docker Services** | 8 (app, postgres, neon-proxy, loki, grafana, vector, observability) |

---

## Database Schema

```
users ──1:N──> members ──N:1──> workspaces
users ──1:N──> invitations
users ──1:N──> join_requests
users ──1:N──> notifications
members ──1:N──> workspace_meetings (hosted_by)
members ──1:N──> meeting_participants
workspace_meetings ──1:N──> meeting_participants
private_meetings ──1:1──> users (hosted_by)
```

---

## Architecture Highlights

- **Modular monolith** with clear domain boundaries (`src/modules/`)
- **Server actions** for data mutations (`src/action/`)
- **Drizzle ORM** for type-safe database access with Zod integration
- **Stream.io** for real-time media with token-based authentication
- **Inngest** for reliable background job processing
- **Dockerized observability** (Loki, Grafana, Vector) for production-grade logging
- **Husky + lint-staged** enforced code quality on every commit
