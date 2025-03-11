import { ReactNode } from 'react';
import StreamVideoProvider from '@/providers/StreamClientProvider';
import Navbar from '@/components/Navbar';
// import { getUser } from '@/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
// import { revalidatePath } from 'next/cache';

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const user = await currentUser();

  // const dbUser = await getUser({ userId: user?.id as string });
  
  // if(dbUser.status === 500) {
  //   const data = await dbUser.json();
  //   revalidatePath(`/workspce/${data.workspace[0].id}`);
  // }

  return (
    <main>
      <StreamVideoProvider>
        <Navbar />
        {children}
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
