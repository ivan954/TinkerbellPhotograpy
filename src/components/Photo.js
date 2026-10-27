import React from "react";

// Bundled photos that scripts/optimize-images.js also saves as WebP (about
// 30% lighter). Uploaded photos and other folders are served as they are.
const HAS_WEBP = /\/images\/(thumbs\/|Carousel\/|About\/)[^?]*\.jpe?g$/i;

const toWebp = (url) => url.replace(/\.jpe?g$/i, ".webp");

// An <img> that browsers with WebP support load in the lighter format.
// With `thumb`, the small version is used on narrow screens.
const Photo = ({ src, thumb, sizes, alt, ...rest }) => {
  if (!src) return null;
  const srcSet = thumb && thumb !== src ? `${thumb} 800w, ${src} 1920w` : undefined;
  const urls = [src, thumb].filter(Boolean);
  const img = <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} {...rest} />;

  if (!urls.every((url) => HAS_WEBP.test(url))) return img;

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={srcSet ? `${toWebp(thumb)} 800w, ${toWebp(src)} 1920w` : toWebp(src)}
        sizes={srcSet ? sizes : undefined}
      />
      {img}
    </picture>
  );
};

export default Photo;
