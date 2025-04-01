import { TooltipProvider } from "@radix-ui/react-tooltip";
import { currentUser } from "@clerk/nextjs/server";
import LeaveTeamButton from "../_components/LeaveButton";
import Image from "next/image";
import Navlink from "./_components/items";
import AlertButton from "../_components/AlertButton";
import { SidebarProps } from "@/types";

const Sidebar = async ({ params }: SidebarProps) => {
  const { workspaceId } = await params;
  const user = await currentUser();

  const role = user?.publicMetadata?.role === "admin" ? "admin" : "member";

  return (
    <section className="hidden xl:flex xl:flex-col xl:fixed left-0 top-0 h-full w-50 bg-gray-900 dark:bg-gray-600/50 text-white">
      <div className="flex items-center gap-2 justify-self-start p-4.5">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="group text-[26px] font-extrabold text-white duration-75 hover:text-white max-sm:hidden">
          Devn<span className="text-primary">Talk</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 overflow-y-auto">
        <TooltipProvider>
          <AlertButton />
          <Navlink role={role} workspaceId={workspaceId} />
        </TooltipProvider>
      </div>

      <LeaveTeamButton />
    </section>
  );
};

export default Sidebar;
