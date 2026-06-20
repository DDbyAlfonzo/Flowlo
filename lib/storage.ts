import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ALLOWED_PRODUCT_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function safeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

function hasAllowedImageExtension(name: string) {
  const lowerName = name.trim().toLowerCase();
  return ALLOWED_PRODUCT_IMAGE_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension),
  );
}

function getFileValidationError(file: File) {
  const fileType = file.type.trim().toLowerCase();
  const hasAllowedType = ALLOWED_PRODUCT_IMAGE_TYPES.has(fileType);
  const hasAllowedExtension = hasAllowedImageExtension(file.name);

  if (!hasAllowedType && !hasAllowedExtension) {
    return "Please upload a JPG, PNG, or WebP image.";
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    return "Please upload an image smaller than 5MB.";
  }

  return null;
}

function mapUploadError(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code ?? "")
      : "";

  switch (code) {
    case "storage/unauthorized":
      return "You do not have permission to upload this image.";
    case "storage/canceled":
      return "The image upload was cancelled. Please try again.";
    case "storage/quota-exceeded":
      return "Image uploads are temporarily unavailable. Please try again later.";
    case "storage/retry-limit-exceeded":
      return "The image upload took too long. Please try a smaller image or a stronger connection.";
    case "storage/invalid-checksum":
    case "storage/server-file-wrong-size":
      return "The image upload was interrupted. Please try again.";
    default:
      if (error instanceof Error && error.message.trim()) {
        return error.message;
      }

      return "We could not upload the product image. Please try again.";
  }
}

export function validateProductImageFile(file: File) {
  return getFileValidationError(file);
}

export async function uploadProductImage(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void,
) {
  const validationError = getFileValidationError(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const fileName = `${Date.now()}-${safeFileName(file.name)}`;
  const fileRef = ref(storage, `users/${userId}/products/${fileName}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;

        onProgress?.(Math.min(progress, 100));
      },
      (error) => {
        reject(new Error(mapUploadError(error)));
      },
      async () => {
        try {
          onProgress?.(100);
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          reject(new Error(mapUploadError(error)));
        }
      },
    );
  });
}
