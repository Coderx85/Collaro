import React from "react";
import { Tabs } from "./Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMeetingsData, getAllUsers, getAllWorkspaces } from "@/action";

// type Props = {}

const AdminTab = async () => {
  const meeting = await getMeetingsData();
  const users = await getAllUsers();
  const workspaces = await getAllWorkspaces();

  const tabs = [
    {
      title: "Users",
      value: "users",
      content: (
        <Table className='w-full overflow-hidden relative h-full rounded-md text-md md:text-lg text-white bg-gradient-to-br from-primary to-dark-2'>
          <TableHeader className='text-white'>
            <TableRow>
              <TableHead className='text-white'>Name</TableHead>
              <TableHead className='text-white'>Email</TableHead>
              <TableHead className='text-white'>Role</TableHead>
              <TableHead className='text-white'>Workspace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.data &&
              users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.workspaceId}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ),
    },
    {
      title: "Workspaces",
      value: "workspaces",
      content: (
        <Table className='w-full overflow-hidden relative h-full rounded-2xl p-10 text-md md:text-lg text-white bg-gradient-to-br from-primary to-dark-2'>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created By</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces &&
              workspaces.data &&
              workspaces.data.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell>{workspace.id}</TableCell>
                  <TableCell>{workspace.name}</TableCell>
                  <TableCell>{workspace.createdBy}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ),
    },
    {
      title: "Meetings",
      value: "meetings",
      content: (
        <Table className='w-full overflow-hidden relative rounded-md h-full text-sm md:text-lg text-white bg-primary/70'>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start At</TableCell>
              <TableCell>End At</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meeting &&
              meeting.meetingData &&
              meeting.meetingData.map((meeting) => (
                <TableRow key={meeting.meetingId}>
                  <TableCell>{meeting.name}</TableCell>
                  <TableCell>{meeting.description}</TableCell>
                  <TableCell>{String(meeting.startAt)}</TableCell>
                  <TableCell>{String(meeting.endAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ),
    },
  ];
  return (
    <div className='bg-primary/10 p-4 rounded-lg'>
      {/* <Tabs defaultValue='users' className='rounded-sm'>
        <TabsList className='grid w-full grid-cols-3 text-white gap-2'>
          <TabsTrigger value='users' className='bg-primary p-4 rounded-2xl'>
            <span className='flex text-center justify-center gap-2 space-x-2'>
              <User2Icon className='w-6 h-6' /> Users
            </span>
          </TabsTrigger>
          <TabsTrigger value='workspaces' className='flex text-center justify-center gap-2 space-x-2'>
            <Folder className='w-6 h-6' /> Workspaces
          </TabsTrigger>
          <TabsTrigger value='meetings' className='flex text-center justify-center gap-2 space-x-2'>
            <SiMeetup className='w-6 h-6' /> Meetings
          </TabsTrigger>
        </TabsList>
        <TabsContent value='users'>
          {users && users.data && users.data.map((user) => (
            <div key={user.id} className='flex justify-between items-center p-4 bg-primary/20 rounded-lg'>
              <div>
                <p className='text-lg text-white font-semibold'>{user.name}</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p>{user.role}</p>
                <p>{user.workspaceId}</p>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value='workspaces'>
          {workspaces && workspaces.data && workspaces.data.map((workspace) => (
            <div key={workspace.id} className='flex justify-between items-center p-4 bg-primary/20 rounded-lg'>
              <p className='text-lg text-white font-semibold'>{workspace.id}</p>
              <p>{workspace.name}</p>
              <p>{workspace.createdBy}</p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value='meetings'>
          {meeting && meeting.meetingData && meeting.meetingData.map((meeting) => (
            <div key={meeting.meetingId} className='flex justify-between items-center p-4 bg-primary/20 rounded-lg'>
              <div>
                <p className='text-lg text-white font-semibold'>{meeting.name}</p>
                <p>{meeting.description}</p>
              </div>
              <div>
                <p>{meeting?.startAt}</p>
                <p>{meeting?.endAt}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs> */}
      <Tabs
        tabs={tabs}
        contentClassName='text-white bg-gradient-to-br from-primary to-dark-2'
      />
    </div>
  );
};

export default AdminTab;
