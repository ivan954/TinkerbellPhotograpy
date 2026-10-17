import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
      <Spinner animation="border" role="status" style={{ color: "var(--color-accent)" }}>
        <span className="visually-hidden">טוען...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
