import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconSearchOff } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <Empty className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
      <EmptyHeader className="flex flex-col items-center justify-center gap-2">
        <EmptyMedia>
          <IconSearchOff />
        </EmptyMedia>
        <EmptyTitle>404</EmptyTitle>
        <EmptyDescription>Page Not Found</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p className="text-muted-foreground text-center max-w-md">
          The workspace or page you are looking for does not exist.
        </p>
        <a href="/workspace">
          <Button variant="default">Return to Dashboard</Button>
        </a>
      </EmptyContent>
    </Empty>
  );
}
