import { TCreateUserInput } from "@/types";
import { User } from "@collaro/user";
import { WorkspaceMemberManager } from "./index";
import { generateUserName } from "@collaro/utils/generate";

const workspaceMemberManager = WorkspaceMemberManager.getInstance();
const userService = new User();

// Create a new user to be added as a member to the workspace
const newUser = await userService.createUser({
  name: "Jane Doe",
  email: "jane.doe@example.com",
  password: "securepassword",
  userName: "janedoe",
}); 

// Create a new workspace
const workspace = await workspaceMemberManager.createWorkspace({
  name: "Project Alpha",
  description: "Workspace for Project Alpha",
  slug: "project-alpha",
  ownerId: newUser.id,
});

const secondUserInput: TCreateUserInput = {
  name: "Bob Smith",
  email: "bob.smith@example.com",
  password: "securepassword",
  userName: generateUserName("Bob Smith"),
}

const secondUser = await userService.createUser(secondUserInput);

workspaceMemberManager.joinWorkspace({ userId: secondUser.id, workspaceId: workspace.id, role: "admin" });

console.log("Added member details:", secondUser);

workspaceMemberManager.listMembers(workspace.id);