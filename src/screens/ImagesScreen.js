import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./ImagesScreen.css";

const ImagesScreen = () => {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let mounted = true;

    const loadImages = async (category) => {
      if (!mounted) return;

      try {
        const loadImage = (path) => {
          return new Promise((resolve, reject) => {
            try {
              const img = document.createElement("img");
              img.src = path;
              img.onload = () => {
                resolve(path);
              };
              img.onerror = () => {
                reject();
              };
            } catch (error) {
              reject(error);
            }
          });
        };

        const tryLoadImage = async (basePath) => {
          try {
            const path = `${process.env.PUBLIC_URL}${basePath}.jpg`;
            await loadImage(path);
            return path;
          } catch {
            return null;
          }
        };

        let successfullyLoaded = [];
        let index = 1;
        let consecutiveFailures = 0;

        while (consecutiveFailures < 2 && index <= 50) {
          const basePath = `/images/Gallery/${category}/${index}`;
          const path = await tryLoadImage(basePath);

          if (path) {
            consecutiveFailures = 0;
            successfullyLoaded.push({
              path,
              alt: `${category} Image ${index}`,
            });
          } else {
            consecutiveFailures++;
          }

          index++;
        }

        if (!mounted) return;

        if (successfullyLoaded.length === 0) {
          throw new Error(`No images could be loaded from ${category} gallery`);
        }

        setImages(successfullyLoaded);
        setLoading(false);
      } catch (error) {
        if (!mounted) return;
        console.error("Error loading images:", error);
        setError(
          `Failed to load images from ${category} gallery: ${error.message}`
        );
        setLoading(false);
      }
    };

    const category = (() => {
      if (!name) return null;

      const categoryMap = {
        children: "Children",
        family: "Family",
        firstclass: "FirstClass",
        firstClass: "FirstClass",
        newborn: "NewBorn",
        newBorn: "NewBorn",
        oneyearold: "OneYearOld",
        oneYearOld: "OneYearOld",
        pregnancy: "Pregnancy",
        purim: "Purim",
      };

      const normalizedName = name.toLowerCase();
      return categoryMap[normalizedName] || null;
    })();

    if (category) {
      loadImages(category);
    } else {
      setError(`Invalid gallery category: ${name}`);
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [name]);

  return (
    <Container style={{ marginTop: "100px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {images.map((image, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Image
                  className="gallery-image"
                  src={image.path}
                  alt={image.alt}
                  loading="lazy"
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
