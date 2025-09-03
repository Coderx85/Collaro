# @repo/database

Shared database package for the Collaro monorepo. Provides database configuration, schema definitions, and utilities using Drizzle ORM.

## Overview

This package contains:
- Database schema definitions
- Drizzle ORM configuration
- Migration files
- Database utilities and helpers
- Type-safe database operations

## Tech Stack

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Migration Tool**: Drizzle Kit
- **TypeScript**: Full type safety

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspaces. No manual installation required.

## Usage

### Importing the Database Instance

```typescript
import { db } from '@repo/database';
```

### Using the Schema

```typescript
import { users, meetings } from '@repo/database/schema';

// Query examples
const user = await db.select().from(users).where(eq(users.id, userId));
const newMeeting = await db.insert(meetings).values({
  title: 'Team Standup',
  workspaceId: workspaceId,
  startTime: new Date(),
}).returning();
```

### Type Safety

All database operations are fully type-safe:

```typescript
import type { User, Meeting } from '@repo/database/schema';

function createUser(userData: Omit<User, 'id' | 'createdAt'>) {
  return db.insert(users).values(userData).returning();
}
```

## Database Schema

### Core Tables

- **users**: User accounts and profiles
- **workspaces**: Collaborative workspaces
- **meetings**: Video conference meetings
- **participants**: Meeting participants
- **recordings**: Meeting recordings

### Relationships

- Users can belong to multiple workspaces
- Workspaces can have multiple meetings
- Meetings can have multiple participants
- Meetings can have multiple recordings

## Migration Management

### Generate Migrations

```bash
pnpm db:generate
```

### Apply Migrations

```bash
pnpm db:migrate
```

### Push Schema Changes

```bash
pnpm db:push
```

### View Database

```bash
pnpm db:studio
```

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string

## Best Practices

1. **Type Safety**: Always use the generated types from the schema
2. **Transactions**: Use transactions for multi-step operations
3. **Indexing**: Add appropriate indexes for frequently queried fields
4. **Migrations**: Always generate and test migrations before deploying
5. **Connection Pooling**: The database instance handles connection pooling automatically

## Development

### Adding New Tables

1. Define the table in `schema.ts`
2. Export the table from `index.ts`
3. Generate and run migrations
4. Update the application code to use the new table

### Modifying Existing Tables

1. Update the table definition in `schema.ts`
2. Generate migrations
3. Test the migration thoroughly
4. Update dependent code

## Troubleshooting

### Common Issues

- **Connection Errors**: Check DATABASE_URL format and credentials
- **Migration Failures**: Ensure schema changes are compatible
- **Type Errors**: Regenerate types after schema changes

## Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
