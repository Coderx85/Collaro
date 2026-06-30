import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconFloatNone } from "@tabler/icons-react";
export default function ForbiddenPage() {
  return (
    <Empty className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
      <EmptyHeader>
        <EmptyMedia>{/* <IconFloatNone /> */}</EmptyMedia>
        <EmptyTitle>403</EmptyTitle>
        <EmptyDescription>Access Forbidden</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have permission to access this workspace. Please contact
          the workspace administrator if you believe this is a mistake.
        </p>
        <a href="/workspace">
          <Button variant="destructive">Return to Dashboard</Button>
        </a>
      </EmptyContent>
    </Empty>
  );
}
