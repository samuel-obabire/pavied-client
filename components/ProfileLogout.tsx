import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { ROUTES } from "@/lib/constants/routes";

const ProfileLogout = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex w-full min-w-0 flex-col pb-6">
      <div className="flex min-w-0 items-center gap-2 pb-2 sm:gap-2">
        <Avatar className="size-7 shrink-0 overflow-hidden rounded-full">
          <AvatarImage
            className="h-full w-full object-cover"
            src={session?.user?.image || "https://github.com/shadcn.png"}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="flex h-full w-full items-center justify-center text-[10px] font-bold">
            {session?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          {" "}
          <h2 className="text-14-medium truncate overflow-hidden whitespace-nowrap">
            {session?.user?.name ?? "User"}
          </h2>
          <span className="text-12-regular truncate overflow-hidden whitespace-nowrap text-gray-400 sm:text-[10px]">
            {session?.user?.email ?? "no-email@example.com"}
          </span>
        </div>
      </div>

      <Separator className="border-accent/10 mb-2 border" />

      <button
        type="button"
        className="cursor-pointer text-left"
        onClick={() =>
          signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push(ROUTES.SIGN_IN);
              },
            },
          })
        }
      >
        <LogOut className="mr-2 inline" size={20} />
        <span className="text-14-medium">Logout</span>
      </button>
    </div>
  );
};

export default ProfileLogout;
