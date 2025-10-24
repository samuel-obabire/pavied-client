"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

const Dropzone = ({
  handleFileChange,
}: {
  handleFileChange: (f: File) => void;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFileChange(acceptedFiles[0]);
    },
    [handleFileChange]
  );

  const { acceptedFiles, isDragActive, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      onDrop,
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "application/pdf": [],
      },
      maxSize: 1024 * 5000, // 5MB
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="">
      <div
        {...getRootProps({
          className: cn(
            "dropzone",
            "flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-border bg-muted/30",
            "hover:bg-muted/50 hover:border-secondary/50 transition-all duration-200 ease-in-out",
            "cursor-pointer p-8 text-center",
            isDragActive && "border-secondary bg-secondary/10"
          ),
        })}
      >
        <input {...getInputProps()} />
        <p className="text-muted-foreground text-sm">
          Drag and drop your payment reciept here, or click to browse
        </p>
        <em className="text-sm text-gray-500">
          You can upload <span className="font-medium">one file</span> (PNG,
          JPG, or PDF).
        </em>

        <ul>{acceptedFileItems}</ul>
      </div>
    </section>
  );
};

export default Dropzone;
