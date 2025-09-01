"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { sideLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

import BrandName from "./BrandName";
import { DialogTitle } from "./ui/dialog";
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetClose,
  SheetFooter,
} from "./ui/sheet";

const MobileSheet = () => {
  const pathname = usePathname();

  return (
    <aside className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent className="no-ring  bg-white  md:hidden" side="left">
          <DialogTitle className="sr-only" />

          <div className="w-full bg-white md:w-[208px]">
            <div className="my-2 scale-85">
              <BrandName />
            </div>

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1 p-4">
                {sideLinks.map((link) => {
                  const { Icon, href, label } = link;

                  return (
                    <React.Fragment key={href}>
                      <Separator className="border-accent mb-2 border-1" />
                      <SheetClose asChild>
                        <Link href={href}>
                          <li
                            className={cn(
                              " mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2 ",
                              {
                                "bg-primary": pathname === href,
                                "text-white": pathname === href,
                              }
                            )}
                          >
                            <Icon size={15} /> {label}
                          </li>
                        </Link>
                      </SheetClose>
                    </React.Fragment>
                  );
                })}
              </ul>
            </nav>
          </div>

          <SheetFooter className="shadow-accent  flex cursor-pointer flex-row items-center  gap-4  shadow-2xl">
            <Avatar className="size-10">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div
              onClick={() => signOut()}
              className="flex w-full items-center justify-between"
            >
              <div className="flex   max-w-[60%] flex-col">
                <h2 className="text-18-medium  truncate">Samuel Obabire</h2>
                <span>email@gmail.com</span>
              </div>

              <LogOut className="" size={20} />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default MobileSheet;
