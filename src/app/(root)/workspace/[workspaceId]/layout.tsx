import { Metadata } from 'next';
import { ReactNode } from 'react';

import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'DevnTalk',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = async ({ children }: Readonly<{children: ReactNode}>) => {
  
  return (
    <main>

      <div className="flex h-[88vh]">
        <Sidebar />
        
        <section className="flex min-h-full flex-1 flex-col px-0 py-6 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
