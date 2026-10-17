import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsCheck2, BsInfoCircle } from "react-icons/bs";
import ExtrasScreen from "./ExtrasScreen";
import Reveal from "./Reveal";
import { findCategory, galleryPath, thumbUrl } from "../data/categories";
import { whatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import "./PricesScreen.css";

// Shown from the cheapest to the fullest package; in RTL the first is on the right.
const TIERS = [
  { key: "basic", image: "Prices/3.jpg" },
  { key: "extra", image: "Prices/2.jpg" },
  { key: "premium", image: "Prices/1.jpg", featured: true },
];

const PricePackage = ({ packageType }) => {
  const packageData = require(`../data/components/prices/${packageType}.json`);
  const category = findCategory((item) => item.prices === packageType);
  usePageTitle(packageData.mainTitle);

  return (
    <div className="prices-page">
      <Container>
        <header className="page-hero">
          <nav className="breadcrumbs" aria-label="ניווט">
            <Link to="/">בית</Link> / מחירונים / {category.title}
          </nav>
          <h1>{packageData.mainTitle}</h1>
          <p>
            בחרו את החבילה שמתאימה לכם. יש שאלה? אשמח לעזור לבחור{" "}
            <Link to={galleryPath(category)}>ולהראות עוד תמונות מהגלריה</Link>.
          </p>
        </header>

        <Row className="g-4 justify-content-center price-cards">
          {TIERS.map((tier, index) => {
            const title = packageData.packageTitles[tier.key];
            return (
              <Col lg={4} md={6} key={tier.key}>
                <Reveal
                  as="article"
                  delay={index * 100}
                  className={`price-card ${tier.featured ? "is-featured" : ""}`}
                >
                  {tier.featured && <span className="price-badge">החבילה המלאה</span>}
                  <div className="price-card-image">
                    <img
                      src={thumbUrl(category, tier.image)}
                      alt={`${title} - ${category.title}`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = thumbUrl(category, `${3 - index}.jpg`);
                      }}
                    />
                  </div>
                  <div className="price-card-header">
                    <h2>{title}</h2>
                    <div className="price-amount">
                      <span className="price-currency">₪</span>
                      {packageData.prices[tier.key]}
                    </div>
                  </div>
                  <ul className="price-features">
                    {packageData.features[tier.key].map((feature) => (
                      <li key={feature}>
                        <BsCheck2 aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="price-card-footer">
                    <a
                      className={tier.featured ? "btn-brand" : "btn-outline-brand"}
                      href={whatsappLink(`היי, אשמח לתאם ${title} - ${packageData.mainTitle.replace("מחירון ", "")}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BsWhatsapp /> להזמנת החבילה
                    </a>
                  </div>
                </Reveal>
              </Col>
            );
          })}
        </Row>

        {packageData.additionalInfo && (
          <p className="price-note">
            <BsInfoCircle aria-hidden="true" /> {packageData.additionalInfo}
          </p>
        )}
      </Container>

      <ExtrasScreen />
    </div>
  );
};

export default PricePackage;
