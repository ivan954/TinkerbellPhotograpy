import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ExtrasScreen from "../../components/ExtrasScreen";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { storage } from "../../firebase-config";

const OneYearPrices = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [images, setImages] = useState([]);

  const oneYearOldRef = ref(
    storage,
    "gs://tinkerbellphotograpy.appspot.com/Gallery/OneYearOld/Prices/"
  );

  useEffect(() => {
    try {
      listAll(oneYearOldRef).then((response) => {
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
            <h1 className="text-center">צילומי גיל שנה</h1>
            <p>
              אין כמו לחגוג את יום הולדת הראשון של הגוזלים שלנו, זה באמת סיבה
              למסיבה, גיל שנה זה גיל מתוק לא פחות מהעוגה. ציון דרך שחובה לתעד.
              צילומי סמאש קייק, סמאש ספגטי, אמבטית חלב ועוד מגוון סטים מיוחדים
              וקוסומים שאותם אתם תוכלו למצוא אצלי בטינרגבל סטודיו. אתם בטח
              יכולים לדמיין לעצמכים מה יקרה אם נושיב ילד בן שנה ועוגה יחד, אז
              אצלי בסטודיו הכל עובד הפוך, מה שבבית לרוב אסור אצלי בסטודיו מותר,
              ללכלך ולהיתלכלך זה המאות תוך כדי הנעה גדולה של הילד לאכול מתוק
              והרבה. אני עובדת בשיתוף פעולה עם מעצבת עוגות מיקצועית, אשר תכין את
              העוגה בהתאמה אישית עם המון תשוקה וטעם.
            </p>
          </Container>
          <Container>
            <Row xl={3} xxl={3} md={2} sm={1} xs={1}>
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
                            <Card.Title>חבילה פרימיום</Card.Title>
                            <Card.Text>ש"ח 1,350</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד שעתים צילומים</li>
                              <li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
                              <li>20 תמונות ערוכות בפטושופ</li>
                              <li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
                              <li>צילומי משפחה</li>
                              <li>קנבס 30*40</li>
                              <li>אלבום דיגטילי רגיל 30*30</li>
                              <li>עוגה מעוצבת (בתוספת של 200 ש"ח)</li>
                              <li>כל שעה נוספת 250 ש"ח</li>
                            </ul>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ) : image.name === "2" ? (
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
                            <Card.Title>חבילה אקסטרה</Card.Title>
                            <Card.Text>900 ש"ח</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד שעה וחצי צילומים</li>
                              <li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
                              <li>12 תמונות ערוכות בפטושופ</li>
                              <li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
                              <li>קנבס 30*40</li>
                              <li>
                                צילומי שמפחה ללא הגבלת ילדים (תוספת של 50ש"ח)
                              </li>
                              <li>עוגה מעוצבת (בתוספת של 200 ש"ח)</li>
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
                            <Card.Text>700 ש"ח</Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <ul dir="rtl" className="text-muted">
                              <li>עד שעה צילומים</li>
                              <li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
                              <li>10 תמונות ערוכות בפטושופ</li>
                              <li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
                              <li>
                                צילומי שמפחה ללא הגבלת ילדים (תוספת של 50ש"ח)
                              </li>
                              <li>עוגה מעוצבת (בתוספת של 200 ש"ח)</li>
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

          <ExtrasScreen nature={true} />
        </Container>
      )}
    </Container>
  );
};

export default OneYearPrices;
