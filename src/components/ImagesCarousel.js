import React, { useEffect, useState } from "react";
import { Container, Carousel } from "react-bootstrap";
import { storage } from "../firebase-config";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Message from "./Message";
import Loader from "./Loader";

const ImagesCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [carouselList, setCarouselList] = useState([]);

  const getCaruselImages = async () => {
    const carouselDataRef = ref(
      storage,
      "gs://tinkerbellphotograpy.appspot.com/Carousel/"
    );
    try {
      const data = await listAll(carouselDataRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setCarouselList((prev) => [...prev, url]);
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
    getCaruselImages();
  }, []);

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Carousel variant="dark" interval={2000}>
          {carouselList?.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100 rounded" src={image} alt="" />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default ImagesCarousel;
