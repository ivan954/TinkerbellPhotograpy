import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsCheck2, BsInfoCircle } from "react-icons/bs";
import ExtrasScreen from "./ExtrasScreen";
import Reveal from "./Reveal";
import Photo from "./Photo";
import ComingSoon from "./ComingSoon";
import TrustRow from "./TrustRow";
import { galleryPath } from "../data/categories";
import { useWhatsappLink } from "../data/whatsapp";
import { useContent } from "../content/ContentProvider";
import { thumbUrl } from "../content/images";
import usePageTitle from "../hooks/usePageTitle";
import seo from "../data/seo.json";
import "./PricesScreen.css";

// Shown from the cheapest to the fullest package; in RTL the first is on the right.
const TIERS = [
  { key: "basic" },
  { key: "extra" },
  { key: "premium", featured: true },
];

const filled = (text) => String(text ?? "").trim() !== "";

const PricePackage = ({ category }) => {
  const packageData = useContent(`prices/${category.prices}`);
  const { pricesPage } = useContent("common");
  const whatsappLink = useWhatsappLink();
  usePageTitle(packageData.mainTitle, seo.prices.replace("{title}", packageData.mainTitle));

  // A package with neither a price nor anything listed in it is not shown.
  const tiers = TIERS.filter(
    (tier) =>
      filled(packageData.prices[tier.key]) ||
      (packageData.features[tier.key] || []).some(filled)
  );

  return (
    <div className="prices-page">
      <Container>
        <header className="page-hero">
          <nav className="breadcrumbs" aria-label="ניווט">
            <Link to="/">בית</Link> / מחירונים / {category.title}
          </nav>
          <h1>{packageData.mainTitle}</h1>
          <p>
            {pricesPage.intro}{" "}
            <Link to={galleryPath(category)}>{pricesPage.galleryLink}</Link>.
          </p>
        </header>

        <Row className="g-4 justify-content-center price-cards">
          {!tiers.length && (
            <Col lg={6}>
              <div className="price-empty">
                <ComingSoon compact />
                <p>{pricesPage.noPackages}</p>
                <a
                  className="btn-whatsapp"
                  href={whatsappLink(`היי, אשמח לפרטים על ${packageData.mainTitle.replace("מחירון ", "")}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsWhatsapp /> {pricesPage.orderButton}
                </a>
              </div>
            </Col>
          )}
          {tiers.map((tier, index) => {
            const title = packageData.packageTitles[tier.key];
            const image = packageData.images?.[tier.key];
            const features = (packageData.features[tier.key] || []).filter(filled);
            return (
              <Col lg={4} md={6} key={tier.key}>
                <Reveal
                  as="article"
                  delay={index * 100}
                  className={`price-card ${tier.featured ? "is-featured" : ""}`}
                >
                  {tier.featured && <span className="price-badge">{pricesPage.featuredBadge}</span>}
                  <div className="price-card-image">
                    {image ? (
                      <Photo
                        src={thumbUrl(image)}
                        alt={`${title} - ${category.title}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <ComingSoon compact />
                    )}
                  </div>
                  <div className="price-card-header">
                    <h2>{title}</h2>
                    {filled(packageData.prices[tier.key]) && (
                      <div className="price-amount">
                        <span className="price-currency">₪</span>
                        {packageData.prices[tier.key]}
                      </div>
                    )}
                  </div>
                  <ul className="price-features">
                    {features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
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
                      <BsWhatsapp /> {pricesPage.orderButton}
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

      <div className="prices-trust">
        <TrustRow />
      </div>

      <ExtrasScreen />
    </div>
  );
};

export default PricePackage;
