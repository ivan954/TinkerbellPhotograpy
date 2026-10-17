import React from "react";
import { Carousel } from "react-bootstrap";
import "./Recommendations.css";

const recommendations = Array.from({ length: 6 }, (_, index) => ({
  path: `${process.env.PUBLIC_URL}/images/Recommendations/${index + 1}.jpeg`,
  alt: `המלצה ${index + 1}`,
}));

const Recommendations = () => {
  return (
    <Carousel
      interval={5000}
      variant="dark"
      className="recommendations-carousel"
    >
      {recommendations.map((recommendation, index) => (
        <Carousel.Item key={index}>
          <div className="recommendation-slide">
            <img
              src={recommendation.path}
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
