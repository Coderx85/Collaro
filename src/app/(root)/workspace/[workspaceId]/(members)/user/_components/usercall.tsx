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
// import { useGetCallByTeamandId } from '@/hooks/useGetCallByTeamandId'
import { useWorkspaceStore } from "@/store/workspace";
import { Call } from "@stream-io/video-react-sdk";
// import { useUser } from '@clerk/nextjs'

// import { Button } from "@/components/ui/button";
// import { useState } from "react";

const Usercall = () => {
  // const {user} = useUser()
  const { workspaceName } = useWorkspaceStore();
  const { calls: TeamCall } = useGetCallsByTeam(workspaceName!);
  // const [ currentPage, setCurrentPage ] = useState(1);

  // Pagination Logic
  // const totalPages = Math.ceil(TeamCall.length / 10);
  // const startIndex = currentPage-1 * 10;
  // const endIndex = startIndex + 10;
  // const currentCalls = TeamCall.slice(startIndex, endIndex);

  // const goToPage = (page: number) => {
  //   if(page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  // const goToNextPage = () => {
  //   if(currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const goToPreviousPage = () => {
  //   if(currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const team = TeamCall?.state

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

        {/* {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6 gap-3">
              <Button
                onClick={goToPreviousPage}
                hidden={currentPage === 1}
                size={"icon"}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-md text-base ${
                  currentPage === 1
                    ? "bg-white/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-dark-2 to-dark-1 text-white hover:opacity-90"
                }`}
              >
                Previous
              </Button>

              <div className="flex space-x-2 gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    size={"icon"}
                    onClick={() => goToPage(index + 1)}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === index + 1
                        ? "bg-gradient-to-b from-primary dark:to-primary/25 to-black text-white"
                        : "dark:bg-gradient-to-r dark:from-dark-2 dark:to-dark-1 text-white bg-black/50 hover:opacity-90"
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <Button
                onClick={goToNextPage}
                hidden={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-dark-2 to-dark-1 text-white hover:opacity-90"
                }`}
              >
                Next
              </Button>
            </div>
        )} */}
      </div>
    </div>
  );
};

export default Usercall;
