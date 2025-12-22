"use client";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";

type org = {
  data?: any;
  error?: string;
};

const ProfileCard = () => {
  const { data: session } = useSession();
  const [org, setOrg] = useState<org>({});
  const [memberRole, setMemberRole] = useState<{ role?: string }>({});

  useEffect(() => {
    const fetchMember = async () => {
      const result = await authClient.organization.getActiveMemberRole();
      if (result.data) {
        setMemberRole({ role: result.data.role });
      }
    };
    fetchMember();
  }, []);

  useEffect(() => {
    const fetchOrg = async () => {
      const orgData = await authClient.organization.getFullOrganization();
      setOrg({ data: orgData.data });
    };
    fetchOrg();
  }, []);

  return (
    <div className="w-1/2 xl:p-2 px-3 py-4">
      <div className="flex flex-col justify-between">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage
              src={
                session?.user?.image ||
                `https://gravatar.com/avatar/${session?.user?.id}`
              }
              alt={session?.user?.name}
              height={75}
              width={75}
            />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-white font-bold text-lg xl:text-2xl">
              {session?.user?.name}
            </h1>
            <p className="italic text-white/75 text-xs xl:text-sm">
              @{session?.user?.userName || session?.user?.name}
            </p>
            {org?.data && (
              <p className="text-white/75 mt-2.5 text-xs xl:text-lg">
                Team: {org?.data?.name}
              </p>
            )}
            {memberRole && (
              <p className="text-white/75 mt-2.5 text-xs xl:text-lg">
                Role: {memberRole?.role}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 items-start justify-center">
          <p className="text-white text-xs xl:text-lg">
            Email:{" "}
            <span className="text-white/75 text-xs xl:text-lg">
              {session?.user?.email}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
