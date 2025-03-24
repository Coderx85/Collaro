import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FeaturesSectionDemo } from '@/components/Feature'
import FAQ from '@/components/FAQs'

const Rootpage = async () => {
  const { userId } = await auth()
  return (
    <>
      {/* Sticky Navbar */}
      <div className='sticky top-0 z-50 flex items-center justify-between w-full px-8 py-4 bg-gradient-to-r from-zinc-900/50 to-zinc-700/50 dark:from-slate-800 dark:to-slate-900 shadow-md'>
        <Link href='/' className='flex items-end gap-2 align-bottom justify-end cursor-pointer'>
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={35}
            height={35}
            className="h-auto"
          />
          <span>
            <span className="text-2xl font-bold text-primary shadow-2xl">DevnTalk</span>
          </span>
        </Link>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          {userId ? (
            <div className='flex items-center gap-4'>
              <Link href='/workspace'>
                <Button className="text-white bg-primary hover:bg-primary/90 transition-colors">Dashboard</Button>
              </Link>
              <UserButton />
            </div>
            ):(
              <Link href={"/sign-in"}>
                <Button className="text-white bg-primary hover:bg-primary/90 transition-colors">Sign In</Button>
              </Link>
            )}
        </div>
      </div>

      {/* Main Content with scroll snap */}
      <section className="relative mx-auto flex flex-col bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 from-gray-100 via-white to-gray-100 items-center justify-center overflow-y-auto scroll-smooth" style={{ scrollSnapType: 'y mandatory' }}>
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        
        {/* Hero Section */}
        <div className='px-4 py-6 md:py-28 min-h-screen w-full flex flex-col items-center ' style={{ scrollSnapAlign: 'start' }}>
          <h1 className='xl:text-6xl dark:text-white text-slate-900 mx-auto text-center text-3xl items-center'>
            {"Welcome to "}
            <span className='text-6xl font-bold text-primary border-b-4 border-b-black dark:border-b-white'>
              DevnTalk
            </span>
          </h1>
          <p className="w-full mt-5 xl:mt-8 max-w-5xl text-sm text-center xl:text-lg text-slate-700 dark:text-gray-300">
            A modern platform for seamless developer discussions, video conferencing, and collaboration.
          </p>
          <div className='flex justify-center mt-5 gap-5'>
            <Link href='/workspace'>
              <Button className="rounded-lg font-bold bg-gradient-to-br from-primary/85 dark:to-white/5 hover:from-primary/90 hover:to-primary to-black shadow-md text-white">
                Get Started
              </Button>
            </Link>
            <Link href='/guide'>
              <Button className='rounded-lg font-bold border-2 dark:bg-transparent bg-white/80 border-primary hover:bg-primary/10 text-primary shadow-md' variant={'outline'}>
                User Guide
              </Button>
            </Link>
          </div>
          <p className="mt-4 max-w-4xl mx-auto text-center xl:text-lg text-sm text-slate-600 dark:text-gray-400">
            Join us to connect with developers, share ideas, and collaborate on projects.
          </p>
        </div>

        {/* Features Section */}
        <div className="w-full px-4 py-16 min-h-screen flex flex-col items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
          <h2 className='text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white'>
            Features
          </h2>
          <FeaturesSectionDemo />
        </div>

        {/* FAQ Section */}
        <div className='w-full py-16 px-4 min-h-screen flex flex-col items-center justify-center' style={{ scrollSnapAlign: 'start' }}>
          <h2 className='text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white'>
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>
      </section>
    </>
  )
}

export default Rootpage