// Optimizes the photos in public/images for the web.
//
// 1. Resizes every JPEG to at most MAX_SIZE px on its longest side, re-encodes
//    with mozjpeg and strips EXIF metadata (including GPS). Already-optimized
//    files are skipped, so running the script again does not degrade quality.
// 2. Creates small thumbnails of the gallery, carousel and about photos in
//    public/images/thumbs, used by the grids, cards and on mobile.
// 3. Shrinks the logo to the size it is actually displayed at.
// 4. Writes src/data/galleryManifest.json with the photo numbers of each
//    gallery category, so the app does not have to probe for images.
//
// Usage: npm run optimize-images  (run after adding new photos)

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const THUMBS_DIR = path.join(IMAGES_DIR, "thumbs");
const GALLERY_DIR = path.join(IMAGES_DIR, "Gallery");
const THUMB_SOURCE_DIRS = ["Gallery", "Carousel", "About"].map((dir) =>
  path.join(IMAGES_DIR, dir)
);
const LOGO_PATH = path.join(IMAGES_DIR, "Logo", "Logo.png");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "galleryManifest.json");

const MAX_SIZE = 1920;
const MAX_BYTES = 1024 * 1024;
const QUALITY = 80;
const THUMB_WIDTH = 800;
const THUMB_QUALITY = 75;
const LOGO_WIDTH = 600;

sharp.cache(false);

const isJpeg = (file) => /\.jpe?g$/i.test(file);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return fullPath === THUMBS_DIR ? [] : walk(fullPath);
    }
    return [fullPath];
  });

const optimizeImage = async (file) => {
  // Read into memory first: on Windows sharp keeps the file locked otherwise.
  const input = fs.readFileSync(file);
  const { width, height } = await sharp(input).metadata();
  const size = input.length;
  if (Math.max(width, height) <= MAX_SIZE && size <= MAX_BYTES) {
    return null;
  }

  // rotate() applies the EXIF orientation before the metadata is stripped.
  const buffer = await sharp(input)
    .rotate()
    .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(file, buffer);
  return { before: size, after: buffer.length };
};

const createThumbnail = async (file) => {
  const thumbPath = path.join(THUMBS_DIR, path.relative(IMAGES_DIR, file));
  if (
    fs.existsSync(thumbPath) &&
    fs.statSync(thumbPath).mtimeMs >= fs.statSync(file).mtimeMs
  ) {
    return;
  }

  fs.mkdirSync(path.dirname(thumbPath), { recursive: true });
  await sharp(fs.readFileSync(file))
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(thumbPath);
};

const optimizeLogo = async () => {
  const input = fs.readFileSync(LOGO_PATH);
  const { width } = await sharp(input).metadata();
  if (width <= LOGO_WIDTH) return;

  const buffer = await sharp(input)
    .resize({ width: LOGO_WIDTH })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
  fs.writeFileSync(LOGO_PATH, buffer);
  console.log(
    `optimized Logo.png: ${(input.length / 1024).toFixed(0)}KB -> ` +
      `${(buffer.length / 1024).toFixed(0)}KB`
  );
};

const buildManifest = () => {
  const manifest = {};
  for (const category of fs.readdirSync(GALLERY_DIR)) {
    const categoryDir = path.join(GALLERY_DIR, category);
    if (!fs.statSync(categoryDir).isDirectory()) continue;

    manifest[category] = fs
      .readdirSync(categoryDir)
      .filter((file) => /^\d+\.jpg$/i.test(file))
      .map((file) => parseInt(file, 10))
      .sort((a, b) => a - b);
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
};

const main = async () => {
  const files = walk(IMAGES_DIR).filter(isJpeg);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) {
      totalBefore += result.before;
      totalAfter += result.after;
      console.log(
        `optimized ${path.relative(IMAGES_DIR, file)}: ` +
          `${(result.before / 1048576).toFixed(1)}MB -> ` +
          `${(result.after / 1024).toFixed(0)}KB`
      );
    }
    if (THUMB_SOURCE_DIRS.some((dir) => file.startsWith(dir + path.sep))) {
      await createThumbnail(file);
    }
  }

  await optimizeLogo();
  buildManifest();

  console.log(
    `\nDone. ${(totalBefore / 1048576).toFixed(1)}MB -> ` +
      `${(totalAfter / 1048576).toFixed(1)}MB`
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
