import { reset } from "drizzle-seed";
import { db } from "@/db/client";
import {
  usersTable,
  workspacesTable,
  membersTable,
  type CreateUserType,
  type CreateWorkspaceType,
} from "@/db/schema/schema";
import { workspaceUserTable } from "@/db/schema/relations";
import { sql } from "drizzle-orm/sql";

type WorkspaceUserRole = "admin" | "member";

type SeedUser = CreateUserType & { workspaceSlug?: string };
type SeedWorkspace = Omit<CreateWorkspaceType, "id">;

type WorkspaceAssignment = {
  workspaceSlug: string;
  userName: string;
  role: WorkspaceUserRole;
};

const users: SeedUser[] = [
  {
    name: "Admin User",
    userName: "admin",
    clerkId: "clerk_admin",
    email: "admin@example.com",
    workspaceSlug: "avengers-workspace",
    role: "admin",
  },
  {
    name: "Member User",
    userName: "member",
    clerkId: "clerk_member",
    email: "member@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Guest User",
    userName: "guest",
    clerkId: "clerk_guest",
    email: "guest@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Test User",
    userName: "testuser",
    clerkId: "clerk_testuser",
    email: "testuser@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Demo User",
    userName: "demouser",
    clerkId: "clerk_demouser",
    email: "demouser@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Sample User",
    userName: "sampleuser",
    clerkId: "clerk_sampleuser",
    email: "sampleuser@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Example User",
    userName: "exampleuser",
    clerkId: "clerk_exampleuser",
    email: "exampleuser@example.com",
    workspaceSlug: "avengers-workspace",
    role: "member",
  },
  {
    name: "Outsider User",
    userName: "outsider",
    clerkId: "clerk_outsider",
    email: "outsider@example.com",
  },
  {
    name: "New Avenger",
    userName: "newavenger",
    clerkId: "clerk_newavenger",
    email: "newavenger@example.com",
    workspaceSlug: "new-avenger-workspace",
    role: "member",
  },
  {
    name: "Multi Workspace User",
    userName: "multiworkspace",
    clerkId: "clerk_multiworkspace",
    email: "multiworkspace@example.com",
    workspaceSlug: "multi-workspace-one",
    role: "admin",
  },
];

const workspaces: SeedWorkspace[] = [
  {
    name: "Avengers Workspace",
    slug: "avengers-workspace",
    createdBy: "admin",
  },
  {
    name: "New Avenger Workspace",
    slug: "new-avenger-workspace",
    createdBy: "newavenger",
  },
  {
    name: "Multi Workspace One",
    slug: "multi-workspace-one",
    createdBy: "multiworkspace",
  },
  {
    name: "Multi Workspace Two",
    slug: "multi-workspace-two",
    createdBy: "multiworkspace",
  },
];

const workspaceAssignments: WorkspaceAssignment[] = [
  { workspaceSlug: "avengers-workspace", userName: "admin", role: "admin" },
  {
    workspaceSlug: "new-avenger-workspace",
    userName: "newavenger",
    role: "member",
  },
  {
    workspaceSlug: "multi-workspace-one",
    userName: "multiworkspace",
    role: "admin",
  },
  {
    workspaceSlug: "multi-workspace-two",
    userName: "multiworkspace",
    role: "admin",
  },
];

const tablesToReset = {
  users: usersTable,
  workspaces: workspacesTable,
  members: membersTable,
  workspaceUsers: workspaceUserTable,
};

async function seed() {
  try {
    console.log("Starting database seed...");

    await reset(db, tablesToReset);

    await db.transaction(async (tx) => {
      const userMap = new Map<string, string>();
      const userWorkspaceTargets: Array<{
        userId: string;
        workspaceSlug?: string;
        userName: string;
      }> = [];

      for (const seedUser of users) {
        const { workspaceSlug, ...payload } = seedUser;
        const [inserted] = await tx
          .insert(usersTable)
          .values(payload)
          .returning();

        if (!inserted || !inserted.id || !inserted.userName) {
          throw new Error(`Failed to insert user ${seedUser.userName}`);
        }

        userMap.set(inserted.userName, inserted.id);
        userWorkspaceTargets.push({
          userId: inserted.id,
          workspaceSlug,
          userName: inserted.userName,
        });
      }

      const workspaceMap = new Map<string, string>();
      for (const workspace of workspaces) {
        const [inserted] = await tx
          .insert(workspacesTable)
          .values(workspace)
          .returning();

        if (!inserted || !inserted.id || !inserted.slug) {
          throw new Error(`Failed to insert workspace ${workspace.slug}`);
        }

        workspaceMap.set(inserted.slug, inserted.id);
      }

      for (const { userId, workspaceSlug, userName } of userWorkspaceTargets) {
        if (!workspaceSlug) {
          continue;
        }

        const workspaceId = workspaceMap.get(workspaceSlug);
        if (!workspaceId) {
          console.warn(
            `Workspace ${workspaceSlug} missing while updating ${userName}`,
          );
          continue;
        }

        await tx.execute(
          sql`UPDATE users SET workspace_id = ${workspaceId} WHERE id = ${userId}`,
        );
      }

      for (const assignment of workspaceAssignments) {
        const workspaceId = workspaceMap.get(assignment.workspaceSlug);
        const userId = userMap.get(assignment.userName);

        if (!workspaceId || !userId) {
          console.warn(
            `Skipping assignment for ${assignment.userName} -> ${assignment.workspaceSlug}`,
          );
          continue;
        }

        await tx.insert(workspaceUserTable).values({
          workspaceId,
          userId,
          role: assignment.role,
        });
      }
    });

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

if (import.meta.main) {
  void seed();
}

export default seed;
