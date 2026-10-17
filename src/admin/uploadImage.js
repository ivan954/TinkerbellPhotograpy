import supabase from "./supabaseClient";
import { IMAGES_BUCKET } from "../content/config";

// Same sizes as scripts/optimize-images.js, so uploaded photos load as fast as
// the bundled ones. Drawing on a canvas also drops EXIF data such as GPS.
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

const upload = async (path, blob) => {
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
  if (error) throw error;
};

// Uploads a photo and its thumbnail; returns the public URL to store in the content.
const uploadImage = async (file, folder) => {
  // PNG keeps transparency (e.g. the logo); everything else becomes JPEG.
  const isPng = file.type === "image/png";
  const type = isPng ? "image/png" : "image/jpeg";
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  const fullScale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const thumbScale = Math.min(1, THUMB_WIDTH / bitmap.width);
  const [full, thumb] = await Promise.all([
    toBlob(bitmap, fullScale, type),
    toBlob(bitmap, thumbScale, type),
  ]);
  bitmap.close();

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${isPng ? "png" : "jpg"}`;
  const path = `${folder}/${name}`;
  await Promise.all([upload(path, full), upload(`thumbs/${path}`, thumb)]);

  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
};

export default uploadImage;
