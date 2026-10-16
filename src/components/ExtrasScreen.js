import React from "react";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from "react-bootstrap";
import commonData from "../data/components/screens/common.json";
import "./ExtrasScreen.css";

const ExtrasScreen = () => {
  const { extras } = commonData;

  if (!extras) {
    return (
      <div className="extras-container">
        <Card className="text-center d-block w-75 rounded m-auto">
          <Card.Header style={{ backgroundColor: "#FFF0F5" }}>
            <h1>{commonData?.loading || "טוען נתונים..."}</h1>
          </Card.Header>
        </Card>
      </div>
    );
  }

  return (
    <div className="extras-container">
      <Card className="text-center d-block w-75 rounded m-auto">
        <Card.Header style={{ backgroundColor: "#FFF0F5" }}>
          <h1>{extras.title}</h1>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {extras.items.map((item, index) => (
              <ListGroupItem key={index}>{item}</ListGroupItem>
            ))}
          </ListGroup>
          <Container className="mt-4">
            <Row>
              <div className="col-md-6">
                <h3>{extras.tables.headers.canvas}</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>גודל</th>
                      <th>מחיר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extras.tables.prices.canvas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.size}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-6">
                <h3>{extras.tables.headers.kapa}</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>גודל</th>
                      <th>מחיר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extras.tables.prices.kapa.map((item, index) => (
                      <tr key={index}>
                        <td>{item.size}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExtrasScreen;
