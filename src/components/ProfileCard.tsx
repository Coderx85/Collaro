"use client";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useWorkspaceStore } from "@/store/workspace";

const ProfileCard = () => {
  const { user } = useUser();
  const { workspaceName } = useWorkspaceStore();

  return (
    <div className="w-1/2 xl:p-2 px-3 py-4">
      <div className="flex flex-col justify-between">
        <div className="flex items-center">
          <Image
            src={user?.imageUrl || "/images/avatar-1.jpeg"}
            width={75}
            height={75}
            alt="Profile-png"
            className="rounded-xl"
          />
          <div className="ml-4">
            <h1 className="text-white font-bold text-lg xl:text-2xl">
              {user?.fullName}
            </h1>
            <p className="italic text-white/75 text-xs xl:text-sm">
              @{user?.username}
            </p>
            <p className="text-white/75 mt-2.5 text-xs xl:text-lg">
              Team: {workspaceName}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 items-start justify-center">
          <p className="text-white text-xs xl:text-lg">
            Email:{" "}
            <span className="text-white/75 text-xs xl:text-lg">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
