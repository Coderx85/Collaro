'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceStore } from '@/store/workspace';
import { CreateWorkspaceResponse } from '@/types';

const WorkspaceForm = () => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setWorkspace } = useWorkspaceStore()

  const handleJoin = async () => {
    // Handle join logic here
    try {
      setLoading(true);
      const res = await fetch(`/api/workspace/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: workspaceName! }),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!data.success) {
        setError(data.error);
        console.error(data.error);
        return toast.error(data.error);
      }
      
      const workspaceData: CreateWorkspaceResponse = data.success;
      toast.success('Workspace joined successfully');
      console.log('Joining workspace:', workspaceData);
      setWorkspace(workspaceData.id, workspaceData.name, workspaceData.members);
      router.push('/workspace/' + workspaceData.id);

    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
      setWorkspaceName('');
    }
  };

  const handleCreate = async () => {
    // Handle create logic here
    try {
      setLoading(true);
      const res = await fetch('/api/workspace/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workspaceName
        }),
      });

      const data = await res.json();
      
      console.log('Response:', data);

      if (data.error) {
        setError(data.error);
        console.error('Cannot create workspace with Name:', workspaceName);
        return toast.error(`Cannot create workspace with Name: ${workspaceName}`);
      }
      
      const workspaceData: CreateWorkspaceResponse = data.success;
      toast.success('Workspace created successfully');
      console.log('Joining workspace:', workspaceData);
      setWorkspace(workspaceData.id, workspaceData.name, workspaceData.members);
      router.push(`/workspace/${workspaceData.id}`);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
      setWorkspaceName('');
    }
  }
  return (
    <Tabs defaultValue="join" className="w-[400px] rounded-sm">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        {/* Join Workspace Form */}
        <TabsContent value="join">
          <Card className='rounded-none border-none bg-black'>
            <CardHeader>
              <CardTitle>Join Workspace</CardTitle>
              <CardDescription>
                Enter the workspace Name.
              </CardDescription>
              {error && <p className='text-red-500'>{error}</p>}
            </CardHeader>
            <form className="space-y-1">
              <CardContent className="space-y-2">
                <Label htmlFor="join-workspace-id">{`Workspace Name`}</Label>
                <Input 
                  id="join-workspace-id" 
                  value={workspaceName} 
                  disabled={loading}
                  name='' 
                  onChange={(e) => {setWorkspaceName(e.target.value); setError('')}} 
                />
              </CardContent>
              <CardFooter>
                <Button
                  variant={'outline'}
                  onClick={handleJoin}
                  disabled={loading}  
                  >
                  {loading
                  ? 
                  <span className='flex justify-center gap-3'>
                      <Loader2 className='size-4 animate-spin' />{"Joining Workspace"}
                    </span>
                  : 'Join Workspace' }
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Create Workspace Form */}
        <TabsContent value="create">
          <Card className='rounded-none border-none bg-black'>
            <CardHeader>
              <CardTitle>Create Workspace</CardTitle>
              <CardDescription>
                Enter a new workspace Name.
              </CardDescription>
              {error && <p className='text-red-500'>{error}</p>}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="create-workspace-name">Workspace Name</Label>
                <Input 
                  id="create-workspace-id" 
                  value={workspaceName} 
                  disabled={loading}
                  onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={'outline'}
                onClick={handleCreate}
                disabled={loading}
              >{loading 
                ? <span className='flex justify-center gap-3'>
                    <Loader2 className='size-4 animate-spin' />{"Creating Workspace"}
                  </span>
                : "Create Workspace"
              }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
  );
};

export default WorkspaceForm;