import { db } from "@/db/client";
import {
  type CreateUserType,
  type CreateWorkspaceType,
} from "@/db/schema/type";
import { auth } from "@/lib/auth/auth-server";
import { sql } from "drizzle-orm";
import { schema, authSchema } from ".";
import { TUserId, TWorkspaceId } from "@/types";
import { TInviteMemberRole, workspaceMemberManager } from "@/modules/member";

type SeedUser = CreateUserType;
type SeedWorkspace = Omit<CreateWorkspaceType, "id">;

type WorkspaceAssignment = {
  workspaceSlug: string;
  userName: string;
  role: TInviteMemberRole;
};

const USER_PASSWORD = "Collaro@123"; 

const systemUsers: SeedUser[] = [
  // System users
  {
    name: "System Owner",
    userName: "sys_owner",
    email: "sys_owner@example.com",
    password: USER_PASSWORD,
  },
  {
    name: "System Admin",
    userName: "sys_admin",
    email: "sys_admin@example.com",
    password: USER_PASSWORD,
  },
  {
    name: "System User",
    userName: "sys_user",
    email: "sys_user@example.com",
    password: USER_PASSWORD,
  },
];

const avengersUsers: SeedUser[] = [
  // Avengers themed users
  {
    name: "Tony Stark",
    userName: "iron_man",
    email: "tony@avengers.com",
    password: USER_PASSWORD,
  },
  {
    name: "Steve Rogers",
    userName: "captain_america",
    email: "steve@avengers.com",
    password: USER_PASSWORD,
  },
  {
    name: "Bruce Banner",
    userName: "hulk",
    email: "bruce@avengers.com",
    password: USER_PASSWORD,
  },
  { name: "Dead Pool",
    userName: "dead_pool",
    email: "dead@avengers.com",
    password: USER_PASSWORD,
  }
];

const justiceLeagueUsers: SeedUser[] = [
  // System users
  {
    name: "Bruce Wayne",
    userName: "batman",
    email: "bruce@justice.com",
    password: USER_PASSWORD,
  },
  // Justice League themed users
  {
    name: "Clark Kent",
    userName: "superman",
    email: "clark@justice.com",
    password: USER_PASSWORD,
  },
  {
    name: "Diana Prince",
    userName: "wonder_woman",
    email: "diana@justice.com",
    password: USER_PASSWORD,
  }, 
  {
    name: "Death Stroke",
    userName: "death_stroke",
    email: "death@justice.com",
    password: USER_PASSWORD,
  }
];

const workspaces: (SeedWorkspace & { creatorUserName: string })[] = [
  {
    creatorUserName: systemUsers[0].userName,
    name: "System Workspace",
    slug: "system-workspace",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    creatorUserName: avengersUsers[0].userName,
    name: "Avengers",
    slug: "avengers",
    logo: "",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    creatorUserName: justiceLeagueUsers[0].userName,
    name: "Justice League",
    slug: "justice-league",
    logo: "",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    creatorUserName: avengersUsers[1].userName,
    name: "Illuminati",
    slug: "illuminati",
    logo: "",
    createdAt: new Date(),
    updatedAt: null,

  }
];

const workspaceMembers: WorkspaceAssignment[] = [
  // Additional members with different roles - matching actual usernames in the database
  { workspaceSlug: "avengers", userName: "steve_rogers", role: "admin" },
  { workspaceSlug: "illuminati", userName: "wonder_woman", role: "member" },
];

// Custom reset function to truncate tables using raw SQL
// This works with both local pg Pool and Neon HTTP connections
async function resetTables() {
  await db.execute(sql`TRUNCATE TABLE "members" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "workspaces" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "meeting_participants" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "workspace_meetings" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "private_meetings" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "join_requests" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "invitation" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "notifications" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "session" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "account" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "verification" CASCADE`);
  await db.execute(sql`TRUNCATE TABLE "users" CASCADE`);
}

async function seed() {
  try {
    console.log("Starting database seed...");

    // 1. Reset Database using custom truncate function
    await resetTables();
    console.log("Database reset complete.");

    // Store user session tokens and IDs for later use
    const userSessionMap = new Map<string, TUserId>(); // userName -> sessionToken
    const userIdMap = new Map<string, TUserId>(); // userName -> userId
    const userEmailMap = new Map<string, string>(); // userName -> email

    // 2. Create Users
    console.log("Creating users...");
    for (const seedUser of systemUsers.concat(avengersUsers, justiceLeagueUsers)) {
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
          JSON.stringify(safeResponse, null, 2),
        );
        throw new Error(`Failed to create user ${seedUser.userName}`);
      }

      const sessionToken = safeResponse.token || safeResponse.session?.token;
      if (!sessionToken) {
        throw new Error(`Session token missing for ${seedUser.userName}`);
      }

      const userId = safeResponse.user.id  as TUserId;

      userSessionMap.set(seedUser.userName, sessionToken);
      userIdMap.set(seedUser.userName, userId);
      userEmailMap.set(seedUser.userName, seedUser.email);
      console.log(`Created user: ${seedUser.userName}`);
    }

    // Store workspace IDs mapped by slug
    const workspaceIdMap = new Map<string, TWorkspaceId>(); // slug -> workspaceId
    const workspaceOwnerMap = new Map<string, string>(); // slug -> ownerUserName

    // 3. Create Workspaces
    console.log("Creating workspaces...");
    for (const workspace of workspaces) {
      const createdWorkspaced = await workspaceMemberManager.createWorkspace({
        name: workspace.name,
        slug: workspace.slug,
        logoUrl: workspace.logo || "",
        ownerId: userIdMap.get(workspace.creatorUserName)!,
        description: `${workspace.name} description`,
      })

      workspaceIdMap.set(workspace.slug, createdWorkspaced.id);
    }

    // 4. Assign Members to Workspaces
    console.log("Assigning members to workspaces...");
    for (const assignment of workspaceMembers) {
      const workspaceId = workspaceIdMap.get(assignment.workspaceSlug);
      const userId = userIdMap.get(assignment.userName);

      if (!workspaceId || !userId) {
        console.error(`Invalid workspace slug or user name for assignment: ${assignment.workspaceSlug}, ${assignment.userName}`);
        continue;
      } 

      const newMember = await workspaceMemberManager.joinWorkspace({
        workspaceId,
        userId,
        role: assignment.role,
      });

      if (!newMember) {
        console.error(`Failed to assign user ${assignment.userName} to workspace ${assignment.workspaceSlug}`);
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
