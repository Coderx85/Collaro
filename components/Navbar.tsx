import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { SignedIn, UserButton } from '@clerk/nextjs'
import MobileNav from './MobileNav'

const navbarlink = [
  {
    title: 'About',
    link: '/about-me'
  },
  {
    title: 'Contact',
    link: '/contact-us'
  }

]

const Navbar = () => {
  return (
    <nav className="flex justify-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
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
      <div className="flex items-center gap-8 font-bold text-lg px-4 py-2">
        
        {navbarlink.map((nav, index) => {
          return (
            <Link key={index} href={nav.link} className='text-white rounded-md hover:bg-primary hover:text-white px-8 py-2'>
              {nav.title}
            </Link>
          )
        })}
        
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar