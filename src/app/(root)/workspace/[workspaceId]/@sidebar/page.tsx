import { TooltipProvider } from "@radix-ui/react-tooltip";
import Image from "next/image";
import Navlink from "./_components/navlink";
import { SidebarProps } from "@/types";
import { OrganizationSwitcher } from "@clerk/nextjs";

const Sidebar = async ({ params }: SidebarProps) => {
  const { workspaceId } = await params;

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
        <OrganizationSwitcher
          afterCreateOrganizationUrl={`/workspace/${workspaceId}`}
          afterSelectOrganizationUrl={`/workspace/${workspaceId}`}
          hidePersonal
          hideSlug
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 overflow-y-auto">
        <TooltipProvider>
          <Navlink role={"member"} workspaceId={workspaceId} />
        </TooltipProvider>
      </div>
    </section>
  );
};

export default Sidebar;
