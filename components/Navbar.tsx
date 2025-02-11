'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { SignedIn, UserButton, useSignIn } from '@clerk/nextjs'
import MobileNav from './MobileNav'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'

const navbarlink = [
  {
    icon: '/icons/about.svg',
    title: 'About',
    link: '/about-me',
    decription: ''
  },
  {
    icon: '/icons/contact.svg',
    title: 'Contact',
    link: '/contact-us',
    decription: ''
  }
]


const Navbar = () => {
  const isActive = useSignIn();
  return (
    <nav className="flex justify-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href={!isActive ? '/' : '/dashboard'} className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold group hover:text-primary text-white max-sm:hidden duration-75">
          Devn<span className='text-primary group-hover:text-white'>Talk</span>
        </p>
      </Link>
      <div className="flex items-center justify-center gap-8 font-bold text-lg px-4 py-2">
        <TooltipProvider>
          {navbarlink.map((item, index) => {
            return (
              <Tooltip delayDuration={0} key={item.title}>
              <TooltipTrigger key={item.title}> 
                  <Link
                    href={item.link}
                    key={item.title}
                    className={cn(
                      'flex gap-4 items-center p-4 rounded-lg justify-start hover:bg-primary ease-in duration-100 hover:animate-out',
                      {
                        'bg-primary': isActive,
                      }
                    )}
                  >
                    <Image 
                      src={item.icon}
                      alt={item.title}
                      width={'48'}
                      height={'48'}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black/10 backdrop-blur-xl z-10"
                  key={item.title}
                  side='bottom'
                >
                  <p className="text-sm text-white">{item.decription}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
        
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar