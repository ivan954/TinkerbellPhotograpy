import React from "react";
import { Container, Carousel } from "react-bootstrap";
import "./Recommendations.css";

const recommendations = Array.from({ length: 6 }, (_, index) => ({
  path: `${process.env.PUBLIC_URL}/images/Recommendations/${index + 1}.jpeg`,
  alt: `המלצה ${index + 1}`,
}));

const Recommendations = () => {
  return (
    <Container className="recommendations-container">
      <Carousel
        fade
        variant="dark"
        interval={3000}
        className="recommendations-carousel"
      >
        {recommendations.map((recommendation, index) => (
          <Carousel.Item key={index}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "600px" }}
            >
              <img
                src={recommendation.path}
                alt={recommendation.alt}
                fetchpriority="low"
                decoding="async"
                className="rounded shadow"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default Recommendations;
