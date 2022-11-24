import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Pagination from "../components/Pagination";
import { storage } from "../firebase-config";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ImagesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [images, setImages] = useState([]);
  const path = window.location.pathname.split("/");

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRelevantImages = async () => {
    setImages([]);
    try {
      switch (path[2]) {
        case "children":
          const childrenRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Children/"
          );
          const children = await listAll(childrenRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
            window.scrollTo(0, 0);
            setLoading(false);
          });

          break;
        case "family":
          const familyRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Family/"
          );
          const family = await listAll(familyRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
            window.scrollTo(0, 0);
            setLoading(false);
          });
          break;
        case "newBorn":
          const newBornRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/NewBorn/"
          );
          const newBorn = await listAll(newBornRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
            window.scrollTo(0, 0);
            setLoading(false);
          });
          break;
        case "oneYearOld":
          const oneYearOldRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/OneYearOld/"
          );
          const oneYearOld = await listAll(oneYearOldRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
          });
          window.scrollTo(0, 0);
          setLoading(true);
          break;
        case "pregnancy":
          const pregnancyRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Pregnancy/"
          );
          const pregnancy = await listAll(pregnancyRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
            window.scrollTo(0, 0);
            setLoading(false);
          });
          break;
        case "purim":
          const purimRef = ref(
            storage,
            "gs://tinkerbellphotograpy.appspot.com/Gallery/Purim/"
          );
          const purim = await listAll(purimRef).then((response) => {
            response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                setImages((prev) => [...prev, url]);
              });
            });
            window.scrollTo(0, 0);
            setLoading(false);
          });
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
  }, [currentPage]);

  return (
    <Container fluid style={{ marginTop: "100px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Row>
            {images
              .slice(indexOfFirstPost, indexOfLastPost)
              .map((galery, index) => (
                <Col xs={6} md={6} key={index}>
                  <Card className="bg-dark text-white shadow rounded m-2">
                    <Card.Img src={galery} alt="Card image" />
                  </Card>
                </Col>
              ))}
          </Row>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={images.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </Container>
      )}
    </Container>
  );
};

export default ImagesScreen;
