import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ExtrasScreen from "../../components/ExtrasScreen";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { storage } from "../../firebase-config";

const FirstClassPrices = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [images, setImages] = useState([]);

  const firstClassRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Gallery/FirstClass/Prices/"
  );

  useEffect(() => {
    try {
      listAll(firstClassRef).then((response) => {
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
            <h1 className="text-center">'צילומי כיתה א</h1>
          </Container>
          <Container>
            <Row xl={2} xxl={2} md={2} sm={1} xs={1}>
              {images
                .sort((a, b) => a.name - b.name)
                .map((image, index) => (
                  <div key={index}>
                    {image.name === "1" ? (
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
                            <Card.Title>חבילה פרמיום</Card.Title>
                            <Card.Text>450 ש"ח</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד שעה צילומים</li>
                              <li>צילומי משפחה וילדים</li>
                              <li>כל התמונות מקבלים במייל</li>
                              <li>5 תמונות ערוכות בפוטושופ</li>
                              <li>
                                מקבלים 2 מגנטים בגודל A5 או 1 בלוק עץ בגודל
                                10X15 במתנה
                              </li>
                              <li>כל שעה נוספת 250 ש"ח</li>
                            </ul>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ) : (
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
                            <Card.Title>חבילה בסיסית</Card.Title>
                            <Card.Text>300 ש"ח</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד חצי שעה צילומים</li>
                              <li>את כל התמונות מקבלים במייל</li>
                              <li>2 תמונות ערוכות בפוטושופ</li>
                              <li>מקבלים מגנט בגודל A5 מתנה</li>
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

export default FirstClassPrices;
