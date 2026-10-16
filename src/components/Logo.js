import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import commonData from "../data/components/screens/common.json";

const Logo = ({ width }) => {
  const { logo } = commonData;
  const logoWidth = width || logo?.defaultWidth;

  return (
    <Container className={logo?.className}>
      <Row>
        <Col className="text-center">
          <img
            src={logo?.path}
            alt={logo?.alt}
            width={logoWidth}
            style={{ maxWidth: "100%", height: "auto" }}
            onError={(e) => {
              e.target.onerror = null;
              console.error("Failed to load logo image");
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
};

export default Logo;
