import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ExtrasScreen from "../../components/ExtrasScreen";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { storage } from "../../firebase-config";

const TadmitPrices = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [images, setImages] = useState([]);

  const tadmitRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Gallery/Tadmit/Prices/"
  );

  useEffect(() => {
    try {
      listAll(tadmitRef).then((response) => {
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
  }, []);

  return (
    <Container style={{ marginTop: "10%" }} fluid>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Container>
            <h1 className="text-center">צילומי תדמית</h1>
          </Container>
          <Container>
            <Row>
              {images
                .sort((a, b) => a.name - b.name)
                .map((image, index) => (
                  <div key={index}>
                    {image.name === "1" && (
                      <Col>
                        <Card
                          className="m-2"
                          style={{
                            backgroundImage:
                              "linear-gradient(to bottom, #FFFF, #FFF0F5",
                          }}
                        >
                          <Card.Img variant="top" src={image.url} />
                          <Card.Body className="text-center">
                            <Card.Text>500 ש"ח</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד חצי שעה צילומים</li>
                              <li>ללא הגבלת אביזרים ורקעים</li>
                              <li>7 תמונות ערוכות בפטושופ</li>
                              <li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
                              <li>כל שעה נוספת 250 ש"ח</li>
                            </ul>
                          </Card.Footer>
                        </Card>
                      </Col>
                    )}
                  </div>
                ))}
            </Row>
          </Container>

          <ExtrasScreen nature2={true} />
        </Container>
      )}
    </Container>
  );
};

export default TadmitPrices;
