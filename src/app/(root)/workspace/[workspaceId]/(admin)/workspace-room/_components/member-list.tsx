"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUserRole } from "@/action";
import { User } from "@/types";

interface MemberListProps {
  users: User[];
  workspaceId: string;
}

export const MemberList = ({ users, workspaceId }: MemberListProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedUsers, setUpdatedUsers] = useState<User[]>(users);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUpdatedUsers(
      updatedUsers.map((user) => {
        if (user.id === userId && user.role !== "owner") {
          return { ...user, role: newRole };
        }
        return user;
      }),
    );
  };

  const saveChanges = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Find users whose roles have changed
      const changedUsers = updatedUsers.filter((updatedUser) => {
        // Skip owner roles
        if (updatedUser.role === "owner") return false;

        const originalUser = users.find((u) => u.id === updatedUser.id);
        return originalUser && originalUser.role !== updatedUser.role;
      });

      if (changedUsers.length === 0) {
        toast.info("No role changes detected");
        setEditMode(false);
        setIsSubmitting(false);
        return;
      }

      const results = await Promise.all(
        changedUsers.map(async (user) => {
          const result = await updateUserRole(user.id, workspaceId, user.role);
          return {
            userId: user.id,
            userName: user.name,
            success: result.success,
            error: result.error,
          };
        }),
      );

      // Check if all updates were successful
      const failures = results.filter((r) => !r.success);

      if (failures.length === 0) {
        toast.success("User roles updated successfully!");
        setEditMode(false);
      } else {
        // Show errors for failed updates
        const errorMessage = failures
          .map((f) => `${f.userName}: ${f.error}`)
          .join("; ");
        setError(`Failed to update some roles: ${errorMessage}`);
        toast.error("Some role updates failed");
      }
    } catch (error: any) {
      console.error("Failed to update roles:", error);
      toast.error("Failed to update user roles");
      setError(`${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Workspace Members</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="edit-mode">Edit Roles</Label>
          <Switch
            id="edit-mode"
            checked={editMode}
            onCheckedChange={setEditMode}
          />
        </div>
      </div>

      <Table className="border-2 border-gray-800 rounded-xs">
        <TableCaption>Workspace Users</TableCaption>
        <TableHeader className="bg-gray-800 rounded-xs">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell className="text-red-300">Role</TableCell>
            <TableCell>Joined At</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updatedUsers
            .sort((a) => (a.role === "owner" ? -1 : 1)) // Sort owners to the top
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>
                  {editMode ? (
                    user.role === "owner" ? (
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        {/* {user.role} */}
                        <span className="text-xs text-gray-400">
                          Cannot change the owner
                        </span>
                      </span>
                    ) : (
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  ) : (
                    <span
                      className={`
                    ${user.role === "admin" ? "text-green-500" : ""}
                    ${user.role === "member" ? "text-blue-500" : ""}
                    ${user.role === "owner" ? "text-amber-500" : ""}
                    font-semibold
                  `}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {typeof user.createdAt === "string"
                    ? user.createdAt.split("T")[0]
                    : String(user.createdAt).split("T")[0]}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {editMode && (
        <div className="flex justify-end">
          <Button
            onClick={saveChanges}
            disabled={isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};
