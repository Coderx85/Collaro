import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 justify-self-start m-3.5 p-1.5">
      {/* Logo for light theme */}
      <Image
        src="/icons/logo-light.png"
        width={32}
        height={32}
        alt="collaro logo"
        className="max-sm:size-10 block dark:hidden"
      />

      {/* Logo for dark theme */}
      <Image
        src="/icons/logo.png"
        width={32}
        height={32}
        alt="collaro logo"
        className="max-sm:size-10 hidden dark:block"
      />

      <p className="group text-3xl font-extrabold text-white duration-75 hover:text-white max-sm:hidden">
        Collaro
      </p>
    </div>
  );
};

export default Logo;