import Box from "./_components/box";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUser, getWorkspace, getWorkspaceUsers } from "@/action";
import { Separator } from "@/components/ui/separator";

const WorskpaceRoom = async ({}) => {
  const user = await getUser();
  const workspaceId = user?.data?.workspaceId;
  if (!workspaceId) {
    throw new Error("Workspace ID is undefined");
  }
  console.log("workspaceId", workspaceId);
  if (!user?.data?.clerkId) {
    throw new Error("Clerk ID is undefined");
  }
  const data = await getWorkspace(user.data.clerkId);
  const workspace = data.data;
  const workspaceUser = await getWorkspaceUsers(workspaceId);
  // console.log('data \n', workspaceUser)

  return (
    <div>
      <h1 className="text-3xl font-extrabold ">Workspace Room</h1>
      <p className="text-sm text-gray-400">
        Here you can view the details of the workspace
      </p>
      <Separator className="border-2 mb-2 border-white/50" />
      {workspace && (
        <div className="flex w-full mt-4 flex-col gap-8 xl:max-w-[900px]">
          <Box title="Workspace ID" description={workspace.id} />
          <Box title="Workspace Name" description={workspace.name} />
          <Box title="Created By" description={workspace.createdBy} />
          <Box title="Created At" description={String(workspace.createdAt)} />
        </div>
      )}

      <Table className="border-2 border-gray-800 mt-8">
        <TableCaption>Workspace Users</TableCaption>
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined At</TableCell>
          </TableRow>
        </TableHeader>
        {workspaceUser?.data &&
          workspaceUser.data.length > 0 &&
          workspaceUser.data.map((user) => (
            <TableBody key={user.id}>
              <TableRow>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{String(user.createdAt).split("T")[0]}</TableCell>
              </TableRow>
            </TableBody>
          ))}
      </Table>
    </div>
  );
};

export default WorskpaceRoom;
