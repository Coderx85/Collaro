import { TooltipProvider } from "@radix-ui/react-tooltip";
import { currentUser } from "@clerk/nextjs/server";
import LeaveTeamButton from "../_components/LeaveButton";
import Image from "next/image";
import Navlink from "./_components/navlink";
import { SidebarProps } from "@/types";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { FaDotCircle } from "react-icons/fa";

const Sidebar = async ({ params }: SidebarProps) => {
  const { workspaceId } = await params;
  const user = await currentUser();

  const role =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "owner"
      ? "admin"
      : "member";

  return (
    <section className="hidden xl:flex xl:flex-col xl:fixed left-0 top-0 h-full w-50 bg-gray-900 dark:bg-gray-600/50 text-white">
      <div className="flex items-center` gap-2 justify-self-start p-4.5">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="collaro logo"
          className="max-sm:size-10"
        />
        <p className="group text-3xl font-extrabold text-white duration-75 hover:text-white max-sm:hidden">
          Co<span className="text-primary">llaro</span>
        </p>
      </div>
      <div className="flex items-center justify-center p-2">
        <OrganizationSwitcher hidePersonal hideSlug>
          <OrganizationSwitcher.OrganizationProfileLink
            label="Homepage"
            url="/"
            labelIcon={<FaDotCircle />}
          />
        </OrganizationSwitcher>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 overflow-y-auto">
        <TooltipProvider>
          <Navlink role={role} workspaceId={workspaceId} />
        </TooltipProvider>
      </div>

      <LeaveTeamButton />
    </section>
  );
};

export default Sidebar;
