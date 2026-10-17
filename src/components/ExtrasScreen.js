import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useContent } from "../content/ContentProvider";
import "./ExtrasScreen.css";

const PriceTable = ({ title, rows }) => (
  <div className="extras-table">
    <h3>{title}</h3>
    <Table borderless className="mb-0">
      <thead>
        <tr>
          <th>גודל (ס"מ)</th>
          <th>מחיר</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => (
          <tr key={index}>
            <td>{item.size}</td>
            <td>{item.price}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

const ExtrasScreen = () => {
  const { extras, pricesPage } = useContent("common");
  if (!extras.visible) return null;

  return (
    <section className="section extras">
      <Container>
        <div className="section-heading">
          <span className="section-eyebrow">{pricesPage.extrasEyebrow}</span>
          <h2>{extras.title}</h2>
        </div>
        <ul className="extras-list">
          {extras.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <Row className="g-4 mt-1">
          <Col md={6}>
            <PriceTable title={extras.tables.headers.canvas} rows={extras.tables.prices.canvas} />
          </Col>
          <Col md={6}>
            <PriceTable title={extras.tables.headers.kapa} rows={extras.tables.prices.kapa} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExtrasScreen;
