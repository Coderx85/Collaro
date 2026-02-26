"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/Loader";
import {
  acceptInvitation,
  getInvitationById,
} from "@/action/invitation.actions";
import { authClient } from "@/lib/auth-client";

interface AcceptInviteFormProps {
  invitationId: string;
}

export function AcceptInviteForm({ invitationId }: AcceptInviteFormProps) {
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitation = async () => {
      const result = await getInvitationById(invitationId);
      if (result.success) {
        setInvitation(result.data);
      } else {
        setError(result.error || "Failed to load invitation");
      }
      setLoading(false);
    };

    fetchInvitation();
  }, [invitationId]);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);

    const result = await acceptInvitation(invitationId);
    if (result.success) {
      // Redirect to the workspace
      router.push(`/workspace/${result.data?.workspaceSlug}`);
    } else {
      setError(result.error || "Failed to accept invitation");
    }
    setAccepting(false);
  };

  const handleSignUp = () => {
    // Redirect to sign up with invitation context
    router.push(`/auth/signup?invite=${invitationId}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!invitation) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invitation not found</AlertDescription>
      </Alert>
    );
  }

  if (invitation.isExpired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitation Expired</CardTitle>
          <CardDescription>
            This invitation has expired. Please contact the workspace admin for
            a new invitation.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitation Already Used</CardTitle>
          <CardDescription>
            This invitation has already been {invitation.status}.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const isCorrectUser = isLoggedIn && session.user.email === invitation.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join {invitation.workspaceName}</CardTitle>
        <CardDescription>
          {invitation.inviterName} invited you to join as {invitation.role}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          isCorrectUser ? (
            <Button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full"
            >
              {accepting ? "Accepting..." : "Accept Invitation"}
            </Button>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                This invitation was sent to {invitation.email}, but you're
                logged in as {session.user.email}. Please log out and sign in
                with the correct account, or sign up with the invited email.
              </AlertDescription>
            </Alert>
          )
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              To accept this invitation, you need to sign up or sign in with{" "}
              {invitation.email}.
            </p>
            <Button onClick={handleSignUp} className="w-full">
              Sign Up to Accept
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AcceptInviteForm;
