"use client"
import { getUser } from '@/actions/user.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const WorkspacePage = () => {
  const router = useRouter();
  const user = useUser();
  const username = user.user?.username;
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(
  () => {
    try {
      const fetchData = async () => {
        setLoading(true)
        const data = await getUser()
  
        if(data){
          const workspaceId = data?.workspaceId 
          console.log('Workspace:', workspaceId);
          
          if(!workspaceId) {
            console.log('User does not belong to any workspace');
            // toast.error('User does not belong to any workspace');
            return null;
          }

          if(workspaceId && workspaceId=="") {
            console.log('User does not belong to any workspace');
            toast.error('User does not belong to any workspace');
            return null;
          }
          
          console.log('User:', data);
          console.log('User:', workspaceId);
          router.push('/workspace/' + workspaceId+`?name=${data.workspaceName}`);
        }
      }
      fetchData();
    } catch (error: unknown) {
      console.error(error);
    }
    finally {
      setLoading(false)
    }
  }, [router])
  
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

      if (data.workspace.length === 0) {
        console.log('Cannot find workspace with Name:', workspaceName);
        toast.error(`Cannot find workspace with Name: ${workspaceName}`); 
      }
      
      toast.success('Workspace joined successfully');
      console.log('Joining workspace:', workspaceName, 'with username:', username);
      router.push('/workspace/' + data.workspace[0].id);

    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
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

      if (!data.workspace) {
        console.log('Cannot create workspace with Name:', workspaceName, 'and createdBy:', username);
        toast.error(`Cannot create workspace with Name: ${workspaceName} and createdBy: ${username}`);
      }
      
      toast.success('Workspace created successfully');
      router.push('/workspace/' + data?.workspace[0]?.id);

    } catch (error: unknown) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto flex h-full flex-col items-center justify-center rounded-sm'>
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
            </CardHeader>
            <CardContent className="space-y-2">
              <form className="space-y-1">
                <Label htmlFor="join-workspace-id">{`Workspace Name`}</Label>
                <Input 
                  id="join-workspace-id" 
                  value={workspaceName} 
                  disabled={loading}
                  name='' 
                  onChange={(e) => setWorkspaceName(e.target.value)} 
                />
              </form>
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
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card className='rounded-none border-none bg-black'>
            <CardHeader>
              <CardTitle>Create Workspace</CardTitle>
              <CardDescription>
                Enter a new workspace Name.
              </CardDescription>
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
    </div>
  )
}

export default WorkspacePage