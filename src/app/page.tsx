import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/home/ThemeToggle";
import { Feature } from "@/components/home/Feature";
import FAQ from "@/components/home/FAQs";

const Rootpage = async () => {
  const { userId } = await auth();
  return (
    <>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between w-full px-4 sm:px-8 py-2 xl:py-4 bg-gradient-to-r from-zinc-900/50 to-zinc-700/50 dark:from-slate-800 dark:to-slate-900 shadow-md">
        <Link
          href="/"
          className="flex gap-1 sm:gap-2 items-center cursor-pointer"
        >
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={26}
            height={26}
            className="h-auto w-6 sm:w-7 justify-center xl:size-8"
          />
          <span>
            <span className="text-lg sm:text-xl xl:text-2xl font-bold text-white shadow-2xl">
              DevnTalk
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {userId ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/workspace">
                <Button className="text-white bg-primary hover:bg-primary/90 transition-colors text-sm sm:text-base">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </div>
          ) : (
            <Link href={"/sign-in"}>
              <Button className="text-white bg-primary hover:bg-primary/90 transition-colors text-sm sm:text-base">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content with scroll snap */}
      <section
        className="relative mx-auto flex flex-col bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 from-gray-300 via-gray-500 to-gray-300 items-center justify-center overflow-y-auto scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
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
        <div
          className="px-4 py-6 md:py-16 lg:py-28 min-h-screen justify-center w-full flex flex-col items-center"
          style={{ scrollSnapAlign: "start" }}
        >
          <h1 className="text-xl sm:text-2xl md:text-4xl xl:text-6xl flex xl:flex-row flex-col dark:text-white text-slate-900 mx-auto text-center items-center">
            {"Welcome to "}
            <span className="text-3xl sm:text-4xl xl:text-6xl font-bold text-primary border-b-4 border-b-black dark:border-b-white">
              DevnTalk
            </span>
          </h1>
          <p className="w-4/5 md:w-3/5 px-4 mt-4 md:mt-6 xl:mt-8 xl:max-w-5xl text-xs sm:text-sm xl:text-lg xl:text-center text-justify leading-6 text-slate-700 dark:text-gray-300">
            A modern platform for seamless developer discussions, video
            conferencing, and collaboration. Join us to connect with developers,
            share ideas, and collaborate on projects.
          </p>
          <div className="flex justify-center flex-col sm:flex-row mt-5 gap-3 sm:gap-5">
            <Link href="/workspace">
              <Button className="rounded-lg font-bold bg-gradient-to-br from-primary/85 dark:to-white/5 hover:from-primary/90 hover:to-primary to-black shadow-md text-white text-sm sm:text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/guide">
              <Button
                className="rounded-lg font-bold border-2 dark:bg-transparent bg-white/80 border-primary hover:bg-primary/10 text-primary shadow-md text-sm sm:text-base"
                variant={"outline"}
              >
                User Guide
              </Button>
            </Link>
          </div>
          <p className="mt-4 w-4/5 gap-4 md:w-3/5 xl:max-w-4xl mx-auto text-center text-xs sm:text-sm xl:text-lg text-slate-600 dark:text-gray-400">
            For any queries, contact us at{" "}
            <p>
              <Link className="underline text-white" href="/">
                Contact Us
              </Link>{" "}
              |{" "}
              <Link href={"/about-me"} className="underline text-white">
                About Me
              </Link>
            </p>
          </p>
        </div>

        {/* Features Section */}
        <div className="w-full xl:px-4 px-8 py-10 md:py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10 text-slate-900 dark:text-white">
            Features
          </h2>
          <Feature />
        </div>

        {/* FAQ Section */}
        <FAQ />
      </section>
    </>
  );
};

export default Rootpage;
