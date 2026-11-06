import supabase from "./supabaseClient";
import { IMAGES_BUCKET } from "../content/config";
import { WEBP_WIDTHS, webpPath } from "../content/images";

// Photos are stored at most 1920px on their longest side, with an 800px-wide
// thumbnail for grids and phones. Drawing on a canvas also drops EXIF data
// such as GPS.
const MAX_SIZE = 1920;
const THUMB_WIDTH = 800;
const JPEG_QUALITY = 0.82;
const WEBP_QUALITY = 0.78;

const toBlob = (bitmap, scale, type, quality = JPEG_QUALITY) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("לא ניתן לעבד את התמונה"))),
      type,
      quality
    )
  );
};

// Safari draws a PNG when asked for WebP, so check before relying on it.
let webpSupport;
export const canWriteWebp = () => {
  if (webpSupport === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    webpSupport = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  }
  return webpSupport;
};

// PNG keeps transparency (e.g. the logo); everything else becomes JPEG.
export const extensionFor = (type) => (type === "image/png" ? "png" : "jpg");

const resize = async (blob) => {
  const type = blob.type === "image/png" ? "image/png" : "image/jpeg";
  const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
  const fullScale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const thumbScale = Math.min(1, THUMB_WIDTH / bitmap.width);
  const [full, thumb] = await Promise.all([
    toBlob(bitmap, fullScale, type),
    toBlob(bitmap, thumbScale, type),
  ]);
  bitmap.close();
  return { full, thumb };
};

// With skipExisting, a file already at that path counts as uploaded, so an
// interrupted batch can simply be run again.
const upload = async (path, blob, skipExisting) => {
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
  const exists = error && (String(error.statusCode) === "409" || /exists|duplicate/i.test(error.message));
  if (error && !(skipExisting && exists)) throw error;
};

// The WebP copies of a photo (see content/images.js): 400, 800 and 1600px
// wide, never wider than the photo itself. Nothing in browsers that can't
// write WebP; the site then shows the JPEG copies.
export const uploadWebpCopies = async (blob, path, { skipExisting = false } = {}) => {
  if (!canWriteWebp()) return false;
  const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
  try {
    const copies = await Promise.all(
      WEBP_WIDTHS.map((width) => toBlob(bitmap, Math.min(1, width / bitmap.width), "image/webp", WEBP_QUALITY))
    );
    if (copies.some((copy) => copy.type !== "image/webp")) return false;
    await Promise.all(
      copies.map((copy, index) => upload(webpPath(path, WEBP_WIDTHS[index]), copy, skipExisting))
    );
    return true;
  } finally {
    bitmap.close();
  }
};

// Resizes a photo and uploads it, its thumbnail (under thumbs/) and its WebP
// copies to `path`; returns the public URL to store in the content.
export const uploadImageTo = async (blob, path, { skipExisting = false } = {}) => {
  const { full, thumb } = await resize(blob);
  await Promise.all([
    upload(path, full, skipExisting),
    upload(`thumbs/${path}`, thumb, skipExisting),
    uploadWebpCopies(blob, path, { skipExisting }),
  ]);
  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
};

// A photo chosen in the admin screen, stored under a new unique name.
const uploadImage = (file, folder) => {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return uploadImageTo(file, `${folder}/${name}.${extensionFor(file.type)}`);
};

export default uploadImage;
