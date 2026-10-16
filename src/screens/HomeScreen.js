import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import ImagesCarousel from "../components/ImagesCarousel";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Recommendations from "../components/Recommendations";
import homeData from "../data/components/screens/home.json";
import "./HomeScreen.css";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const aboutImagePath = `${process.env.PUBLIC_URL}/images/thumbs/About/About.jpeg`;
  const { welcome } = homeData;

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setError("Failed to load image");
    setLoading(false);
  };

  return (
    <div className="home-container">
      <Container fluid>
        <ImagesCarousel />
      </Container>

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h1 className="mb-4">{welcome.title}</h1>
            <div className="about-section">
              <h2>{welcome.about.title}</h2>
              <Row className="align-items-center">
                <Col md={6}>
                  <p>{welcome.about.text}</p>
                </Col>
                <Col md={6}>
                  {loading && <Loader />}
                  {error && <Message variant="danger">{error}</Message>}
                  <Image
                    src={aboutImagePath}
                    alt="About Me"
                    fluid
                    rounded
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: loading ? "none" : "block" }}
                    className="about-image"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid className="mt-5">
        <Recommendations />
      </Container>
    </div>
  );
};

export default HomeScreen;
