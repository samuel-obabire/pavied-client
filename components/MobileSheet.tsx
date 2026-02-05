"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { sideLinks } from "@/lib/constants/sideLinks";
import { cn } from "@/lib/utils";

import BrandName from "./BrandName";
import ProfileLogout from "./ProfileLogout";
import ThemeSwitcher from "./ThemeSwitcher";
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
    <aside className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent
          className="no-ring  bg-white_dark-black-1 max-w-[280px] p-2  lg:hidden"
          side="left"
        >
          <DialogTitle className="sr-only" />

          <div className="bg-white_dark-black-1 w-full p-2 md:w-[260px] ">
            <div className="my-2 scale-85">
              <BrandName />
            </div>

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1">
                {sideLinks.map((link) => {
                  if (link.deposit && link.withdrawal) {
                    return (
                      <React.Fragment key={link.deposit.href}>
                        <Separator className="border-accent/10 mb-2 border" />

                        <Accordion
                          type="single"
                          defaultValue="deriv-item"
                          collapsible
                        >
                          <AccordionItem value="deriv-item">
                            <AccordionTrigger className="no-ring">
                              Deriv Transaction
                            </AccordionTrigger>
                            <AccordionContent>
                              <SheetClose asChild>
                                <Link href={link.deposit.href}>
                                  <li
                                    className={cn(
                                      "mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2",
                                      {
                                        "bg-primary":
                                          pathname === link.deposit.href,
                                        "text-white":
                                          pathname === link.deposit.href,
                                      }
                                    )}
                                  >
                                    <link.deposit.Icon size={15} />{" "}
                                    {link.deposit.label}
                                  </li>
                                </Link>
                              </SheetClose>

                              <SheetClose asChild>
                                <Link href={link.withdrawal.href}>
                                  <li
                                    className={cn(
                                      "mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2",
                                      {
                                        "bg-primary":
                                          pathname === link.withdrawal.href,
                                        "text-white":
                                          pathname === link.withdrawal.href,
                                      }
                                    )}
                                  >
                                    <link.withdrawal.Icon size={15} />{" "}
                                    {link.withdrawal.label}
                                  </li>
                                </Link>
                              </SheetClose>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </React.Fragment>
                    );
                  }
                  const { Icon, href, label } = link;

                  return (
                    <React.Fragment key={href}>
                      <Separator className="border-accent/10 mb-2 border" />
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

          <SheetFooter className="p-0">
            <div className="flex w-full min-w-0 flex-col gap-4 overflow-hidden">
              <div className="px-1 w-20">
                <ThemeSwitcher />
              </div>
              <ProfileLogout />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default MobileSheet;
