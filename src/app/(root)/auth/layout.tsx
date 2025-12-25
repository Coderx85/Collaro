import { CardContent } from "@/components/ui/card";
import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[calc(100vh-5px)] w-full home-bg backdrop-blur-xl">
      <CardContent className="relative w-1/2 bg-black/5 backdrop-blur-xl flex justify-between rounded-lg p-3 m-3 overflow-hidden">
        <div className="flex h-16 w-full items-center pl-3 relative z-10">
          <h1 className="text-2xl font-bold text-primary dark:text-primary letter-spacing-3 tracking-wider ">
            COLLARO
          </h1>
        </div>

        {/* Top-right hexagon */}
        <div
          className="absolute top-8 right-8 w-60 h-60"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            boxShadow:
              "0 0 40px 8px rgba(255, 255, 255, 0.3), 0 0 80px 15px rgba(255, 255, 255, 0.15)",
          }}
        />

        {/* Bottom-left hexagon */}
        <div
          className="absolute top-48 left-8 w-72 h-72"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            boxShadow:
              "0 0 40px 8px rgba(255, 255, 255, 0.3), 0 0 80px 15px rgba(255, 255, 255, 0.15)",
          }}
        />

        {/* Bottom-right hexagon */}
        <div
          className="absolute bottom-8 right-16 w-60 h-60"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            boxShadow:
              "0 0 40px 8px rgba(255, 255, 255, 0.3), 0 0 80px 15px rgba(255, 255, 255, 0.15)",
          }}
        />

        <div className="absolute bottom-5 right-5 w-19/20 backdrop-blur-3xl bg-white/90 z-10 h-72 border-2 border-primary rounded-lg text-white p-5 dark:bg-black/50">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Welcome to COLLARO
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
            The ultimate platform for seamless collaboration and project
            management. Streamline your workflow, connect with your team, and
            bring your ideas to life with our powerful suite of tools.
          </p>
        </div>
      </CardContent>
      <div className="w-1/2">{children}</div>
    </div>
  );
};

export default AuthLayout;
