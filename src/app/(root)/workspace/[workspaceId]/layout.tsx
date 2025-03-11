import { Metadata } from 'next';
import { ReactNode } from 'react';

import Sidebar from '@/components/Sidebar';
// import { currentUser } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import { getUser } from '@/actions/user.actions';
// import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'DevnTalk',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = async ({ children }: Readonly<{children: ReactNode}>) => {
  // const user = await currentUser();
  // if (!user) {
  //   console.log("User not found through Clerk");
  //   return revalidatePath('/sign-in');
  // }

  // const clerkUser = await getUser();
  // if (!clerkUser) {
  //   console.log("User not found in the database");
  //   return redirect('/sign-in');
  // }

  // if(user && clerkUser) {
  //   console.log("User found in the database");
  // }

  return (
    <main>

      <div className="flex">
        <Sidebar />
        
        <section className="flex min-h-screen flex-1 flex-col px-0 py-6 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
