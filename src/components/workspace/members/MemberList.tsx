"use client";

import { useState, useEffect } from "react";
import DirectCallButton from "@/components/workspace/calls/DirectCallButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { IMemberDTO } from "@/types";
import Loader from "@/components/Loader";
import { getWorkspaceUsers } from "@/action";

const MemberList = ({ organisationSlug }: { organisationSlug: string }) => {
  const [members, setMembers] = useState<IMemberDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      const res = await getWorkspaceUsers(organisationSlug);

      if (!res.success) {
        console.error("Failed to fetch members:", res.error);
        setIsLoading(false);
        return;
      }

      setMembers(res.data.members);
      setIsLoading(false);
    };

    fetchMembers();
  }, [organisationSlug]);

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members?.map((member) => (
        <Card key={String(member.id)} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                </div>
              </div>

              <DirectCallButton memberId={String(member.id)} memberName={member.name} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MemberList;
