import React from 'react'
import Image from 'next/image'
import { FaRocketchat, FaUserFriends, FaVideo } from 'react-icons/fa'
import FeatureCard from '@/components/FeatureCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

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

const Rootpage = async () => {

  const { userId } = await auth()
    return (
      <>
        <div className='flex items-center justify-between w-full px-8 py-4 bg-gradient-to-l from-cyan-700 via-cyan-950 to-slate-950'>
          <Link href='/' className='flex items-end justify-end cursor-'>
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={35}
              height={35}
              className="h-auto"
            />
            <span>
              <span className="text-2xl font-bold primary-text shadow-2xl">DevnTalk</span>
            </span>
          </Link>
          {userId ? (
              <Link href='/workspace'>
                <Button className="text-white">Dashboard</Button>
              </Link>
            ):(
              <Link href={"/sign-in"}>
                <Button className="text-white" variant={"outline"}>Sign In</Button>
              </Link>
            )}
        </div>
        <section className="mt-20 flex flex-col items-center justify-center text-white ">
          <h1 className='text-6xl primary-text'>
            Welcome to DevnTalk
          </h1>
          <p className="mt-4 w-3/5 max-w-2xl text-center text-lg text-gray-400">
            A modern platform for seamless developer discussions, video conferencing, and collaboration.
          </p>
          <Link href='/workspace'>
            <Button className="mt-8">Get Started</Button>
          </Link>
          <p className="mt-4 w-3/5 max-w-2xl text-center text-lg text-gray-400">
              Join us to connect with developers, share ideas, and collaborate on projects.
          </p>
          <div className="mt-12 flex max-w-4xl flex-initial">
            {featureCard.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
        </div>
      </section>
    </>
  )
}

export default Rootpage