import React from 'react'
import Image from 'next/image'
import { FaRocketchat, FaUserFriends, FaVideo } from 'react-icons/fa'
import FeatureCard from '@/components/FeatureCard'

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

const Rootpage = () => {
  return (
    <section className="my-auto flex min-h-screen flex-col items-center justify-center text-white ">
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
  )
}

export default Rootpage