import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { storage } from "../firebase-config";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Loader from "./Loader";
import Message from "./Message";

const Logo = () => {
  const [logoList, setLogoList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const logoDataRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Logo/"
  );

  const getLogoImage = async () => {
    try {
      const data = await listAll(logoDataRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setLogoList(url);
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
    getLogoImage();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Row>
            <Col className="text-center">
              <img src={logoList} width={300} alt="" />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Logo;
