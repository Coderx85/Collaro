import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Usercall from "./_components/usercall";
import { WeeklyMeetingsChart } from "@/components/charts/WeeklyMeetingsChart";
import { DailyMeetingsChart } from "@/components/charts/DailyMeetingsChart";

const User = async () => {
  const user = await currentUser();
  return (
    <div>
      <div className="grid grid-cols-2 w-full gap-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <Image
          src={user?.imageUrl || ""}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-sm block w-2/5 mx-auto"
          style={{ aspectRatio: "1/1" }}
        />
        <div className="flex flex-col start-0 w-3/5 justify-center items-start gap-2">
          <h1 className="text-4xl text-black dark:text-white">
            {user?.fullName}
          </h1>
          <h2 className="text-md italic">@{user?.username}</h2>
          <p className="text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-muted-foreground">
            {user?.phoneNumbers[0]?.phoneNumber}
          </p>
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
