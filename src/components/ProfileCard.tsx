'use client';
import React from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useWorkspaceStore } from '@/store/workspace';

const ProfileCard = () => {
  const { user } = useUser();
  const { workspaceName, workspaceId, members } = useWorkspaceStore();
  const { role } = user?.publicMetadata as UserPublicMetadata;

  return (
    <div className="bg-gradient-to-br from-gray-700 via-slate-700 to-gray-800 rounded-lg xl:p-5 px-3 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={user?.imageUrl || ''}
            width={50}
            height={50}
            alt="Profile-png"
            className="rounded-lg"
          />
          <div className="ml-4">
            <h1 className="text-white font-bold text-lg xl:text-2xl">{user?.fullName}</h1>
            <p className="text-white/75 text-xs xl:text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-white/75 text-xs xl:text-lg">{role}</p>
            <p className='text-white/75 text-xs xl:text-lg'>{workspaceName}</p>
            <p>{workspaceId}</p>
            {role === 'admin' && members && (
              <p>Members: <br/>{
                members.map((m) => (
                  <li key={m}>{m}</li>
                ))
              }</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
