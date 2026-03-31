import Link from "next/link";
import { JoinWorkspaceForm } from "@/components/form";

const JoinWorkspacePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <JoinWorkspaceForm />
    </div>
  );
};

export default JoinWorkspacePage;
