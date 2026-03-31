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
import { useToast } from "@/components/ui/use-toast";
import { getPendingJoinRequests, getCurrentAuthUser } from "@/action/workspace";
import {
  approveJoinRequestAction,
  rejectJoinRequestAction,
} from "@/action/notification";
import type { PendingRequest as JoinRequest } from "@/types";
import { Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toast } from "sonner";

interface PendingJoinRequestsProps {
  workspaceId: string;
}

export function PendingJoinRequests({ workspaceId }: PendingJoinRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleRoleChange = (requestId: string, role: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [requestId]: role,
    }));
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        const result = await getPendingJoinRequests(workspaceId);
        if (result.success && result.data && result.data.requests) {
          setRequests(result.data.requests);
        } else if (!result.success) {
          console.error("[PendingJoinRequests] Failed to fetch:", result.error);
          toast.success("No pending join requests found.");
        } else {
          console.error("[PendingJoinRequests] Unexpected result:", result);  
        }
      } catch (error) {
        toast.error("An error occurred while fetching join requests.");
        console.error("[PendingJoinRequests] Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequests();
  }, [workspaceId, toast]);

  async function handleApprove(requestId: string) {
    setProcessingIds((prev) => new Set([...prev, requestId]));
    try {
      const auth = await getCurrentAuthUser();
  
      if (!auth?.id) {
        console.error("[handleApprove] User not authenticated");
        toast.error("User not authenticated"  );
        return;
      }

      const result = await approveJoinRequestAction({
        requestId,
        responderId: auth.id,
      });
      
      if (result.success) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
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
    setProcessingIds((prev) => new Set([...prev, requestId]));
    try {
      console.log("[handleReject] Getting user session...");
      const authUser = await getCurrentAuthUser();

      if (!authUser?.id) {
        console.error("[handleReject] User not authenticated");
        toast.error("User not authenticated");

        return;
      }

      const result = await rejectJoinRequestAction({
        requestId,
        responderId: authUser.id,
      });
      console.log("[handleReject] Result:", result);
      
      if (result.success) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        toast.success(`Request rejected for ${result.data?.userName}`);
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
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {request.userFullName}
                      <p className="text-xs text-muted-foreground">
                        @{request.userName}
                      </p>
                    </TableCell>
                    <TableCell>{request.userEmail}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(request.requestedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <form onSubmit={
                        (e) => e.preventDefault()
                      } className="w-full">
                        <Select
                          value={selectedRoles[request.id]}
                          onValueChange={(value) => handleRoleChange(request.id, value)}
                        >
                          <SelectTrigger className="w-full">Select Role</SelectTrigger>  
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </form>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {handleApprove(request.id)}}
                        disabled={processingIds.has(request.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        {processingIds.has(request.id) ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(request.id)}
                        disabled={processingIds.has(request.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {processingIds.has(request.id) ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1">Reject</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
