"use client"
import React, { useEffect, useState } from "react"
import { LuAlignLeft } from "react-icons/lu"
import Link from "next/link"

import { Button } from "@repo/design/components/ui/button"
import { DialogTitle } from "@repo/design/components/ui/dialog"
import { ScrollArea } from "@repo/design/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@repo/design/components/ui/sheet"
import Logo from "@repo/design/components/navigation/Logo"
import { NavMenu } from "@repo/design/components/navigation/navbar"
import PageMenu from "@repo/design/components/navigation/pagemenu"

type Topic = {
  title: string;
  path: string;
  subtopics?: Topic[];
}

export function Sidebar() {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    // Fetch the sidebar.json file
    fetch("/sidebar.json")
      .then((response) => response.json())
      .then((data) => setTopics(data.topics))
      .catch((error) => console.error("Failed to load sidebar topics:", error))
  }, [])

  return (
    <aside
      className="sticky top-16 hidden h-[94.5vh] min-w-[230px] flex-[1] flex-col overflow-y-auto bg-black p-4 text-white md:flex"
      aria-label="Page navigation"
    >
      <ScrollArea className="py-4">
        <div className="text-xl mb-4 font-bold">Navigation</div>
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic.title}>
              <Link
                href={topic.path}
                className="block py-2 px-4 transition-all hover:bg-gray-800"
              >
                {topic.title}
              </Link>
              {topic.subtopics && (
                <ul className="ml-4 space-y-1">
                  {topic.subtopics.map((subtopic) => (
                    <li key={subtopic.title}>
                      <Link
                        href={subtopic.path}
                        className="block py-1 px-4 text-sm transition-all hover:bg-gray-700"
                      >
                        {subtopic.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex cursor-pointer md:hidden"
        >
          <LuAlignLeft className="!size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-0 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col gap-4 overflow-y-auto">
          <div className="mx-0 mt-3 flex flex-col gap-2.5 px-5">
            <NavMenu isSheet />
          </div>
          <div className="mx-0 px-5">
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
