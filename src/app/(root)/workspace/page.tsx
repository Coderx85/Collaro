import { OrganizationList } from "@clerk/nextjs";
// import {rootDomain} from "@/middleware";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

const WorkspacePage = async () => {
  const user = await currentUser();
  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center rounded-sm">
      {user?.fullName}
      <OrganizationList afterCreateOrganizationUrl={`:slug.${rootDomain}`} />
      <OrganizationSwitcher
        afterCreateOrganizationUrl={`:slug.${rootDomain}`}
        appearance={{
          variables: {
            colorPrimary: "#2563eb", // Primary color for the button
            colorText: "#1f2937", // Text color
            colorBackground: "#f3f4f6", // Background color
          },
        }}
      />
    </div>
  );
};

export default WorkspacePage;
