"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { sideLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

import BrandName from "./BrandName";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 hidden w-full flex-col bg-white p-4 md:flex md:w-[190px] lg:w-[270px]">
      <div className="my-2 scale-85">
        <BrandName />
      </div>

      <div className="flex h-full flex-col justify-between">
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {sideLinks.map((link) => {
              const { Icon, href, label } = link;

              return (
                <React.Fragment key={href}>
                  <Separator className="border-accent mb-2 border-1" />

                  <Link href={href}>
                    <li
                      className={cn(
                        "mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2 ",
                        {
                          "bg-primary": pathname === href,
                          "text-white": pathname === href,
                        }
                      )}
                    >
                      <Icon size={15} /> {label}
                    </li>
                  </Link>
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        <div
          onClick={() => signOut()}
          className="shadow-accent flex cursor-pointer flex-row items-center justify-between gap-2  shadow-2xl"
        >
          <Avatar className="hidden size-10 lg:block">
            <AvatarImage
              className="rounded-full"
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex  max-w-[60%] flex-col">
            <h2 className="text-16-regular  truncate">Samuel Obabire</h2>
            <span>email@gmail.com</span>
          </div>

          <LogOut className="ml-2" size={20} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
