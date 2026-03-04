"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import "nigerian-bank-icons/index.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ResponsiveDrawer = ({
  title,
  triggerLabel,
  content,
}: {
  triggerLabel: string;
  title: string;
  content: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useMedia("(min-width: 768px)", false);

  // Prevent hydration error. Wait until hydration is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder that matches on both server and client
    return (
      <Button className="btn-ghost" variant="ghost">
        {triggerLabel}
      </Button>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="btn-ghost" variant="ghost">
            {triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="no-ring  bg-white_dark-black-1 sm:max-w-[425px]">
          <DialogHeader className="px-1 pt-2">
            <DialogTitle className="text-18-semibold text-black-1_dark-white">
              {title}
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="btn-ghost" variant="ghost">
          {triggerLabel}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        color="red"
        className="no-ring bg-white_dark-black-1 min-h-[40%]"
      >
        <DrawerHeader className="flex flex-row items-center justify-between px-5 pt-6 pb-2">
          <DrawerTitle className="text-16-semibold text-black-1_dark-white">
            {title}
          </DrawerTitle>
          <X
            className="size-8 cursor-pointer rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
            onClick={() => setOpen(false)}
          />
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDrawer;
