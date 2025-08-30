"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCallsByTeam } from "@/hooks/useGetCallsbyTeam";
import { useOrganization } from "@clerk/nextjs";
import { Call } from "@stream-io/video-react-sdk";

const Usercall = () => {
  const { isLoaded, organization } = useOrganization();
  const workspaceName = organization?.name;
  const { calls: TeamCall } = useGetCallsByTeam(workspaceName!);

  if (!isLoaded || !organization) {
    return <div>Loading...</div>;
  }

  const filteredCalls = TeamCall.filter((call: Call) => call.state.endedAt);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold">User Call</h1>
      <div className="bg-gray-700 w-full h-full p-4 rounded-lg flex flex-col gap-4">
        <h2>Total call: {TeamCall.length}</h2>
        <Table className="w-full text-white">
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-left">Description</TableHead>
              <TableHead className="text-left">Call ID</TableHead>
              {/* <TableHead className='text-left'>Created At</TableHead> */}
              <TableHead className="text-left">Updated At</TableHead>
              <TableHead className="text-left">Ended At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TeamCall &&
              TeamCall.length > 0 &&
              filteredCalls
                .sort((a: Call, b: Call) => {
                  return (
                    new Date(b.state.updatedAt!).getTime() -
                    new Date(a.state.updatedAt!).getTime()
                  );
                })
                .map((call: Call, index: number) => {
                  return (
                    <TableRow key={index} className="bg-gray-800">
                      <TableCell className="text-left">
                        {call.state.custom?.description}
                      </TableCell>
                      <TableCell className="text-left">{call.id}</TableCell>
                      <TableCell className="text-left">
                        {call.state.updatedAt?.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-left">
                        {call.state.endedAt?.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Usercall;
