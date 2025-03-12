"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LeaveTeamButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLeave = async () => {
      setLoading(true);

      const response = await fetch("/api/workspace/leave", { method: "POST" });
      const data = await response.json();
      
      if (!response.ok || response.status !== 200) {
        console.error(data.message);
        return toast.error(data.message);
      }

      setLoading(false);
      toast.success(data.message)
      router.push("/");
    
    };

  return (
    <Button variant="destructive" onClick={handleLeave} disabled={loading}>
      {loading ? "Leaving..." : "Leave Team"}
    </Button>
  );
};

export default LeaveTeamButton;
