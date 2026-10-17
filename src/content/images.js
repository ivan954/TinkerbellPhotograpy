import { IMAGES_BUCKET } from "./config";

const isAbsolute = (path) => /^https?:\/\//.test(path);

// Bundled photos are stored as "/images/...", uploaded ones as full Supabase URLs.
export const imageUrl = (path) =>
  !path || isAbsolute(path) ? path : `${process.env.PUBLIC_URL}${path}`;

// Small version of a photo: bundled ones live under /images/thumbs/ (made by
// scripts/optimize-images.js), uploaded ones under thumbs/ in the bucket.
export const thumbUrl = (path) => {
  if (!path) return path;
  if (isAbsolute(path)) {
    return path.replace(`/${IMAGES_BUCKET}/`, `/${IMAGES_BUCKET}/thumbs/`);
  }
  return imageUrl(path.replace("/images/", "/images/thumbs/"));
};
