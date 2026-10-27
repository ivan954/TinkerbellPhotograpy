import { IMAGES_BUCKET, SUPABASE_URL } from "./config";

// All photos live in Supabase Storage (bucket "site-images"), none in the
// site's code. The content stores either a full URL (photos uploaded in the
// admin screen) or a path inside the bucket (the built-in content, e.g.
// "bundled/Gallery/NewBorn/1.jpg"). Each photo has an 800px-wide copy at the
// same path under thumbs/.

const isAbsolute = (path) => /^https?:\/\//.test(path);
const BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}`;

export const imageUrl = (path) => (!path || isAbsolute(path) ? path : `${BUCKET_URL}/${path}`);

export const thumbUrl = (path) => {
  if (!path) return path;
  if (isAbsolute(path)) {
    return path.replace(`/${IMAGES_BUCKET}/`, `/${IMAGES_BUCKET}/thumbs/`);
  }
  return `${BUCKET_URL}/thumbs/${path}`;
};
