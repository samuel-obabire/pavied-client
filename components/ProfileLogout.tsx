import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const ProfileLogout = () => {
  const { data } = useSession();

  return (
    <div className="flex flex-col items-start justify-between pb-6">
      <div className="flex w-full items-center gap-3 pb-2 sm:gap-2">
        <Avatar className="size-7 shrink-0">
          <AvatarImage
            className="h-full w-full rounded-full object-cover"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="text-14-medium truncate">{data?.user?.name}</h2>

          <span className="text-12-regular block truncate text-gray-400 sm:text-[10px]">
            samuelobabire6@gmail.comdjdjjdj
          </span>
        </div>
      </div>

      <Separator className="border-accent/10 mb-2 border-1" />

      <div className="cursor-pointer" onClick={() => signOut()}>
        <LogOut className="mr-2 inline" size={20} />{" "}
        <span className="text-14-medium">Logout</span>
      </div>
    </div>
  );
};

export default ProfileLogout;
