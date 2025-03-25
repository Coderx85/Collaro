"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { aboutData, educationData, experienceData } from "@/constants";
import React from "react";
import {
  FaCss3,
  FaHtml5,
  FaJs,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import {
  SiAppwrite,
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGithubpages,
  SiMongodb,
  SiNextdotjs,
  SiPhp,
  SiSqlite,
  SiStreamlit,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const skillsData = {
  title: "skills",
  description:
    "I am proficient in Python, MERN stack, and front-end technologies.",
  items: [
    {
      section: "Languages",
      techStack: [
        {
          title: "TypeScript",
          icon: <SiTypescript />,
          level: "Advanced",
        },
        {
          title: "Python",
          icon: <FaPython />,
          level: "Advanced",
        },
        {
          title: "C++",
          icon: <SiCplusplus />,
          level: "Intermediate",
        },
        {
          title: "JavaScript",
          icon: <FaJs />,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Frontend Dev",
      techStack: [
        {
          title: "Next.js",
          icon: <SiNextdotjs />,
          level: "Advanced",
        },
        {
          title: "Vite.js",
          icon: <SiVite />,
          level: "Advanced",
        },
        {
          title: "React.js",
          icon: <FaReact />,
          level: "Intermediate",
        },
        {
          title: "Html",
          icon: <FaHtml5 />,
          level: "Advanced",
        },
        {
          title: "Css",
          icon: <FaCss3 />,
          level: "Advanced",
        },
      ],
    },
    {
      section: "DevOps & VCS",
      techStack: [
        {
          title: "Docker",
          icon: <SiDocker />,
          level: "Intermediate",
        },
        {
          title: "Git",
          icon: <SiGit />,
          level: "Intermediate",
        },
        {
          title: "Vercel",
          icon: <SiGithubactions />,
        },
        {
          title: "Github",
          icon: <SiGithub />,
        },
      ],
    },
    {
      section: "Backend Dev",
      techStack: [
        {
          title: "Node.js",
          icon: <FaNodeJs />,
          level: "Intermediate",
        },
        {
          title: "Express.js",
          icon: <SiExpress />,
          level: "Intermediate",
        },
        {
          title: "Php",
          icon: <SiPhp />,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Database",
      techStack: [
        {
          title: "MongoDB",
          icon: <SiMongodb />,
          level: "Intermediate",
        },
        {
          title: "Sql",
          icon: <SiSqlite />,
          level: "Intermediate",
        },
        {
          title: "Appwrite",
          icon: <SiAppwrite />,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Deployment",
      techStack: [
        {
          title: "Streamlit",
          icon: <SiStreamlit />,
          level: "Intermediate",
        },
        {
          title: "Github Pages",
          icon: <SiGithubpages />,
          level: "Intermediate",
        },
        {
          title: "Vercel",
          Icon: <SiVercel />,
          level: "Intermediate",
        },
      ],
    },
  ],
};

const ResumePage = () => {
  return (
    <div className='container flex min-h-[80vh] justify-center gap-[60px] py-12 xl:py-0'>
      <div className='container mx-auto pt-10'>
        <Tabs
          defaultValue='about'
          className='flex flex-col gap-[60px] md:flex-row'
        >
          <TabsList className='mx-auto flex w-full max-w-[380px] flex-col gap-28 p-8 text-2xl capitalize md:flex-nowrap xl:mx-0'>
            <div className='flex min-h-[40vh] w-full flex-col content-start justify-between rounded-none bg-dark-1 text-left text-4xl'>
              <TabsTrigger value='about' className='min-h-[8vh]'>
                {aboutData.title}
              </TabsTrigger>
              <TabsTrigger
                value='experience'
                className='min-h-[8vh] capitalize'
              >
                {experienceData.title}
              </TabsTrigger>
              <TabsTrigger value='education' className='min-h-[8vh] capitalize'>
                {educationData.title}
              </TabsTrigger>
              <TabsTrigger value='skills' className='min-h-[8vh] capitalize'>
                {skillsData.title}
              </TabsTrigger>
            </div>
          </TabsList>

          <div className='min-h-[70vh] w-full'>
            {/* About Section */}
            <TabsContent
              value='about'
              className='w-full text-center xl:text-left'
            >
              <div className='flex flex-col gap-[30px]'>
                <h3 className='text-outline space-x-1 border-b-2 border-white/60 pb-2 text-4xl font-bold uppercase tracking-[5px] text-transparent'>
                  {aboutData.title + " Section"}
                </h3>
                <p className='mx-auto max-w-[680px] break-all text-white/60 xl:mx-0'>
                  {aboutData.description}
                </p>
                <ul className='mx-auto grid max-w-[850px] grid-cols-1 gap-14 gap-y-4 rounded-xl bg-dark-1 xl:mx-0 xl:grid-cols-2'>
                  {/* About Section items */}
                  {aboutData.info.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className='flex items-center justify-start gap-6 px-4 py-2'
                      >
                        <span className='font-bold text-primary/90'>
                          {item.fieldName}
                        </span>
                        <span className='text-lg text-white'>
                          {item.fieldValue}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>

            {/* Experience Section */}
            <TabsContent value='experience' className='w-full'>
              <div className='flex flex-col gap-[30px] text-center xl:text-left'>
                <h3 className='text-outline space-x-1 border-b-2 border-white/60 pb-2 text-4xl font-bold uppercase tracking-[5px] text-transparent'>
                  {experienceData.title + " Section"}
                </h3>
                {/* <p className='max-w-[680px] break-all text-white/60 mx-auto xl:mx-0'>
                  {experienceData.description}
                </p> */}
                <ScrollArea className='h-[480px]'>
                  {/* Experience items */}
                  <ul className='grid grid-cols-1 gap-[30px] lg:grid-cols-2'>
                    {experienceData.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className='group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-white/60 bg-dark-1 px-10 py-6 hover:bg-primary/10 lg:items-start'
                        >
                          <span className='text-white/60 group-hover:text-white'>
                            {item.duration}
                          </span>
                          <h4 className='min-h-[60px] max-w-[300px] text-center text-xl font-bold text-primary lg:text-left'>
                            {item.title}
                          </h4>
                          <div className='flex items-center gap-3'>
                            <span className='size-[6px] rounded-full bg-primary group-hover:bg-white'></span>
                            <Link
                              href={item.linkedin}
                              className='text-white/60'
                            >
                              {item.company}
                            </Link>
                          </div>
                          {/* <p>{item.description}</p> */}
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Education Section */}
            <TabsContent value='education'>
              <div className='flex flex-col gap-[30px] text-center xl:text-left'>
                <h3 className='text-outline space-x-1 border-b-2 border-white/60 pb-2 text-4xl font-bold uppercase tracking-[5px] text-transparent'>
                  {educationData.title + " Section"}
                </h3>
                <p className='mx-auto max-w-[680px] text-white/60 xl:mx-0'>
                  {educationData.description}
                </p>
                <ScrollArea className='h-[480px]'>
                  {/* Education items */}
                  <ul className='grid grid-cols-1 gap-[30px] lg:grid-cols-2'>
                    {educationData.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className='group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-white/60 bg-dark-1 px-10 py-6 hover:bg-primary/20 lg:items-start'
                        >
                          <span className='text-sm text-white/60 group-hover:text-white'>
                            {item.duration}
                          </span>
                          <h4 className='min-h-[60px] max-w-[260px] text-center text-xl font-bold text-primary lg:text-left'>
                            {item.title}
                          </h4>
                          <div className='flex items-center gap-3'>
                            <span className='size-[6px] rounded-full bg-primary group-hover:bg-white'></span>
                            <Link href='#' className='text-white/60'>
                              {item.institute}
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Skills Section */}
            <TabsContent value='skills'>
              <div className='flex flex-col gap-[30px] text-center lg:text-left'>
                <div className='flex flex-col gap-[30px] text-center xl:text-left'>
                  <h3 className='text-outline space-x-1 border-b-2 border-white/60 pb-2 text-4xl font-bold uppercase tracking-[5px] text-transparent'>
                    {skillsData.title + " Section"}
                  </h3>
                  {/* <p className='max-w-[680px] text-white/60 mx-auto xl:mx-0'>
                    {skillsData.description}
                  </p> */}
                </div>
                <ul className='grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-[30px]'>
                  {skillsData.items.map((item, index) => {
                    return (
                      <li key={index}>
                        <Card className='cursor-pointer bg-dark-1 hover:bg-primary/10'>
                          <CardHeader>
                            <CardTitle className='mx-auto text-left text-primary'>
                              {item.section}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='mx-auto w-full'>
                            <ul
                              className={`grid ${item.techStack.length % 2 ? "grid-cols-3" : "grid-cols-2"} gap-2 md:gap-[30px]`}
                            >
                              {item.techStack.map((tech, index) => {
                                return (
                                  <li
                                    key={index}
                                    className={`mx-auto items-center justify-between gap-2 ${item.techStack.length === 5 && index > 2 ? "col-span-1" : ""}`}
                                  >
                                    <TooltipProvider delayDuration={150}>
                                      <Tooltip>
                                        <TooltipTrigger className='group mx-auto flex h-[50px] w-full items-center justify-center rounded-xl'>
                                          <div className='text-4xl text-white/60 transition-all duration-300 group-hover:text-primary'>
                                            {tech.icon}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{tech.title}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </li>
                                );
                              })}
                            </ul>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
                {/* 
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className='w-full h-[150px] bg-primary rounded-xl flex justify-center items-center group'>
                              <div className='text-6xl group-hover:text-primary transition-all duration-300'>
                                {item.icon}                                
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      */}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumePage;
