# Collaro <img src="public/icons/logo.png" alt="Collaro Logo" width="30" align="center" />

![Smart Workspaces](/public/home/hero.gif)

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/Priyanshux085/DevTalk)](https://github.com/Priyanshux085/DevTalk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Priyanshux085/DevTalk)](https://github.com/Priyanshux085/DevTalk/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Priyanshux085/DevTalk)](https://github.com/Priyanshux085/DevTalk/issues)
[![GitHub license](https://img.shields.io/github/license/Priyanshux085/DevTalk)](https://github.com/Priyanshux085/DevTalk/blob/main/LICENSE)

</div>


A modern developer collaboration platform built for remote teams. Collaro seamlessly integrates real-time communication, live streaming, and structured meetings to enhance team productivity.

> 💡 **Want to see how it's built?** Check out my [**Technical Deep Dive**](./learn.md) where I share the challenges, solutions, and lessons learned building this platform with Next.js, Clerk, Stream, and PostgreSQL!


## Problem Statement

Collaro provides Team Leads a workspace-centric template to manage teams within a single organisation: create isolated workspaces for Sales, Development, Management, or Accounting; assign roles and permissions per workspace; schedule and host meetings with recordings; and share resources selectively across one or multiple workspaces — all with simple RBAC controls to keep cross-team access safe and auditable.

## Architecture (Mermaid)

Below is a high-level data-model diagram showing the main entities used by Collaro (Users, Workspaces, Memberships, Meetings, Participants, Recordings). This visualization maps directly to the database schema in `packages/database/drizzle/schema.ts`.

```mermaid
erDiagram
    USERS ||--o{ WORKSPACE_USERS : belongs_to
    WORKSPACES ||--o{ WORKSPACE_USERS : has
    WORKSPACES ||--o{ WORKSPACE_MEETINGS : hosts
    WORKSPACE_MEETINGS ||--o{ PARTICIPANTS : includes
    WORKSPACE_MEETINGS ||--o{ RECORDINGS : records
    USERS ||--o{ PARTICIPANTS : attends
    USERS ||--o{ RECORDINGS : creates

    USERS {
      uuid id
      string name
      string userName
      string clerkId
      string email
      enum role
    }
    WORKSPACES {
      uuid id
      string name
      string createdBy
    }
    WORKSPACE_USERS {
      string userName
      string workspaceName
      enum role
    }
    WORKSPACE_MEETINGS {
      uuid meetingId
      uuid workspaceId
      string hostedBy
      timestamp createdAt
      timestamp endAt
    }
    PARTICIPANTS {
      uuid id
      uuid meetingId
      uuid userId
      timestamp joinedAt
      timestamp leftAt
    }
    RECORDINGS {
      uuid id
      uuid meetingId
      string url
      string visibility
      timestamp createdAt
    }
```

## Open Source Metrics & Guidelines

- **Primary metrics to track:** contributors, active contributors (last 90 days), stargazers, forks, open issues, PRs merged per month, and community response time. Aim targets (example): 10 active contributors in 6 months, <48h average initial response time to issues/PRs.
- **Labels & triage:** use `good first issue`, `help wanted`, `roadmap`, `security`, and `bug`. Tag newcomer-friendly issues to lower onboarding friction.
- **Maintainer SLA:** triage new issues within 48 hours, respond to PRs within 72 hours where possible.
- **Contribution recognition:** list active contributors in release notes and CONTRIBUTORS.md; highlight first-time contributors.
- **Sponsorship / Funding:** add a `FUNDING.yml` and GitHub Sponsors link when ready; consider GitHub Sponsors, Open Collective, or donation links.

If you'd like, I can add a small `metrics/` dashboard example or a `badges` snippet for the README.

## ✨ Key Features

- **Smart Workspaces**: Create and join dedicated team spaces with role-based access control.

- **Real-time Communication**: Engage in live discussions with integrated video and audio calls.


- **Live Streaming**: Stream your coding sessions or presentations directly to your team.

## 🛠️ Tech Stack

### Frontend Core
[![React 19](https://img.shields.io/badge/React-19.0.0-white?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.2-white?style=for-the-badge&logo=nextdotjs&logoColor=black)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0.0-white?style=for-the-badge&logo=typescript&logoColor=black)](https://www.typescriptlang.org/)

### UI & Design
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0.17-white?style=for-the-badge&logo=tailwind-css&logoColor=black)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-latest-white?style=for-the-badge&logo=radix-ui&logoColor=black)](https://www.radix-ui.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-0.479.0-white?style=for-the-badge&logo=lucide&logoColor=black)](https://lucide.dev/)

### State & Forms
[![Zustand](https://img.shields.io/badge/Zustand-5.0.3-white?style=for-the-badge&logo=npm&logoColor=black)](https://zustand-demo.pmnd.rs/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.54.2-white?style=for-the-badge&logo=react-hook-form&logoColor=black)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.24.2-white?style=for-the-badge&logo=zod&logoColor=black)](https://zod.dev/)

### Communication
[![Stream Video SDK](https://img.shields.io/badge/Stream_Video-1.12.7-white?style=for-the-badge&logo=stream&logoColor=black)](https://getstream.io/video/)

### Security
[![Clerk](https://img.shields.io/badge/Clerk-6.12.4-white?style=for-the-badge&logo=clerk&logoColor=black)](https://clerk.com/)

### Database
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-white?style=for-the-badge&logo=postgresql&logoColor=black)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.40.0-white?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

### DevOps & Tools
[![ESLint 9](https://img.shields.io/badge/ESLint-9.23.0-white?style=for-the-badge&logo=eslint&logoColor=black)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.5.3-white?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-9.1.7-white?style=for-the-badge&logo=git&logoColor=black)](https://typicode.github.io/husky/)
[![Docker](https://img.shields.io/badge/Docker-latest-white?style=for-the-badge&logo=docker&logoColor=black)](https://www.docker.com/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker (optional)
- Git

### Quick Start 🚀

1. **Clone & Install**
```bash
git clone https://github.com/Coderx85/Collaro.git
cd Collaro
npm install
```

2. **Environment Setup 🔐**

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk public key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `STREAM_API_KEY`: Your Stream API key
- `STREAM_API_SECRET`: Your Stream secret key
- `DATABASE_URL`: Your PostgreSQL connection string
- `RESEND_API_KEY`: Your Resend API key

> **Note:** Never commit `.env` or `.env.local` files to the repository

3. **Development**
```bash
npm run dev     # Start with Turbopack
# or
docker compose up --build   # Start with Docker
```

Visit [http://localhost:3000](http://localhost:3000)
