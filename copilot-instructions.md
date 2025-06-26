The user provided the following instructions for this project:

# GitHub Copilot Instructions for the collaro project

## About This Project
`COllaro` is a platform for developers to connect, share knowledge, and discuss technology. The project is built using a modern web stack. Please adhere to the following guidelines when providing assistance.

## General Principles
- **Follow Existing Style:** Your suggestions should match the style and patterns of the surrounding code.
- **Clarity and Readability:** Prioritize writing clean, readable, and self-documenting code.
- **TypeScript First:** Always use TypeScript. Provide type definitions for all variables, function parameters, and return values. Avoid using `any` unless absolutely necessary.
- **Documentation:** Add JSDoc comments for all public functions, components, and complex logic. Explain the purpose, parameters, and return values.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS. UI components are built using **Shadcn/ui**.
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** Clerk
- **Testing:** Jest and React Testing Library for unit and integration tests.
- **Linting:** ESLint and Prettier are used for code formatting and quality. Ensure your suggestions are compliant.

## File and Folder Structure
- **Components:** Place all React components in `src/components/`.
  - Reusable, generic UI components, including those from **Shadcn/ui**, go in `src/components/ui/`.
  - Feature-specific components go in `src/components/features/<feature-name>/`.
- **Database:** Drizzle schema definitions should be located in `src/db/schema.ts`.
- **Business Logic:** Place business logic and database operations in service files within `src/lib/services/`.
- **API Routes:** All backend API logic resides in `src/app/api/`.
- **Utilities:** Helper functions and utilities should be in `src/lib/utils.ts`.
- **Types:** Global TypeScript types and interfaces should be defined in `src/types/`.

## Coding Conventions & Patterns
- **Component Naming:** Use PascalCase for component files and function names (e.g., `UserProfile.tsx`).
- **Function Naming:** Use camelCase for regular functions (e.g., `getUserData()`).
- **Class Merging:** Use the `cn` utility function from `lib/utils` for conditionally applying and merging Tailwind CSS classes, as is standard with Shadcn/ui.
- **Authentication:** Use Clerk's components (`<UserButton />`, `<SignIn />`) and hooks (`useUser`, `useAuth`) for managing user authentication on the frontend. Protect API routes and server-side pages using Clerk's middleware and helpers.
- **Database Queries:** Write all database interactions using Drizzle ORM. Use Drizzle Kit for generating and managing database migrations.
- **Imports:** Use absolute imports from the `src/` directory (e.g., `import { MyComponent } from '@/components/MyComponent'`).
- **Exports:**
  - **Use `default export` for Next.js pages, layouts, and route handlers** (`page.tsx`, `layout.tsx`, `route.ts`). This is required by the framework.
  - **Use `named exports` for all other components, utilities, and services.** This promotes consistency and clarity when importing.
    ```typescript
    // Good: in /components/ui/Button.tsx
    export const Button = ({...}) => { ... };
    ```
- **Service Layer Pattern:** Separate business logic from API route handlers. The route handler should only be responsible for handling the HTTP request/response and calling a service function.
  ```typescript
  // Example: in /app/api/users/route.ts
  import { createUser } from '@/lib/services/userService';

  export async function POST(req: Request) {
    const body = await req.json();
    // The route handler's job is to handle HTTP concerns.
    try {
      const newUser = await createUser(body); // Business logic is in the service.
      return Response.json(newUser, { status: 201 });
    } catch (error) {
      return Response.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }
  ```
- **Custom Hooks:** For client-side components, encapsulate complex state, data fetching, or side effects into custom hooks (e.g., `useUserData`).
- **Environment Variables:** Access environment variables through `process.env`. Prefix all public, browser-exposed variables with `NEXT_PUBLIC_`.

## Commit Messages
When suggesting commit messages, follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `style:` for code style changes (formatting, etc.).
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `test:` for adding or correcting tests.
- `chore:` for build process or auxiliary tool changes.

Example: `feat: add user
