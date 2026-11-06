import { imageUrl, storagePath, webpPath } from "../content/images";
import supabase from "./supabaseClient";
import { IMAGES_BUCKET } from "../content/config";
import { uploadWebpCopies } from "./uploadImage";

// Every photo in the content that is stored in the bucket, once each.
export const findPhotos = (value, found = new Set()) => {
  if (typeof value === "string") {
    if (/^\S+\.(jpe?g|png)$/i.test(value) && storagePath(value)) found.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => findPhotos(item, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => findPhotos(item, found));
  }
  return found;
};

const PARALLEL = 4;

// Runs `task` for each item, a few at a time.
const eachLimited = async (items, task) => {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      while (queue.length) await task(queue.shift());
    })
  );
};

// The photos whose 800px WebP copy isn't in the bucket yet.
export const findMissingWebp = async (content) => {
  const missing = [];
  await eachLimited(findPhotos(content), async (path) => {
    const { publicUrl } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(webpPath(storagePath(path), 800));
    // The query string keeps a cached "not found" from hiding a new copy.
    const response = await fetch(`${publicUrl}?check=${Date.now()}`, { method: "HEAD", cache: "no-store" }).catch(
      () => ({ ok: false })
    );
    if (!response.ok) missing.push(path);
  });
  return missing;
};

// Makes the WebP copies of `paths` from their stored photos.
// `onProgress(done, total)` after each one; returns the photos that failed.
export const createWebpCopies = async (paths, onProgress = () => {}) => {
  const failed = [];
  let done = 0;
  await eachLimited(paths, async (path) => {
    try {
      const response = await fetch(imageUrl(path));
      if (!response.ok) throw new Error(`התמונה לא נמצאה (${response.status})`);
      const made = await uploadWebpCopies(await response.blob(), storagePath(path), { skipExisting: true });
      if (!made) throw new Error("הדפדפן הזה לא יודע ליצור WebP");
    } catch (error) {
      failed.push({ path, message: error.message });
    }
    done += 1;
    onProgress(done, paths.length);
  });
  return failed;
};
