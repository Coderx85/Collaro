'use client'
import { ReactNode, useEffect } from 'react';
import StreamVideoProvider from '@/providers/StreamClientProvider';
import Navbar from '@/components/Navbar';
import { sidebarLinks } from '@/constants/index';
import { usePathname } from 'next/navigation';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const currentPath = usePathname();
  useEffect(() => {
    const currentPage = sidebarLinks.find(link => link.route === currentPath);

    if (currentPage) {
      document.title = `${currentPage.label}: ${currentPage.details}`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', `This is the ${currentPage.label} page.`);
    }
  }, [currentPath]);

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
