'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { SignedIn, UserButton, useSignIn } from '@clerk/nextjs'
import MobileNav from './MobileNav'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'
import { SiAboutdotme } from 'react-icons/si'
import { Contact2 } from 'lucide-react'
import { SignOutButton } from './SignOutButton'
import { ThemeToggle } from './ThemeToggle'
import NotificationBell from './NotificationBell'

const navbarlink = [
  {
    icon: <SiAboutdotme className='size-6' />,
    title: 'About',
    link: '/about-me',
    decription: 'About Me'
  },
  {
    icon: <Contact2 className='size-6'/>,
    title: 'Contact',
    link: '/contact-us',
    decription: 'Contact US'
  }
]

const Navbar = () => {
  const isActive = useSignIn();
  return (
    <nav className="flex w-full justify-between bg-gray-800 via-cyan-500 to-black px-6 py-4 lg:px-10">
      <Link href={!isActive ? '/' : '/workspace'} className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="group text-[26px] font-extrabold text-white duration-75 hover:text-white max-sm:hidden">
          Devn<span className='text-primary'>Talk</span>
        </p>
      </Link>
      <div className="flex items-center justify-center gap-8 px-4 py-2 text-lg font-bold">
        <TooltipProvider>
          {navbarlink.map((item, index) => {
            return (
              <Tooltip delayDuration={0} key={index}>
                <TooltipTrigger key={item.title}> 
                  <Link
                    href={item.link}
                    key={index}
                    className={cn(
                      'flex gap-4 items-center p-2 rounded-lg justify-start hover:bg-primary ease-in duration-100 border-white border-2 hover:animate-out',
                    )}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="z-10 bg-black/10 text-white backdrop-blur-xl"
                  key={index}
                  side='bottom'
                >
                  <p className="text-sm text-white">{item.decription}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
        <NotificationBell />
        <ThemeToggle />
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
        
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar