"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace";
import DirectCallButton from "./DirectCallButton";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import Loader from "./Loader";

interface Member {
  id: string;
  name: string;
  imageUrl?: string;
}

const MemberList = () => {
  const [memberDetails, setMemberDetails] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { members, workspaceId } = useWorkspaceStore();

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!members || members.length === 0 || !workspaceId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch detailed member information from your API
        const response = await fetch(`/api/workspace/${workspaceId}/members`);
        if (!response.ok) throw new Error("Failed to fetch member details");

        const data = await response.json();
        console.log(`Response \n`, data);
        setMemberDetails(data.members);
      } catch (error) {
        console.error("Error fetching member details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberDetails();
  }, [members, workspaceId]);

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memberDetails.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar key={member.id}>
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                </div>
              </div>

              <DirectCallButton memberId={member.id} memberName={member.name} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MemberList;
