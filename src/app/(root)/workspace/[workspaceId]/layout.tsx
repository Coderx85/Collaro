import { Metadata } from 'next';
import { ReactNode } from 'react';

import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'DevnTalk',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main>

      <div className="flex">
        <Sidebar />
        
        <section className="flex min-h-screen flex-1 flex-col py-6 px-0 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
