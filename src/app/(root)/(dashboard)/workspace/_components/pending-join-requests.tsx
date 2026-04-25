"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPendingJoinRequests } from "@/action/workspace";
import {
  approveJoinRequestAction,
  rejectJoinRequestAction,
} from "@/action/notification";
import type { JoinRequest, TInviteMemberRole, TMemberId, TWorkspaceId } from "@/types";
import { Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toast } from "sonner";
import { getMemberByIdAndSlug } from "@/action/member";
import { useSession } from "@/lib/auth";

interface PendingJoinRequestsProps {
  workspaceId: TWorkspaceId;
  workspaceSlug: string;
}

export function PendingJoinRequests({ workspaceId, workspaceSlug }: PendingJoinRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, "member" | "admin">>({});
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [memberId, setMemberId] = useState<TMemberId | undefined>(undefined);
  const { data: session, isPending: sessionLoading } = useSession();

  const handleRoleChange = (requestId: string, role: "member" | "admin") => {
    setSelectedRoles((prev) => ({
      ...prev,
      [requestId]: role,
    }));
  };

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    async function fetchRequests() {
      try {
        const result = await getPendingJoinRequests(workspaceId);

        if (!result || result.success === false) {
          console.error("[PendingJoinRequests] Failed to fetch:", result.error);
          toast.error("Failed to fetch pending join requests.");
          return;
        } 
        
        setRequests(result.data.requests);
        // Initialize selected roles with default "member" value
        const initialRoles: Record<string, "member" | "admin"> = {};
        result.data.requests.forEach((req) => {
          initialRoles[String(req.id)] = "member";
        });

        setSelectedRoles(initialRoles);

        if (!session?.user?.id) {
          throw new Error("User not authenticated");
        }

        const member = await getMemberByIdAndSlug(workspaceSlug, String(session.user.id)).catch((error) => {
          console.error("Error fetching member details:", error);
          toast.error("Failed to fetch your member details. Please try again.");
        });

        if (!member || !member.success || !member.data) {
          throw new Error("Member details not found for current user");
        }

        const memberId = member.data.id as unknown as TMemberId;

        setMemberId(memberId);

      } catch (error) {
        toast.error("An error occurred while fetching join requests.");
        console.error("[PendingJoinRequests] Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequests();
  }, [session?.user?.id, sessionLoading, workspaceId, workspaceSlug]);

  async function handleApprove(requestId: string) {
    if (!memberId) {
      toast.error("Your workspace membership is still loading.");
      return;
    }

    setProcessingIds((prev) => new Set([...prev, requestId]));
    try {
      const result = await approveJoinRequestAction({
        requestId,
        responderId: memberId!,
        workspaceId,
        role: selectedRoles[requestId],
      });
      
      if (result.success) {
        setRequests((prev) => prev.filter((req) => String(req.id) !== requestId));
        toast.success(`Request approved for ${result.data?.userName}`);
      } else {
        console.error("[handleApprove] Failed:", result.error);
        toast.error(result.error || "Failed to approve request");
      }
    } catch (error) {
      console.error("[handleApprove] Exception:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  }

  async function handleReject(requestId: string) {
    if (!memberId) {
      toast.error("Your workspace membership is still loading.");
      return;
    }

    setProcessingIds((prev) => new Set([...prev, requestId]));
    try {
      const result = await rejectJoinRequestAction({
        requestId,
        responderId: memberId!,
      });
      console.log("[handleReject] Result:", result);
      
      if (result.success) {
        setRequests((prev) => prev.filter((req) => String(req.id) !== requestId));
        toast.success(`Request rejected for ${result.data?.message}`);
      } else {
        console.error("[handleReject] Failed:", result.error);
        toast.error(result.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("[handleReject] Exception:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Join Requests
          </CardTitle>
          <CardDescription>
            Review and manage requests from users wanting to join
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Join Requests
          {requests.length > 0 && (
            <Badge variant="secondary">{requests.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Review and manage requests from users wanting to join
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pending requests</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const stringId = String(request.id);
                  return (
                  <TableRow key={stringId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {request.name}
                      <p className="text-xs text-muted-foreground">
                        @{request.user?.username}
                      </p>
                    </TableCell>
                    <TableCell>{request.user.email}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={selectedRoles[stringId] || ""}
                        onValueChange={(value) => handleRoleChange(stringId, value as TInviteMemberRole)}
                      >
                        <SelectTrigger className="w-full">
                          {selectedRoles[stringId] || "Select Role"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {handleApprove(stringId)}}
                        disabled={processingIds.has(stringId) || !memberId}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        {processingIds.has(stringId) ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(stringId)}
                        disabled={processingIds.has(stringId) || !memberId}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {processingIds.has(stringId) ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1">Reject</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  )}
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
