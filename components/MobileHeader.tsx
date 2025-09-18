import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

import MobileSheet from "./MobileSheet";

const MobileHeader = () => {
  return (
    <header className="bg-white_dark-black-1 sticky top-0 left-0 flex h-12 w-full items-center justify-between p-4 md:hidden">
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
