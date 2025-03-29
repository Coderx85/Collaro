"use client";
import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useWorkspaceStore } from "@/store/workspace";

const ProfileCard = () => {
  const { user } = useUser();
  const { workspaceName, members } = useWorkspaceStore();
  const { role } = user?.publicMetadata as UserPublicMetadata;

  return (
    <div className="dark:bg-gradient-to-br w-1/2 xl:p-2 px-3 py-4">
      <div className="flex flex-col justify-between">
        <div className="flex items-center">
          <Image
            src={user?.imageUrl || ""}
            width={75}
            height={75}
            alt="Profile-png"
            className="rounded-xs"
          />
          <div className="ml-4">
            <h1 className="dark:text-white text-gray-800 font-bold text-lg xl:text-2xl">
              {user?.fullName}
            </h1>
            <p className="italic text-black dark:text-white/75 text-xs xl:text-sm">
              @{user?.username}
            </p>
            <p className="text-black dark:text-white/75 mt-2.5 text-xs xl:text-lg">
              Team: {workspaceName}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 items-start justify-center">
          <p className="text-black dark:text-white text-xs xl:text-lg">
            Email:{" "}
            <span className="text-gray-700/75 dark:text-white/75 text-xs xl:text-lg">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <br />
            Role:{" "}
            <span className="ml-2 text-gray-700/75 dark:text-white/75 text-xs xl:text-lg">
              {role?.toUpperCase()}
            </span>
            <br />
            Clerk ID:{" "}
            <span className="text-gray-700/75 dark:text-white/75 text-xs xl:text-lg">
              {user?.id}
            </span>
            <br />
          </p>
          {/* <p>{workspaceId}</p> */}
          {role === "admin" && members && (
            <p>
              Members: <br />
              {members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
