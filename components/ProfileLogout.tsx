import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const ProfileLogout = () => {
  const { data } = useSession();

  return (
    <div className="flex flex-col items-start justify-between  pb-6">
      <div className="flex gap-2  pb-2">
        <Avatar className="hidden size-7 lg:block">
          <AvatarImage
            className="rounded-full"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h2 className="text-14-medium  truncate">{data?.user.name}</h2>
          <span className="truncate text-[10px] text-gray-400">
            {data?.user.email}
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
