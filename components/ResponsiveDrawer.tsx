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
        <DialogContent className="no-ring  bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="!text-16-regular">{title}</DialogTitle>
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
      <DrawerContent color="red" className="no-ring min-h-[40%] bg-white">
        <DrawerHeader className="flex flex-row justify-between">
          <DrawerTitle className="!text-16-regular">{title}</DrawerTitle>
          <X
            className="bg-accent size-6 rounded-full p-0.5"
            onClick={() => setOpen(false)}
          />
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDrawer;
