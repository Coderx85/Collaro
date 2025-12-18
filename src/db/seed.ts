import { reset } from "drizzle-seed";
import { db } from "@/db/client";
import {
  usersTable,
  workspacesTable,
  membersTable,
  type CreateUserType,
  type CreateWorkspaceType,
  pgUserRole,
} from "@/db/schema/schema";
import { auth } from "@/lib/auth-config";
import { config } from "@/lib/config";

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
    createdBy: "admin", // This user will be the creator/owner
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
    role: "member", // Note: Creator is always admin, so this might be redundant if this user is createdBy
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
  // Note: Drizzle Seed reset does not automatically clear auth tables like 'session' if not passed
  // But cascading deletes from users should handle it if schemas are correct.
};

async function seed() {
  try {
    console.log("Starting database seed...");

    // 1. Reset Database
    // We wrapped in try/catch because sometimes reset fails on foreign keys if not ordered or if tables locked
    await reset(db, tablesToReset);
    console.log("Database reset complete.");

    // Store user session tokens and IDs for later use
    const userSessionMap = new Map<string, string>(); // userName -> sessionToken
    const userIdMap = new Map<string, string>(); // userName -> userId
    const userEmailMap = new Map<string, string>(); // userName -> email

    // 2. Create Users
    console.log("Creating users...");
    for (const seedUser of users) {
      const response = await auth.api.signUpEmail({
        body: {
          email: seedUser.email,
          password: seedUser.password || "password",
          name: seedUser.name,
          userName: seedUser.userName,
        },
      });

      const safeResponse = response as any;
      if (
        !safeResponse?.user ||
        (!safeResponse?.session && !safeResponse?.token)
      ) {
        console.error(
          "SignUp Response:",
          JSON.stringify(safeResponse, null, 2)
        );
        throw new Error(`Failed to create user ${seedUser.userName}`);
      }

      const sessionToken = safeResponse.token || safeResponse.session?.token;
      if (!sessionToken) {
        throw new Error(`Session token missing for ${seedUser.userName}`);
      }

      userSessionMap.set(seedUser.userName, sessionToken);
      userIdMap.set(seedUser.userName, response.user.id);
      userEmailMap.set(seedUser.userName, seedUser.email);
      console.log(`Created user: ${seedUser.userName}`);
    }

    // Store workspace IDs mapped by slug
    const workspaceIdMap = new Map<string, string>(); // slug -> workspaceId
    const workspaceOwnerMap = new Map<string, string>(); // slug -> ownerUserName

    // 3. Create Workspaces
    console.log("Creating workspaces...");
    for (const workspace of workspaces) {
      if (!workspace.createdBy) {
        console.warn(
          `Skipping workspace ${workspace.name}: No createdBy user specified.`
        );
        continue;
      }

      const ownerToken = userSessionMap.get(workspace.createdBy);
      if (!ownerToken) {
        console.error(
          `Cannot create workspace ${workspace.name}: Creator ${workspace.createdBy} not found.`
        );
        continue;
      }

      // Create Organization explicitly specifying userId (server-side mode)
      const creatorId = userIdMap.get(workspace.createdBy);

      const newOrg = await auth.api.createOrganization({
        body: {
          userId: creatorId, // Specify creator explicitly
          name: workspace.name,
          slug: workspace.slug,
          logo: workspace.logo || "",
        },
      });

      if (!newOrg) {
        throw new Error(`Failed to create workspace ${workspace.name}`);
      }

      workspaceIdMap.set(workspace.slug, newOrg.id);
      workspaceOwnerMap.set(workspace.slug, workspace.createdBy);
      console.log(
        `Created workspace: ${workspace.name} by ${workspace.createdBy} `
      );
    }

    // 4. Assign Members
    console.log("Assigning members...");
    for (const assignment of workspaceAssignments) {
      const workspaceId = workspaceIdMap.get(assignment.workspaceSlug);
      const ownerUserName = workspaceOwnerMap.get(assignment.workspaceSlug);
      const ownerToken = ownerUserName
        ? userSessionMap.get(ownerUserName)
        : null;

      if (!workspaceId || !ownerToken) {
        console.warn(
          `Skipping assignment for ${assignment.userName} in ${assignment.workspaceSlug}: Workspace or Owner not found.`
        );
        continue;
      }

      // Skip if the user is the creator (they are already added)
      if (assignment.userName === ownerUserName) {
        // console.log(`Skipping explicit assignment for creator ${assignment.userName}`);
        // But we DO ensuring the role is correct.
        // Logic: createOrganization sets role to 'admin' (via creatorRole config)
        // So we are good.
        continue;
      }

      const userId = userIdMap.get(assignment.userName);
      if (!userId) {
        console.warn(`User ID not found for ${assignment.userName}`);
        continue;
      }

      // Add member to organization using the Owner's session
      try {
        const result = await auth.api.addMember({
          headers: {
            cookie: `better-auth.session_token=${ownerToken}`,
            origin: config.betterAuthUrl,
          },
          body: {
            organizationId: workspaceId,
            userId: userId, // Use userId instead of email
            role: "member",
          },
        });
        if (result) {
          console.log(result);
        }
        console.log(
          `Added ${assignment.userName} to ${assignment.workspaceSlug} as ${assignment.role}`
        );
      } catch (error: unknown) {
        console.error(
          `Failed to add member ${assignment.userName} to ${assignment.workspaceSlug}:`,
          error
        );
      }
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  void seed();
}

export default seed;
