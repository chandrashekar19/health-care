"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        const isValidType = allowedTypes.includes(file.type);
        const isValidSize = file.size <= 2 * 1024 * 1024; // ✅ 2MB max

        return isValidType && isValidSize;
      });

      onChange(validFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="file-upload"
      aria-label="Upload identification document"
    >
      <input {...getInputProps()} />

      {files?.length ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded file preview"
          className="max-h-[400px] overflow-hidden object-cover rounded-lg"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload icon"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag &
              drop
            </p>
            <p className="text-12-regular text-dark-600">
              PNG, JPG, GIF — Max 2MB
            </p>
          </div>
        </>
      )}
    </div>
  );
};
