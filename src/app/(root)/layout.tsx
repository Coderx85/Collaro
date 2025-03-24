import { ReactNode } from 'react';
import StreamVideoProvider from '@/providers/StreamClientProvider';
import Navbar from '@/components/Navbar';

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {

  return (
    <main>
      <StreamVideoProvider>
        <div className="flex items-center gap-4">
          <Navbar />
        </div>
        {children}
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;