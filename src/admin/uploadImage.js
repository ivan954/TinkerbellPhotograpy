import supabase from "./supabaseClient";
import { IMAGES_BUCKET } from "../content/config";

// Photos are stored at most 1920px on their longest side, with an 800px-wide
// thumbnail for grids and phones. Drawing on a canvas also drops EXIF data
// such as GPS.
const MAX_SIZE = 1920;
const THUMB_WIDTH = 800;
const JPEG_QUALITY = 0.82;

const toBlob = (bitmap, scale, type) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("לא ניתן לעבד את התמונה"))),
      type,
      JPEG_QUALITY
    )
  );
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

// Resizes a photo and uploads it and its thumbnail (under thumbs/) to `path`;
// returns the public URL to store in the content.
export const uploadImageTo = async (blob, path, { skipExisting = false } = {}) => {
  const { full, thumb } = await resize(blob);
  await Promise.all([upload(path, full, skipExisting), upload(`thumbs/${path}`, thumb, skipExisting)]);
  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
};

// A photo chosen in the admin screen, stored under a new unique name.
const uploadImage = (file, folder) => {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return uploadImageTo(file, `${folder}/${name}.${extensionFor(file.type)}`);
};

export default uploadImage;
