import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

/**
 * Access Control Configuration for Collaro
 *
 * This file defines the permission statements and roles for the application.
 * The access control system is used by better-auth's organization plugin.
 */

/**
 * Permission Statements
 *
 * Defines resources and their available actions.
 * We merge with defaultStatements to keep better-auth's built-in permissions
 * for organization, member, and invitation resources.
 */
const statement = {
  ...defaultStatements,
  // Workspace-specific permissions (maps to organization in better-auth)
  workspace: ["update", "delete"],
  // Meeting permissions
  meeting: ["create", "update", "delete"],
} as const;

/**
 * Access Control Instance
 *
 * Created from the statement object, used to define roles and check permissions.
 */
export const ac = createAccessControl(statement);

/**
 * Role Definitions
 *
 * Each role defines what permissions it has for each resource.
 * We extend the default role permissions from better-auth.
 */

// Owner: Full control over everything
export const owner = ac.newRole({
  ...ownerAc.statements,
  workspace: ["update", "delete"],
  meeting: ["create", "update", "delete"],
});

// Admin: Full control except deleting workspace
export const admin = ac.newRole({
  ...adminAc.statements,
  workspace: ["update"],
  meeting: ["create", "update", "delete"],
});

// Member: Limited permissions - can only create meetings
export const member = ac.newRole({
  ...memberAc.statements,
  meeting: ["create"],
});

/**
 * Export all roles for use in auth configuration
 */
export const roles = {
  owner,
  admin,
  member,
};
