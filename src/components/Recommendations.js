import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import "./Recommendations.css";

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);

  const recommendations = Array.from({ length: 6 }, (_, index) => ({
    path: `${process.env.PUBLIC_URL}/images/Recommendations/${index + 1}.jpeg`,
    alt: `המלצה ${index + 1}`,
  }));

  useEffect(() => {
    let loadedCount = 0;
    const imagePromises = recommendations.map((rec) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = rec.path;
        img.onload = () => {
          loadedCount++;
          resolve(rec);
        };
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${rec.path}`));
      });
    });

    Promise.all(imagePromises)
      .then((images) => {
        setLoadedImages(images);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading images:", err);
        setError("Failed to load recommendation images");
        setLoading(false);
      });

    return () => {
      // Cleanup
      setLoadedImages([]);
      setLoading(true);
      setError(null);
    };
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Loader />
      </Container>
    );
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <Container className="recommendations-container">
      <Carousel
        fade
        variant="dark"
        interval={3000}
        className="recommendations-carousel"
      >
        {loadedImages.map((recommendation, index) => (
          <Carousel.Item key={index}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "600px" }}
            >
              <img
                src={recommendation.path}
                alt={recommendation.alt}
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
