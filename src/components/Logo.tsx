import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex gap-2 m-3.5 p-1.5">
      {/* Logo for dark theme */}
      <Image
        src="/icons/logo.png"
        width={36}
        height={32}
        alt="collaro logo"
        className="max-sm:size-10"
      />

      <p className="group text-3xl font-extrabold max-sm:hidden">Collaro</p>
    </div>
  );
};

export default Logo;
