import { CardContent } from "@/components/ui/card";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      <CardContent className="w-1/2 bg-primary">LOGO</CardContent>
      <div className="w-1/2">{children}</div>
    </div>
  );
};

export default AuthLayout;
