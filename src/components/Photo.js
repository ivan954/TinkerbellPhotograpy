import React from "react";

// An <img> of a photo and its thumbnail (see content/images.js): with
// `thumb`, narrow screens load the 800px copy and wide ones the full photo.
const Photo = ({ src, thumb, sizes, alt, ...rest }) => {
  if (!src) return null;
  const srcSet = thumb && thumb !== src ? `${thumb} 800w, ${src} 1920w` : undefined;
  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} {...rest} />;
};

export default Photo;
