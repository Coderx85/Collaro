import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/auth-config";
import {
  getInvitationById,
  acceptInvitation,
} from "@/action/invitation.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AcceptInvitePageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ workspaceSlug: string; workspaceId: string }>;
}

export default async function AcceptInvitePage({
  params,
  searchParams,
}: AcceptInvitePageProps) {
  const { token } = await params;
  const { workspaceSlug, workspaceId } = await searchParams;

  // Get invitation details
  const inviteResult = await getInvitationById(token);

  if (!inviteResult.success || !inviteResult.data) {
    return (
      <div className="min-h-screen flex items-center justify-center      from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md bg-white dark:bg-slate-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl dark:text-white">
              Invalid Invitation
            </CardTitle>
            <CardDescription>
              This invitation link is invalid or has been revoked.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invite = inviteResult.data;

  // Check if invitation is expired
  if (invite.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md bg-white dark:bg-slate-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-xl dark:text-white">
              Invitation Expired
            </CardTitle>
            <CardDescription>
              This invitation has expired. Please contact the workspace owner
              for a new invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if invitation was already used
  if (invite.status !== "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md bg-white dark:bg-slate-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl dark:text-white">
              Already Accepted
            </CardTitle>
            <CardDescription>
              This invitation has already been accepted. You can sign in to
              access the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href={`/workspace/${invite.workspaceSlug}`}>
                Go to Workspace
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is logged in, try to accept the invitation
  if (session?.user) {
    // Check if logged-in user email matches invitation email
    if (session.user.email === invite.email) {
      const acceptResult = await acceptInvitation(token);

      if (acceptResult.success && acceptResult.data) {
        redirect(`/workspace/${acceptResult.data.workspaceSlug}`);
      }

      // If accepting failed, show error
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl dark:text-white">
                Unable to Accept
              </CardTitle>
              <CardDescription>
                {acceptResult.error ||
                  "Something went wrong while accepting the invitation."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // User is logged in but with different email
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md bg-white dark:bg-slate-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Building2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-xl dark:text-white">
              Email Mismatch
            </CardTitle>
            <CardDescription>
              This invitation was sent to <strong>{invite.email}</strong>, but
              you're logged in as <strong>{session.user.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Please sign out and sign in with the correct email address, or ask
              the workspace owner to send a new invitation to your current
              email.
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/api/auth/sign-out">Sign Out</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is not logged in - show invitation details and prompt to sign up/in
  const signUpUrl = `/sign-up?email=${encodeURIComponent(invite.email)}&returnUrl=${encodeURIComponent(`/accept-invite/${token}?workspaceSlug=${workspaceSlug}&workspaceId=${workspaceId}`)}`;
  const signInUrl = `/sign-in?returnUrl=${encodeURIComponent(`/accept-invite/${token}?workspaceSlug=${workspaceSlug}&workspaceId=${workspaceId}`)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Building2 className="h-6 w-6 text-secondary dark:text-secondary" />
          </div>
          <CardTitle className="text-xl dark:text-white">
            You're Invited!
          </CardTitle>
          <CardDescription>
            <strong>{invite.inviterName}</strong> has invited you to join{" "}
            <strong>{invite.workspaceName}</strong> as a{" "}
            <span className="capitalize font-medium">{invite.role}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Invitation sent to:
            </p>
            <p className="font-medium dark:text-white">{invite.email}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={signUpUrl}>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={signInUrl}>Already have an account? Sign In</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This invitation expires on{" "}
            {new Date(invite.expiresAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
