import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { storage } from "../firebase-config";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ImagesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [images, setImages] = useState([]);
  const path = window.location.pathname.split("/");

  const loadImages = async (imagesRef) => {
    await listAll(imagesRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImages((prev) => [...prev, url]);
        });
      });
      setLoading(false);
    });
  };

  const getRelevantImages = async () => {
    try {
      switch (path[2]) {
        case "children":
          const childrenRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Children/"
          );
          loadImages(childrenRef);
          break;
        case "family":
          const familyRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Family/"
          );
          loadImages(familyRef);
          break;
        case "newBorn":
          const newBornRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/NewBorn/"
          );
          loadImages(newBornRef);
          break;
        case "oneYearOld":
          const oneYearOldRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/OneYearOld/"
          );
          loadImages(oneYearOldRef);
          break;
        case "pregnancy":
          const pregnancyRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Pregnancy/"
          );
          loadImages(pregnancyRef);
          break;
        case "purim":
          const purimRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Purim/"
          );
          loadImages(purimRef);
          break;
        default:
          break;
      }
    } catch (error) {
      error.response && error.response.data.message
        ? setError(error.response.data.message)
        : setError(error.message);
    }
  };
  useEffect(() => {
    getRelevantImages();
  }, []);

  return (
    <Container style={{ marginTop: "100px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          {images.map((gallery) => (
            <LazyLoadImage
              width="400px"
              height="500px"
              key={gallery}
              src={gallery}
              effect="blur"
              placeholderSrc={gallery}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default ImagesScreen;
