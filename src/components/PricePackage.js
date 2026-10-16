import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ExtrasScreen from "./ExtrasScreen";
import "./PricesScreen.css";

const PricePackage = ({ packageType }) => {
  const [imageErrors, setImageErrors] = useState({
    premium: false,
    extra: false,
    basic: false,
  });

  // Directory name mapping
  const getDirectoryName = (type) => {
    const directoryMap = {
      children: "Children",
      family: "Family",
      firstclass: "FirstClass",
      newborn: "NewBorn",
      oneyear: "OneYearOld",
      pregnancy: "Pregnancy",
      purim: "Purim",
      tadmit: "Tadmit",
      shavuot: "Shavuot",
      halake: "Halake",
    };
    return directoryMap[type.toLowerCase()] || type;
  };

  // Import the package data dynamically
  const packageData = require(`../data/components/prices/${packageType}.json`);
  const commonData = require("../data/components/screens/common.json");

  const handleImageError = (type) => {
    console.log(
      `Failed to load ${type} image for ${packageType} from directory ${getDirectoryName(
        packageType
      )}`
    );
    setImageErrors((prev) => ({ ...prev, [type]: true }));
  };

  if (!packageData) {
    return (
      <Container style={{ marginTop: "10%" }} fluid>
        <div className="prices-container">
          <div className="prices-title-container">
            <h1 className="prices-title">
              {commonData?.loading || "טוען נתונים..."}
            </h1>
          </div>
        </div>
      </Container>
    );
  }

  const directoryName = getDirectoryName(packageType);

  return (
    <Container style={{ marginTop: "10%" }} fluid>
      <div className="prices-container">
        <div className="prices-title-container">
          <h1 className="prices-title">{packageData.mainTitle}</h1>
        </div>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 premium-card">
              {!imageErrors.premium && (
                <div className="card-image-container">
                  <img
                    className="card-img-top"
                    src={`${process.env.PUBLIC_URL}/images/Gallery/${directoryName}/1.jpg`}
                    alt={`${packageData.packageTitles.premium} Package`}
                    onError={() => handleImageError("premium")}
                  />
                </div>
              )}
              <Card.Header className="text-center">
                <h2>{packageData.packageTitles.premium}</h2>
                <h3>{packageData.prices.premium} ₪</h3>
              </Card.Header>
              <Card.Body>
                <ul>
                  {packageData.features.premium.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 extra-card">
              {!imageErrors.extra && (
                <div className="card-image-container">
                  <img
                    className="card-img-top"
                    src={`${process.env.PUBLIC_URL}/images/Gallery/${directoryName}/2.jpg`}
                    alt={`${packageData.packageTitles.extra} Package`}
                    onError={() => handleImageError("extra")}
                  />
                </div>
              )}
              <Card.Header className="text-center">
                <h2>{packageData.packageTitles.extra}</h2>
                <h3>{packageData.prices.extra} ₪</h3>
              </Card.Header>
              <Card.Body>
                <ul>
                  {packageData.features.extra.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 basic-card">
              {!imageErrors.basic && (
                <div className="card-image-container">
                  <img
                    className="card-img-top"
                    src={`${process.env.PUBLIC_URL}/images/Gallery/${directoryName}/3.jpg`}
                    alt={`${packageData.packageTitles.basic} Package`}
                    onError={() => handleImageError("basic")}
                  />
                </div>
              )}
              <Card.Header className="text-center">
                <h2>{packageData.packageTitles.basic}</h2>
                <h3>{packageData.prices.basic} ₪</h3>
              </Card.Header>
              <Card.Body>
                <ul>
                  {packageData.features.basic.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {packageData.additionalInfo && (
          <div className="additional-info mt-4">
            <p>{packageData.additionalInfo}</p>
          </div>
        )}
      </div>
      <ExtrasScreen />
    </Container>
  );
};

export default PricePackage;
