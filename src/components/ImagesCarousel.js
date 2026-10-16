import React from "react";
import { Container, Carousel } from "react-bootstrap";
import homeData from "../data/components/screens/home.json";

const ImagesCarousel = () => {
  const { carousel } = homeData;

  return (
    <Container>
      <Carousel fade variant="dark" interval={carousel.interval}>
        {carousel.images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 rounded"
              src={`${process.env.PUBLIC_URL}${image.path}`}
              alt={image.alt}
              onError={(e) => {
                e.target.onerror = null;
                console.error(`Failed to load carousel image ${index + 1}`);
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default ImagesCarousel;
