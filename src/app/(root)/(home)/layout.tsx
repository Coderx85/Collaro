import type { ReactNode } from "react";
import type { Metadata } from "next";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
  title: "Collaro - Home",
  description:
    "Collaro is a platform for developers to connect and share knowledge.",
  icons: "/icons/logo.png",
};

const layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="pattern-bg bg-gradient-to-br  from-black/50 via-gray-800/20 to-gray-700/50">
        {children}
      </div>
    </>
  );
};

export default layout;
