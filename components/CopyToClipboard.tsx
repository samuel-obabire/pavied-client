"use client";

import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "react-use";

const CopyToClipboard = ({ text, className }: { text: string, className: string }) => {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(text);

    if (!state.error) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className="cursor-pointer p-1 transition hover:opacity-80"
    >
      {state.error ? (
        <span className="text-sm text-red-500">Error</span>
      ) : copied ? (
        <CopyCheck className={`text-green-500  ${className}`} />
      ) : (
        <Copy className={className} />
      )}
    </button>
  );
};

export default CopyToClipboard;
