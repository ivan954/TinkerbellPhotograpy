import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Message from "../components/Message";
import galleryManifest from "../data/galleryManifest.json";
import "./ImagesScreen.css";

const ImagesScreen = () => {
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { name } = useParams();

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyPress = (event) => {
    if (!showModal) return;

    switch (event.key) {
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
        handleNext();
        break;
      case "Escape":
        handleClose();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal]);

  // Preload the neighbouring photos so the arrows switch instantly.
  useEffect(() => {
    if (!showModal || images.length < 2) return;
    [selectedImageIndex - 1, selectedImageIndex + 1].forEach((index) => {
      const image = images[(index + images.length) % images.length];
      new window.Image().src = image.path;
    });
  }, [showModal, selectedImageIndex, images]);

  useEffect(() => {
    const category =Object.keys(galleryManifest).find(
      (key) => key.toLowerCase() === name?.toLowerCase()
    );

    if (!category) {
      setError(`Invalid gallery category: ${name}`);
      return;
    }

    setError(null);
    setImages(
      galleryManifest[category].map((index) => ({
        path: `${process.env.PUBLIC_URL}/images/Gallery/${category}/${index}.jpg`,
        thumb: `${process.env.PUBLIC_URL}/images/thumbs/Gallery/${category}/${index}.jpg`,
        alt: `${category} Image ${index}`,
      }))
    );
  }, [name]);

  return (
    <Container>
      {error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {images.map((image, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Image
                  className="gallery-image"
                  src={image.thumb}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  width="100%"
                  onClick={() => handleImageClick(index)}
                />
              </Col>
            ))}
          </Row>

          <Modal
            show={showModal}
            onHide={handleClose}
            centered
            size="xl"
            className="gallery-modal"
          >
            <button
              className="close-button"
              onClick={handleClose}
              aria-label="Close modal"
            ></button>
            <Modal.Body>
              <button
                className="navigation-button prev-button"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <Image
                className="modal-image"
                src={images[selectedImageIndex]?.path}
                alt={images[selectedImageIndex]?.alt}
              />
              <button
                className="navigation-button next-button"
                onClick={handleNext}
                aria-label="Next image"
              >
                &#10095;
              </button>
              <div className="image-counter">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default ImagesScreen;
