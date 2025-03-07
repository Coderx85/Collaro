import React from 'react'
import { FaRocketchat, FaUserFriends, FaVideo } from 'react-icons/fa';
import Image from 'next/image';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';

const featureCard = [
  {
    icon: <FaVideo size={40} />,
    title: 'Live Video Calls',
    description: 'Connect with developers instantly through high-quality video sessions. Share ideas, discuss projects, and collaborate effectively in real-time.'
  },
  {
    icon: <FaRocketchat size={40} />,
    title: 'Fast & Secure',
    description: 'Experience seamless, secure, and lag-free discussions with advanced tech. We ensure high-speed connectivity, end-to-end encryption, and optimized performance for all meetings.'
  },
  {
    icon: <FaUserFriends size={40} />,
    title: 'Community Focused',
    description: 'Engage with a like-minded developer community for better networking. Participate in discussions, join groups, and contribute to open-source projects.'
  }
]

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand my-auto hidden w-1/2 items-center justify-center p-10 text-white lg:flex lg:flex-col xl:w-4/6 ">
        <div className='mx-auto flex items-center justify-center space-x-16'>
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={96}
            height={96}
            className="h-auto"
          />
          <h1 className="text-center text-5xl font-bold" >
            Welcome to <br /><span className='text-primary'>DevnTalk</span>
          </h1>
          <div className='hidden justify-end lg:flex'>
            <Button>Sign In</Button>
          </div>
        </div>
        <p className="mt-4 w-3/5 max-w-2xl text-center text-lg text-gray-400">
            A modern platform for seamless developer discussions, video conferencing, and collaboration.
        </p>
        <div className="mt-12 flex max-w-4xl flex-initial">
          {featureCard.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
      </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-[url(/images/background.jpg)] bg-fixed px-4 backdrop-blur-md lg:justify-center lg:p-10">
        <div className="flex-start flex bg-white/30 backdrop-blur-sm lg:hidden">
          <h1 className="p-0 text-5xl font-bold text-primary">
            DevnTalk
          </h1>
        </div>
        {children}
      </section>
    </div>
  );
}

export default AuthLayout