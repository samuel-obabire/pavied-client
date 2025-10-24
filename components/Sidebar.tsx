"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { sideLinks } from "@/lib/constants/sideLinks";
import { cn } from "@/lib/utils";

import BrandName from "./BrandName";
import ProfileLogout from "./ProfileLogout";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white_dark-black-1 sticky top-0 left-0 hidden w-full flex-col p-4 md:flex md:w-[190px] lg:w-[210px]">
      <div className="my-2 scale-85">
        <BrandName />
      </div>

      <div className="flex h-full flex-col justify-between">
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {sideLinks.map((link) => {
              if (link.deposit && link.withdrawal) {
                return (
                  <React.Fragment key={link.deposit.href}>
                    <Separator className="border-accent/10 mb-2 border-1" />

                    <Accordion
                      type="single"
                      defaultValue="deriv-item"
                      collapsible
                    >
                      <AccordionItem value="deriv-item">
                        <AccordionTrigger>Deriv Transaction</AccordionTrigger>
                        <AccordionContent>
                          <Link href={link.deposit.href}>
                            <li
                              className={cn(
                                "mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2 ",
                                {
                                  "bg-primary": pathname === link.deposit.href,
                                  "text-white": pathname === link.deposit.href,
                                }
                              )}
                            >
                              <link.deposit.Icon size={15} />{" "}
                              {link.deposit.label}
                            </li>
                          </Link>

                          <Link href={link.withdrawal.href}>
                            <li
                              className={cn(
                                "mb-2 flex h-10  cursor-pointer items-center gap-2 space-x-2 rounded-sm p-2 ",
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </React.Fragment>
                );
              }

              const { Icon, href, label } = link;

              return (
                <React.Fragment key={href}>
                  <Separator className="border-accent/10 mb-2 border-1" />

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

        <ProfileLogout />
      </div>
    </aside>
  );
};

export default Sidebar;
