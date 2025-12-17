import { reset } from "drizzle-seed";
import { db } from "@/db/client";
import {
  usersTable,
  workspacesTable,
  membersTable,
  type CreateUserType,
  type CreateWorkspaceType,
  CreateMemberType,
} from "@/db/schema/schema";
import { sql } from "drizzle-orm/sql";

type WorkspaceUserRole = "admin" | "member";

type SeedUser = CreateUserType;
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
    email: "admin@example.com",
    password: "password",
  },
  {
    name: "Member User",
    userName: "member",
    email: "member@example.com",
    password: "password",
  },
  {
    name: "Guest User",
    userName: "guest",
    email: "guest@example.com",
    password: "gueest-password",
  },
  {
    name: "Test User",
    userName: "testuser",
    email: "testuser@example.com",
    password: "test-password",
  },
  {
    name: "Demo User",
    userName: "demouser",
    email: "demouser@example.com",
    password: "demo-password",
  },
  {
    name: "Sample User",
    userName: "sampleuser",
    email: "sampleuser@example.com",
    password: "sample-password",
  },
  {
    name: "Example User",
    userName: "exampleuser",
    email: "exampleuser@example.com",
    password: "example-password",
  },
  {
    name: "Outsider User",
    userName: "outsider",
    email: "outsider@example.com",
    password: "outsider-password",
  },
  {
    name: "New Avenger",
    userName: "newavenger",
    email: "newavenger@example.com",
    password: "avenger-password",
  },
  {
    name: "Multi Workspace User",
    userName: "multiworkspace",
    email: "multiworkspace@example.com",
    password: "multi-password",
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

const assignWorkspaceUsers: CreateMemberType[] = [
  ...workspaceAssignments.map((assignment) => ({
    userId:
      sql`(SELECT id FROM users WHERE user_name = ${assignment.userName})` as unknown as string,
    workspaceId:
      sql`(SELECT id FROM workspaces WHERE slug = ${assignment.workspaceSlug}) ` as unknown as string,
    role: assignment.role,
  })),
];

const tablesToReset = {
  users: usersTable,
  workspaces: workspacesTable,
  members: membersTable,
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
        const [inserted] = await tx
          .insert(usersTable)
          .values(seedUser)
          .returning();

        if (!inserted || !inserted.id || !inserted.userName) {
          throw new Error(`Failed to insert user ${seedUser.userName}`);
        }

        userMap.set(inserted.userName, inserted.id);
        userWorkspaceTargets.push({
          userId: inserted.id,
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
            `Workspace ${workspaceSlug} missing while updating ${userName}`
          );
          continue;
        }

        await tx.execute(
          sql`UPDATE users SET workspace_id = ${workspaceId} WHERE id = ${userId}`
        );
      }

      if (assignWorkspaceUsers.length > 0) {
        await tx.insert(membersTable).values(assignWorkspaceUsers);
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
