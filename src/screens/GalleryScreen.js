import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../firebase-config";
import Loader from "../components/Loader";
import Message from "../components/Message";

const GalleryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [isHovering, setIsHovering] = useState(-1);
  const [images, setImages] = useState([]);
  const galleryRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Gallery/GalleryImages/"
  );

  const fetchGallery = () => {
    try {
      listAll(galleryRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            const beforDot = item.name.split(".");
            const img = { url: url, name: beforDot[0] };
            setImages((prev) => [...prev, img]);
          });
        });
        setLoading(false);
      });
    } catch (error) {
      error.response && error.response.data.message
        ? setError(error.response.data.message)
        : setError(error.message);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <Container style={{ marginTop: "100px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row xs={1} md={3}>
          {images.map((image, index) => (
            <Col key={index}>
              <Card
                className="bg-dark text-white shadow rounded m-2"
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(-1)}
              >
                {image.name === "children" ? (
                  <Card.Title className="text-center">ילדים</Card.Title>
                ) : image.name === "family" ? (
                  <Card.Title className="text-center">משפחה</Card.Title>
                ) : image.name === "firstClass" ? (
                  <Card.Title className="text-center">'כיתה א</Card.Title>
                ) : image.name === "newBorn" ? (
                  <Card.Title className="text-center">ניו-בורן</Card.Title>
                ) : image.name === "oneYearOld" ? (
                  <Card.Title className="text-center">בן שנה</Card.Title>
                ) : image.name === "pregnancy" ? (
                  <Card.Title className="text-center">הריון</Card.Title>
                ) : (
                  <Card.Title className="text-center">פורים</Card.Title>
                )}

                <Card.Img src={image.url} loading="lazy" alt="Card-image" />
                {isHovering === index ? (
                  <Card.ImgOverlay
                    style={{ backgroundColor: "white", opacity: "50%" }}
                  >
                    <Button
                      variant="outline-light"
                      className="w-100 h-100 d-flex justify-content-center"
                      href={`imagescreen/${image.name}`}
                    ></Button>
                  </Card.ImgOverlay>
                ) : null}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GalleryScreen;
