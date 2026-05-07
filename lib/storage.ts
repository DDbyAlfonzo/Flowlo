import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

function safeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadProductImage(userId: string, file: File) {
  const fileName = `${Date.now()}-${safeFileName(file.name)}`;
  const fileRef = ref(storage, `users/${userId}/products/${fileName}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
