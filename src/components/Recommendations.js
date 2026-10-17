import React from "react";
import { Carousel } from "react-bootstrap";
import { imageUrl } from "../content/images";
import "./Recommendations.css";

const Recommendations = ({ images }) => {
  return (
    <Carousel
      interval={5000}
      variant="dark"
      className="recommendations-carousel"
    >
      {images.map((recommendation) => (
        <Carousel.Item key={recommendation.path}>
          <div className="recommendation-slide">
            <img
              src={imageUrl(recommendation.path)}
              alt={recommendation.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Recommendations;
