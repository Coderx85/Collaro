import Link from "next/link"
import { LuArrowUpRight, LuGithub } from "react-icons/lu"
import Logo from "./Logo"

import { buttonVariants } from "@repo/design/components/ui/button"
import { SheetClose } from "@repo/design/components/ui/sheet"
import Anchor from "@repo/design/components/navigation/anchor"
import Search from "@repo/design/components/navigation/search"
import { SheetLeft } from "@repo/design/components/ui/sidebar"
import { ThemeToggle } from "@repo/design/components/navigation/theme-toggle"

const GitHubLink = { href: "https://github.com/Coderx85/Collaro" } // Added GitHub link
const Navigations = [
  { title: "Home", href: "/" },
  { title: "Docs", href: "/docs" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
] // Added navigation items

export function Navbar() {
  return (
    <nav className="bg-opacity-5 sticky top-0 z-50 h-16 w-full border-b px-2 backdrop-blur-xl backdrop-filter md:px-4">
      <div className="mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2">
        <div className="flex items-center gap-5">
          <SheetLeft />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex">
              <Logo />
            </div>
            <div className="text-muted-foreground hidden items-center gap-5 text-sm font-medium md:flex">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search />
          <div className="flex gap-2 sm:ml-0">
            {GitHubLink.href && (
              <Link
                href={GitHubLink.href}
                className={buttonVariants({ variant: "outline", size: "icon" })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View the repository on GitHub"
              >
                <LuGithub className="h-[1.1rem] w-[1.1rem]" />
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {Navigations.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="font-bold text-primary"
            absolute
            className="flex items-center gap-1 text-sm"
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            {item.title}{" "}
            {item.external && (
              <LuArrowUpRight className="h-3 w-3 align-super" strokeWidth={3} />
            )}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}