import React, { useState } from "react";
import { Container, Carousel } from "react-bootstrap";
import homeData from "../data/components/screens/home.json";

const ImagesCarousel = () => {
  const { carousel } = homeData;
  // Only the slides up to this index are loaded: the visible one and the next,
  // so the rest of the photos don't compete with the first one.
  const [loadedUpTo, setLoadedUpTo] = useState(1);

  const handleSlide = (nextIndex) => {
    setLoadedUpTo((current) => Math.max(current, nextIndex + 1));
  };

  return (
    <Container>
      <Carousel
        fade
        variant="dark"
        interval={carousel.interval}
        onSlide={handleSlide}
      >
        {carousel.images.map((image, index) => (
          <Carousel.Item key={index}>
            {(index <= loadedUpTo ||
              index === carousel.images.length - 1) && (
              <img
                className="d-block w-100 rounded"
                src={`${process.env.PUBLIC_URL}${image.path}`}
                srcSet={`${process.env.PUBLIC_URL}${image.path.replace("/images/", "/images/thumbs/")} 800w, ${process.env.PUBLIC_URL}${image.path} 1920w`}
                sizes="100vw"
                alt={image.alt}
                fetchpriority={index === 0 ? "high" : "low"}
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  console.error(`Failed to load carousel image ${index + 1}`);
                }}
              />
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default ImagesCarousel;
