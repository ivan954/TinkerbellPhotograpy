import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import usePageTitle from "../hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("העמוד לא נמצא");

  return (
    <Container className="page-hero py-5">
      <h1>העמוד לא נמצא</h1>
      <p className="mb-4">יכול להיות שהקישור השתנה. אפשר לחזור לדף הבית או לגלריה.</p>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Link to="/" className="btn-brand">לדף הבית</Link>
        <Link to="/gallery" className="btn-outline-brand">לגלריה</Link>
      </div>
    </Container>
  );
};

export default NotFound;
