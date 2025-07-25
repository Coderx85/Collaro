import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Feature } from "@/components/home/Feature";
import FAQ from "@/components/home/FAQs";
import ContactForm from "./_components/ContactForm";
import { InfiniteMovingCards } from "@/components/home/infinite-moving-cards";
import { clients } from "@/constants";
import SubscriptionPlans from "./_components/SubscriptionPlans";
import Footer from "./_components/Footer";

const Rootpage = () => {
  return (
    <section
      className="relative mx-auto flex flex-col items-center justify-center overflow-y-auto scroll-smooth"
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
        className="px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-2 lg:py-0 w-full"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="hidden lg:flex py-32 px-10">
          <picture className="w-[600px] h-[400px] object-cover rounded-lg shadow-lg">
            <Image
              src="/home/hero.gif"
              alt="Hero animation showcasing Collaro"
              width={650}
              height={400}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              unoptimized={true}
            />
          </picture>
        </div>
        <div className="flex flex-col w-full items-center gap-4 py-32 xl:gap-2.5">
          <h1 className="text-4xl md:text-4xl font-semibold xl:text-8xl gap-3  flex xl:flex-row flex-col dark:text-white/75 text-slate-900/75 mx-auto text-center items-center">
            {"Welcome to "}
          </h1>
          <span className="text-6xl sm:text-4xl xl:text-8xl group/heading font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-green-600/85 via-green-700 to-teal-800 transition-all duration-300">
            Collaro
            {/* <span className="absolute -bottom-2 left-0 w-0 group-hover/heading:w-full h-[2px] bg-gradient-to-r from-primary/50 to-primary transition-all duration-500" /> */}
          </span>
          <p className="w-full md:w-4/5 px-2 mt-4 md:mt-6 xl:mt-2 xl:max-w-5xl text-lg xl:text-lg xl:text-center text-justify leading-6 text-slate-700 dark:text-gray-300">
            A modern platform for seamless developer discussions, video
            conferencing, and collaboration. Join us to connect with developers,
            share ideas, and collaborate on projects.
          </p>
          <div className="flex justify-center mt-5 gap-3 sm:gap-5">
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
          <p className="mt-4 w-4/5 gap-4 md:w-3/5 xl:max-w-4xl mx-auto text-center text-xs sm:text-sm xl:text-xl text-slate-600 dark:text-gray-400">
            For any queries, contact us or want to know about me <br />
            <Link
              className="underline text-black dark:text-white/85 hover:text-primary xl:text-2xl py-2"
              href="/contact-us"
              target="_blank"
            >
              Contact Us
            </Link>{" "}
            |{" "}
            <Link
              target="_blank"
              href={"https://coderx85.vercel.app/"}
              className="underline text-black dark:text-white/85 hover:text-primary xl:text-2xl py-2"
            >
              About Me
            </Link>
          </p>
        </div>
      </div>
      <InfiniteMovingCards
        direction="right"
        speed="normal"
        pauseOnHover
        items={clients}
      />
      {/* Features Section */}
      <div
        className="w-full xl:px-4 px-8 py-10 md:py-28 flex flex-col items-center justify-center"
        id="features"
      >
        <Feature />
      </div>
      {/* FAQ Section */}
      <div
        id="faq"
        className="w-full px-8 py-10 md:py-40 flex flex-col min-h-screen items-center"
      >
        <FAQ />{" "}
      </div>{" "}
      {/* Pricing Section */}
      <div
        className="w-full px-8 py-10 md:py-40 flex flex-col items-center justify-center"
        id="subscriptions"
      >
        {/* Using our custom subscription plans component */}
        <SubscriptionPlans />
      </div>{" "}
      {/* Combined Contact Form and Footer Section */}
      <div
        id="contact"
        className="w-full bg-gray-500/50 dark:bg-gray-700/60 py-4"
      >
        <div className="w-full px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-1">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rootpage;
