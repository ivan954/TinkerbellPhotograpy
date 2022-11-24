import React, { useEffect, useState } from "react";
import { Container, Carousel } from "react-bootstrap";
import { storage } from "../firebase-config";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Message from "./Message";
import Loader from "./Loader";

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [recommendationsList, setRecommendationsList] = useState([]);
  const recommendationsDataRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Recommendations/"
  );

  const getRecommendationsImage = async () => {
    try {
      listAll(recommendationsDataRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setRecommendationsList((prev) => [...prev, url]);
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
    getRecommendationsImage();
  }, []);

  return (
    <Container fluid>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Carousel variant="dark" interval={2000}>
            {recommendationsList?.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-50 rounded m-auto p-3"
                  src={image}
                  alt=""
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      )}
    </Container>
  );
};

export default Recommendations;
