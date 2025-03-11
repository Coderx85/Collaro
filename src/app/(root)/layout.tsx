import { ReactNode } from 'react';
import StreamVideoProvider from '@/providers/StreamClientProvider';
import Navbar from '@/components/Navbar';

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {

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