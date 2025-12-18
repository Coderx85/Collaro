import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import Image from "next/image";
import Usercall from "./_components/usercall";
import { WeeklyMeetingsChart } from "@/components/charts/WeeklyMeetingsChart";
import { DailyMeetingsChart } from "@/components/charts/DailyMeetingsChart";

const User = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  return (
    <div>
      <div className="grid grid-cols-2 w-full gap-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <Image
          src={user?.image || "/images/avatar-1.jpeg"}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-sm block w-2/5 mx-auto"
          style={{ aspectRatio: "1/1" }}
        />
        <div className="flex flex-col start-0 w-3/5 justify-center items-start gap-2">
          <h1 className="text-4xl text-black dark:text-white">{user?.name}</h1>
          <h2 className="text-md italic">@{user?.userName || user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full h-full gap-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 mt-4">
        <WeeklyMeetingsChart />
        <DailyMeetingsChart />
      </div>
      <Usercall />
      <div className="flex flex-col gap-2">
        <div></div>
      </div>
    </div>
  );
};

export default User;
