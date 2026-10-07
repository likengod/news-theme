import React from "react";

interface ImageUploadProps {
  imgRef: React.RefObject<HTMLInputElement>;
  uploadImage: (f?: File | null) => void;
}

export function ImageUpload({ imgRef, uploadImage }: ImageUploadProps) {
  return (
    <input
      ref={imgRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        uploadImage(e.target.files?.[0]);
        if (imgRef.current) imgRef.current.value = "";
      }}
    />
  );
}
