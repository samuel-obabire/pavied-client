import { ExternalLink as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ExternalLink = ({ link }: { link: string }) => {
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <LinkIcon
        className=""
        height={20}
        width={20}
        onClick={() => router.push(link)}
      />
    </div>
  );
};

export default ExternalLink;
