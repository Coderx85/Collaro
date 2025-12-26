# Workspace & Schema Workflow Guide

This document outlines the architectural flow for the workspace module located at `@src/app/(root)/(dashboard)/workspace/[slug]/**` and the underlying database schema at `@src/db/schema/**`.

---

## 1. Database Schema Overview (`@src/db/schema/**`)

The application uses **Drizzle ORM** with **PostgreSQL**.

### **Core Tables**

- **`usersTable`**: Stores user identity (name, email, password, etc.).
- **`workspacesTable`**:
  - `id`: UUID (Primary Key).
  - `name`: Unique workspace name.
  - `slug`: Unique URL-friendly identifier (used in routes).
  - `logo`: Optional URL.
  - `createdBy`: Reference to the creator.
- **`membersTable`**:
  - Links `usersTable` and `workspacesTable`.
  - `role`: Enum (`owner`, `admin`, `member`).
  - **Constraints**: A user can only be a member of a workspace once (`uniqueIndex` on `userId` + `workspaceId`).
- **`invitationTable`**:
  - Manages pending invites to workspaces.
  - `status`: `pending` (default).
  - `role`: Role assigned upon acceptance.
- **`workspaceMeetingTable`**:
  - Stores meetings scoped to a workspace.
  - `hostedBy`: User who created the meeting.

### **Auth Schema (`auth-schema.ts`)**
- Tables required by `better-auth`: `session`, `account`, `verification`.

---

## 2. Workspace Route Workflow (`/workspace/[slug]`)

### **A. Route Structure**
The workspace pages are nested under `(root)/(dashboard)/workspace/[slug]`.

- **Layout (`layout.tsx`)**:
  - **Providers**: Wraps children in `StreamVideoProvider` (video calls) and `SidebarProvider` (UI state).
  - **Structure**:
    - `AppSidebar`: Main left-hand navigation.
    - `SidebarInset`: Main content area wrapper.
    - `@navbar`: Parallel route rendering the top header.
    - `children`: The main page content.

### **B. Access Control & Authorization**
Authentication and authorization are handled in `@src/lib/workspace-auth.ts`.

1. **Entry Check (`checkWorkspaceAccess`)**:
   - Called in `page.tsx` (Server Component).
   - **Step 1**: Verifies a valid session exists.
   - **Step 2**: Queries `workspacesTable` to confirm the workspace exists by `slug`.
   - **Step 3**: Calls `auth.api.listOrganizations` (Better Auth) to get the user's memberships.
   - **Step 4**: Validates that the user is a member of the target workspace.
   - **Result**: Redirects to `/auth/login` (no session), `404` (not found), or `/forbidden` (no access).

2. **Role-Based Permissions**:
   - Helper functions (`canUpdateWorkspace`, `canDeleteWorkspace`, `canManageMembers`) check specific permissions using `auth.api.hasPermission`.

### **C. Navbar Logic (`@navbar/page.tsx`)**
The navbar is a **Client Component** that manages context synchronization.

- **State Sync**:
  - Reads the `slug` from the URL parameters.
  - Fetches the user's organizations list.
  - **Effect**: If the current URL slug does not match the active organization in `better-auth`, it automatically updates the active organization using `authClient.organization.setActive`.
- **UI Elements**:
  - `SidebarTrigger`: Toggles the responsive sidebar.
  - `OrgSwitcher`: Allows users to switch between workspaces.
  - `Breadcrumb`: Dynamic navigation path based on the current route.

### **D. Main Dashboard (`page.tsx`)**
- Displays the workspace overview.
- **Features**:
  - Current time/date.
  - `ProfileCard`: User summary.
  - `MeetingTypeList`: Interactive list/grid for meeting actions (join, start, schedule).

---

## 3. Key Dependencies

- **Better Auth**: Handles session management, organization logic, and permissions.
- **Drizzle ORM**: Database interactions and schema definitions.
- **Stream Video SDK**: Powers the video calling features provided in the `StreamVideoProvider`.
- **Shadcn UI**: Provides the base UI components (`Sidebar`, `Breadcrumb`, etc.).
