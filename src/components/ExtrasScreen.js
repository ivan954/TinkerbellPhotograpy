import React from "react";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from "react-bootstrap";

const ExtrasScreen = ({ nature, atHome, nature2 }) => {
  return (
    <Container className="mt-5">
      {nature && (
        <Container>
          <ListGroup className="mb-5">
            <ListGroupItem
              className="text-center"
              style={{ backgroundColor: "#FFF0F5" }}
            >
              <p>
                *************צילומים בטבע בתוספת של 200 ש"ח בקרבת
                מודיעין*************
              </p>
            </ListGroupItem>
          </ListGroup>
        </Container>
      )}
      {nature2 && (
        <Container>
          <ListGroup className="mb-5">
            <ListGroupItem
              className="text-center"
              style={{ backgroundColor: "#FFF0F5" }}
            >
              <p>
                *************צילומים בטבע בתוספת של 100 ש"ח בקרבת
                מודיעין*************
              </p>
            </ListGroupItem>
          </ListGroup>
        </Container>
      )}
      {atHome && (
        <Container>
          <ListGroup className="mb-5">
            <ListGroupItem
              className="text-center"
              style={{ backgroundColor: "#FFF0F5" }}
            >
              <p>
                *************הגעה לבית הלקוח בתוספת של 300 ש"ח *************
              </p>
            </ListGroupItem>
          </ListGroup>
        </Container>
      )}

      <Card className="text-center d-block w-75 rounded m-auto">
        <Card.Header style={{ backgroundColor: "#FFF0F5" }}>
          {" "}
          <h1>תוספות</h1>{" "}
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>פיתוח תמונות 15*10 - 1.50 ש"ח לתמונה</ListGroup.Item>
          <ListGroup.Item>
            תמונה אחת מעוצבת בפוטושופ 20 ש"ח (מעל 10 תמונות 15 ש"ח לתמונה)
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>קנבסים</th>
                    <th>קאפות</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>100₪ - 20 X 30</td>
                    <td>60₪ - 20 X 30</td>
                  </tr>
                  <tr>
                    <td>120₪ - 30 X 30</td>
                    <td>65₪ - 30 X 30</td>
                  </tr>
                  <tr>
                    <td>150₪ - 30 X 40</td>
                    <td>70₪ - 30 X 40</td>
                  </tr>
                  <tr>
                    <td>180₪ - 40 X 60</td>
                    <td>80₪ - 40 X 60</td>
                  </tr>
                  <tr>
                    <td>180₪ - 50 X 50</td>
                    <td>85₪ - 50 X 50</td>
                  </tr>
                  <tr>
                    <td>190₪ - 80 X 30</td>
                    <td>90₪ - 30 X 80</td>
                  </tr>
                  <tr>
                    <td>200₪ - 70 X 50</td>
                    <td>100₪ - 50 X 70</td>
                  </tr>
                  <tr>
                    <td>220₪ - 70 X 70</td>
                    <td>110₪ - 80 X 60</td>
                  </tr>
                  <tr>
                    <td>220₪ - 80 X 60</td>
                    <td>110₪ - 70 X 70</td>
                  </tr>
                  <tr>
                    <td>240₪ - 100 X 70</td>
                    <td>130₪ - 70 X 100</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </ListGroup.Item>
          <ListGroupItem>
            <Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>אלבום דיגיטלי פרימיום</th>
                    <th>אלבום דיגיטלי רגיל</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>500₪ - 25 X 25</td>
                    <td>300₪ - 20 X 20</td>
                  </tr>
                  <tr>
                    <td>520₪ - 30 X 22</td>
                    <td>340₪ - 22 X 30 </td>
                  </tr>
                  <tr>
                    <td>600₪ - 30 X 30</td>
                    <td>400₪ - 30 X 30</td>
                  </tr>
                  <tr>
                    <td>650₪ - 30 X 40</td>
                    <td>450₪ - 30 X 40</td>
                  </tr>
                  <tr>
                    <td>700₪ - 40 X 40</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
      <ListGroup className="mt-5">
        <ListGroupItem
          className="text-center"
          style={{ backgroundColor: "#FFF0F5" }}
        >
          <h4>תנאי תשלום/ביטול</h4>
          <p>
            ניתן לשלם בהעברה /מזומן /אפליקציית תשלום עם קביעת מועד הצילומים תגבה
            מקדמה על סך 200 ש"ח יתרת התשלום תבוצע במלואה ביום הצילומים. ביטול
            העסקה כרוך בתשלום של המקדמה ששולם בסגירת התאריך. דחיית מועד הצילומים
            עד 48 שעות מהמועד שנקבע. לא יינתן החזר על ביטול שלא במסגרת ה- 48
            שעות
          </p>
        </ListGroupItem>
      </ListGroup>
    </Container>
  );
};

export default ExtrasScreen;
