import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
  title: "DevnTalk - Home",
  description:
    "DevnTalk is a platform for developers to connect and share knowledge.",
  icons: "/logo.svg",
};

const layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 from-gray-900/50 via-gray-800/20 to-gray-700/50">
        {children}
      </div>
    </>
  );
};

export default layout;
