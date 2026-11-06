import React, { useState } from "react";
import { imageUrl, thumbUrl, webpSrcSet } from "../content/images";

// A photo from the content (a URL or a path in the bucket, see
// content/images.js). Browsers pick the WebP copy that fits `sizes` (400, 800
// or 1600px wide); if the WebP copies don't exist yet, the photo switches to
// its JPEG copies (800px and full size) instead of showing a broken image.
// `thumbOnly` keeps the JPEG fallback at 800px (for small tiles and cards).
const Photo = ({ path, sizes = "100vw", alt, thumbOnly = false, ...rest }) => {
  // Remembered per photo, so a reused <Photo> showing another photo tries WebP again.
  const [failedPath, setFailedPath] = useState(null);
  if (!path) return null;

  const webp = failedPath !== path && webpSrcSet(path);
  const thumb = thumbUrl(path);
  const full = imageUrl(path);
  const jpegSrcSet = thumbOnly || thumb === full ? undefined : `${thumb} 800w, ${full} 1920w`;

  return (
    <img
      src={webp || thumbOnly ? thumb : full}
      srcSet={webp || jpegSrcSet}
      sizes={webp || jpegSrcSet ? sizes : undefined}
      alt={alt}
      onError={webp ? () => setFailedPath(path) : undefined}
      {...rest}
    />
  );
};

export default Photo;
