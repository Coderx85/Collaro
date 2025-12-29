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
  // Organization/Workspace permissions (maps to organization in better-auth)
  // Actions: create, delete, update, view
  organization: ["create", "delete", "update", "view"],
  // Meeting permissions
  meeting: ["create", "update", "delete", "view", "stats"],
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
  organization: ["create", "delete", "update", "view"],
  meeting: ["create", "update", "delete"],
});

// Admin: Full control except deleting organization
export const admin = ac.newRole({
  ...adminAc.statements,
  // Admins can create, update, and view organizations but cannot delete
  organization: ["create", "update", "view"],
  meeting: ["create", "update", "delete"],
});

// Member: Limited permissions - can view organizations and create/manage meetings
export const member = ac.newRole({
  ...memberAc.statements,
  // Members can create and view organizations but cannot delete or update
  organization: ["create", "view"],
  meeting: ["create", "update", "delete"],
});

/**
 * Export all roles for use in auth configuration
 */
export const roles = {
  owner,
  admin,
  member,
};
