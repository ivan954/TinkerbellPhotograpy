import { IMAGES_BUCKET, SUPABASE_URL } from "./config";

// All photos live in Supabase Storage (bucket "site-images"), none in the
// site's code. The content stores either a full URL (photos uploaded in the
// admin screen) or a path inside the bucket (the built-in content, e.g.
// "bundled/Gallery/NewBorn/1.jpg"). Each photo has:
// - the photo itself (JPEG or PNG, at most 1920px),
// - an 800px-wide JPEG copy under thumbs/,
// - WebP copies 400, 800 and 1600px wide under w400/, w800/ and w1600/ with
//   ".webp" added to the name. These are made on upload (in browsers that can
//   write WebP) or with "יצירת גרסאות WebP" in the admin screen; until a photo
//   has them, the site falls back to the JPEG (see components/Photo.js).

const isAbsolute = (path) => /^https?:\/\//.test(path);
const BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}`;
const BUCKET_PREFIX = `/storage/v1/object/public/${IMAGES_BUCKET}/`;

export const WEBP_WIDTHS = [400, 800, 1600];

export const imageUrl = (path) => (!path || isAbsolute(path) ? path : `${BUCKET_URL}/${path}`);

export const thumbUrl = (path) => {
  if (!path) return path;
  if (isAbsolute(path)) {
    return path.replace(`/${IMAGES_BUCKET}/`, `/${IMAGES_BUCKET}/thumbs/`);
  }
  return `${BUCKET_URL}/thumbs/${path}`;
};

// The photo's path inside the bucket, or null for a photo stored elsewhere.
export const storagePath = (path) => {
  if (!path) return null;
  if (!isAbsolute(path)) return path;
  const index = path.indexOf(BUCKET_PREFIX);
  return index === -1 ? null : decodeURIComponent(path.slice(index + BUCKET_PREFIX.length));
};

export const webpPath = (path, width) => `w${width}/${path}.webp`;

// "url 400w, url 800w, url 1600w" for the WebP copies, or null.
export const webpSrcSet = (path) => {
  const inBucket = storagePath(path);
  if (!inBucket) return null;
  return WEBP_WIDTHS.map(
    (width) => `${BUCKET_URL}/${webpPath(inBucket, width).split("/").map(encodeURIComponent).join("/")} ${width}w`
  ).join(", ");
};
