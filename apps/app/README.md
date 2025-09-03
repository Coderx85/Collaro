# Collaro App

The main Next.js application for Collaro, a comprehensive video conferencing platform built with modern web technologies.

## Features

- **Video Conferencing**: Real-time video calls with Stream integration
- **Authentication**: Secure user authentication with Clerk
- **Database Management**: Efficient data handling with Drizzle ORM and Neon
- **Workspace Management**: Create and manage collaborative workspaces
- **Meeting Scheduling**: Schedule and manage meetings with calendar integration
- **Real-time Collaboration**: Live updates and notifications
- **Responsive Design**: Mobile-friendly interface with Radix UI components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Real-time**: Stream Video SDK
- **UI Components**: Radix UI with Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Payments**: Razorpay integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Neon PostgreSQL database
- Clerk account for authentication
- Stream account for video functionality

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL` (Neon PostgreSQL)
- `NEXT_PUBLIC_STREAM_API_KEY`
- `STREAM_SECRET_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

3. Set up the database:
```bash
pnpm db:push
pnpm db:generate
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema
- `pnpm db:generate` - Generate migrations
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio

## Project Structure

```
apps/app/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable UI components
│   ├── constants/     # Application constants
│   ├── db/           # Database configuration and migrations
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── providers/    # Context providers
│   ├── store/        # Zustand stores
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── package.json
```

## Key Components

- **Authentication**: Sign-in/sign-up with Clerk
- **Dashboard**: Main workspace interface
- **Meeting Room**: Video conferencing interface
- **Workspace Management**: Create and join workspaces
- **Meeting Scheduling**: Calendar-based meeting management
- **User Management**: Profile and settings

## Database Schema

The application uses the following main entities:
- Users (managed by Clerk)
- Workspaces
- Meetings
- Participants
- Recordings

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Follow the monorepo structure and conventions
2. Use the shared ESLint and TypeScript configurations
3. Run tests and linting before committing
4. Follow conventional commit messages

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Stream Video Documentation](https://getstream.io/video/docs)
