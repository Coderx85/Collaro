"use client"
// import { getWorkspaces } from '@/actions/workspace.action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const WorkspacePage = () => {
  const router = useRouter();
  const user = useUser();
  const username = user.user?.username;
  const [workspaceId, setWorkspaceId] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');

  const handleJoin = async () => {
    // Handle join logic here
    try {
      
      const res = await fetch(`/api/workspace/${workspaceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workspaceName as string,
          username: username as string,
        }),
      });

      if (res.ok) {
        toast.success('Workspace joined successfully');
        const data = await res.json();
        console.log('Joining workspace:', workspaceName, 'with username:', username);
        router.push('/workspace/' + data.id);
      }
      
      console.log('Cannot find workspace with Name:', workspaceName);
      toast.error(`Cannot find workspace with Name: ${workspaceName}`); 
      
    } catch (error: any) {
      console.error(error.message);
    }

  };

  const handleCreate = async () => {
    // Handle create logic here
    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workspaceName,
          members: username as string,
        }),
      });

      if (res.ok) {
        toast.success('Workspace created successfully');
        router.push('/workspace/' + workspaceId);
      }

    } catch (error: any) {
      console.error(error.message);
    }
    // console.log('Creating workspace with ID:', workspaceId, 'and username:', username);
  };

  return (
    <div className='mx-auto flex h-full flex-col items-center justify-center rounded-sm'>
      <Tabs defaultValue="join" className="w-[400px] rounded-sm">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <Card className='rounded-none border-none bg-black'>
            <CardHeader>
              <CardTitle>Join Workspace</CardTitle>
              <CardDescription>
                Enter the workspace ID and your username to join.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="join-workspace-id">Workspace Name</Label>
                <Input id="join-workspace-id" value={workspaceName} name='' onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={'outline'}
                onClick={handleJoin}>Join Workspace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card className='rounded-none border-none bg-black'>
            <CardHeader>
              <CardTitle>Create Workspace</CardTitle>
              <CardDescription>
                Enter a new workspace ID and your username to create a workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="create-workspace-name">Workspace Name</Label>
                <Input id="create-workspace-id" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-username">Username</Label>
                <Input id="create-username" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={'outline'}
                onClick={handleCreate}>Create Workspace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
    

export default WorkspacePage