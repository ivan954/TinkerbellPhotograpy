import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./GalleryScreen.css";

const GalleryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [images, setImages] = useState([]);

  const galleryCategories = [
    { name: "children", path: "Children", title: "ילדים" },
    { name: "family", path: "Family", title: "משפחה" },
    { name: "firstClass", path: "FirstClass", title: "'כיתה א" },
    { name: "newBorn", path: "NewBorn", title: "ניו-בורן" },
    { name: "oneYearOld", path: "OneYearOld", title: "בן שנה" },
    { name: "pregnancy", path: "Pregnancy", title: "הריון" },
    { name: "purim", path: "Purim", title: "פורים" },
  ];

  useEffect(() => {
    const loadGalleryImages = () => {
      try {
        const galleryImages = galleryCategories.map((category) => ({
          name: category.name,
          url: `${process.env.PUBLIC_URL}/images/Gallery/${category.path}/GalleryFaceCard/image.jpg`,
        }));

        setImages(galleryImages);
        setLoading(false);
      } catch (error) {
        setError("Failed to load gallery images");
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  const getHebrewTitle = (name) => {
    const category = galleryCategories.find((cat) => cat.name === name);
    return category ? category.title : name;
  };

  return (
    <Container className="gallery-container">
      {loading ? (
        <div className="gallery-loader">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="gallery-grid g-4">
            {images.map((image, index) => (
              <Col lg={4} md={6} sm={12} key={index} className="gallery-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="gallery-card">
                    <div className="gallery-card-title">
                      {getHebrewTitle(image.name)}
                    </div>
                    <Card.Img
                      className="gallery-image"
                      src={image.url}
                      loading="lazy"
                      alt={getHebrewTitle(image.name)}
                    />
                    <div className="gallery-overlay">
                      <Button
                        className="gallery-button"
                        as={Link}
                        to={`/imagescreen/${image.name}`}
                      >
                        צפה בגלריה
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
    </Container>
  );
};

export default GalleryScreen;
