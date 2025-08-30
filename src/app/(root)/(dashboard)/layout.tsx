import StreamVideoProvider from '@/providers/StreamClientProvider';
import React from 'react'

type Props = {
  children: React.ReactNode;
}

const DashboardLayout = (props: Props) => {
  return (
    <StreamVideoProvider>
      {props.children}
    </StreamVideoProvider>
  )
}

export default DashboardLayout