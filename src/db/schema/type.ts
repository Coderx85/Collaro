// Import meeting status enum
import { session, account, verification } from "./auth-schema";
// Import table schemas
import {
  workspaceMeetingTable,
  workspacesTable,
  meetingParticipantsTable,
  membersTable,
  usersTable,
  pgParticipantStatus,
  pgUserRole,
  pgMeetingStatus,
  pgJoinRequestStatus,
  notificationsTable,
  workspaceRequestTable,
} from "./schema";

// Drizzle-Zod schema creators
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Import zod for schema definitions
import z from "zod";

export type NewSession = typeof session.$inferInsert;
export type NewAccount = typeof account.$inferInsert;
export type NewVerification = typeof verification.$inferInsert;

export type CreateMeetingType = typeof workspaceMeetingTable.$inferInsert;
export type CreateWorkspaceType = typeof workspacesTable.$inferInsert;
export type CreateMemberType = typeof membersTable.$inferInsert;
export type CreateUserType = typeof usersTable.$inferInsert;
export type CreateParticipantType =
  typeof meetingParticipantsTable.$inferInsert;

export type SelectMemberType = typeof membersTable.$inferSelect;
export type SelectMeetingType = typeof workspaceMeetingTable.$inferSelect;
export type SelectWorkspaceType = typeof workspacesTable.$inferSelect;
export type SelectUserType = typeof usersTable.$inferSelect;
export type SelectParticipantType =
  typeof meetingParticipantsTable.$inferSelect;
export type SelectNotificationType = typeof notificationsTable.$inferSelect;

export const UserRole = pgUserRole.enumValues;
export const MeetingStatus = pgMeetingStatus.enumValues;
export const ParticipantStatus = pgParticipantStatus.enumValues;
export const JoinRequestStatus = pgJoinRequestStatus.enumValues;

export const CreateUserSchema = createInsertSchema(usersTable, {
  password: z.string().min(6),
  userName: z.string().min(6, "User Name is required"),
  name: z.string().min(6, "Name is required"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is required"),
})
  .omit({
    createdAt: true,
    updatedAt: true,
    emailVerified: true,
    id: true,
  })
  .extend({
    confirmPassword: z.string().min(6, "Must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserSchema = createUpdateSchema(usersTable, {
  userName: z.string().min(6, "User Name must be at least 6 characters").optional(),
  name: z.string().min(6, "Name must be at least 6 characters").optional(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be valid").optional(),
}).omit({
  password: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
  id: true,
});

export const CreateWorkspaceSchema = createInsertSchema(workspacesTable);

export const UpdateWorkspaceSchema = createUpdateSchema(workspacesTable, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  logo: z.string().url("Logo must be a valid URL").optional(),
  updatedAt: z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

export const SelectUserSchema = createSelectSchema(usersTable, {
  password: z.string().min(6),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const SelectCallSchema = createSelectSchema(workspaceMeetingTable);

export const SelectCallMember = createSelectSchema(membersTable);

export const UpdateMeetingSchema = createUpdateSchema(workspaceMeetingTable, {
  status: z.enum(MeetingStatus),
  endAt: z.date(),
}).omit({
  meetingId: true,
  workspaceId: true,
  hostedBy: true,
  createdAt: true,
});

export const SelectJoinRequestSchema =
  createSelectSchema(workspaceRequestTable).strict();
export type SelectJoinRequestType = z.infer<typeof SelectJoinRequestSchema>;

export const SelectNotificationSchema = createSelectSchema(notificationsTable);

export const createNotificationSchema = createInsertSchema(notificationsTable, {
  type: z.string().min(1, "Type is required"),
  message: z.string().min(1, "Message is required"),
  userId: z.string().min(1, "User ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export const createMemberSchema = createInsertSchema(membersTable, {
  id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  role: z.enum(UserRole),
  createdAt: z.date(),
}).omit({
  updatedAt: true,
});