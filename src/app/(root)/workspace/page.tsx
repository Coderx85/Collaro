import { OrganizationList } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const WorkspacePage = async () => {
  const user = await currentUser();
  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center rounded-sm">
      {user?.fullName}
      <OrganizationList
        afterSelectOrganizationUrl={`/workspace/:id`}
        afterCreateOrganizationUrl={`/workspace/:id`}
        hidePersonal
      />
    </div>
  );
};

export default WorkspacePage;
