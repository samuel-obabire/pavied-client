import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

import MobileSheet from "./MobileSheet";

const MobileHeader = () => {
  return (
    <header className="flex h-12 items-center justify-between bg-white p-2 md:hidden">
      <Avatar className="size-8">
        <AvatarImage
          className="rounded-full"
          src="https://github.com/shadcn.png"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <MobileSheet />
    </header>
  );
};

export default MobileHeader;
