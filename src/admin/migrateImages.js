import { uploadImageTo } from "./uploadImage";

// One-time move of the photos that shipped inside the site (public/images,
// referenced in the content as "/images/...") to Supabase Storage.
// Each photo is resized like an upload from the admin screen and stored at a
// fixed path (bundled/<its path under images/>), so running it again skips
// what is already there, and the code can point at the same addresses.

// A path to a photo file under /images/ (not just any text that starts so).
export const isBundledPath = (value) =>
  typeof value === "string" && /^\/images\/\S+\.(jpe?g|png|webp)$/i.test(value);

export const bundledStoragePath = (path) =>
  `bundled/${path.slice("/images/".length).replace(/\.jpe?g$/i, ".jpg")}`;

// Every "/images/..." string anywhere in the content, in order, once.
export const findBundledPaths = (value, found = new Set()) => {
  if (isBundledPath(value)) found.add(value);
  else if (Array.isArray(value)) value.forEach((item) => findBundledPaths(item, found));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => findBundledPaths(item, found));
  }
  return found;
};

// A copy of the content with each bundled path replaced through `urls`.
export const replaceBundledPaths = (value, urls) => {
  if (isBundledPath(value)) return urls[value] ?? value;
  if (Array.isArray(value)) return value.map((item) => replaceBundledPaths(item, urls));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceBundledPaths(item, urls)])
    );
  }
  return value;
};

const PARALLEL = 3;

// Uploads every bundled photo in `content` (all documents) and returns the
// documents that change, with Supabase URLs in place of the old paths.
// `onProgress(done, total)` is called after each photo.
export const migrateImages = async (content, onProgress = () => {}) => {
  const paths = [...findBundledPaths(content)];
  const total = paths.length;
  const urls = {};
  const failed = [];
  let done = 0;

  const next = async () => {
    while (paths.length) {
      const path = paths.shift();
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}${path}`);
        if (!response.ok) throw new Error(`הקובץ לא נמצא (${response.status})`);
        const url = await uploadImageTo(await response.blob(), bundledStoragePath(path), {
          skipExisting: true,
        });
        if (!url) throw new Error("לא התקבלה כתובת לתמונה");
        urls[path] = url;
      } catch (error) {
        failed.push({ path, message: error.message });
      }
      done += 1;
      onProgress(done, total);
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, next));

  const changed = Object.fromEntries(
    Object.entries(content)
      .filter(([, data]) => findBundledPaths(data).size > 0)
      .map(([key, data]) => [key, replaceBundledPaths(data, urls)])
  );
  return { changed, failed, uploaded: Object.keys(urls).length };
};
