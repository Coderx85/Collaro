import { TooltipProvider } from "@radix-ui/react-tooltip";
import Navlink from "./_components/navlink";
import { SidebarProps } from "@/types";
import Logo from "@/components/Logo";
import { OrganizationSwitcher } from "@clerk/nextjs";

const Sidebar = async ({ params }: SidebarProps) => {
  const { workspaceId } = await params;

  return (
    <section className="hidden xl:flex xl:flex-col xl:fixed left-0 top-0 h-full w-50 bg-gray-900 dark:bg-slate-800/75 text-white">
      <Logo />
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
