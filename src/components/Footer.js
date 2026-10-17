import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsInstagram, BsFacebook, BsTelephone, BsEnvelope } from "react-icons/bs";
import { FaWaze } from "react-icons/fa";
import { useContent } from "../content/ContentProvider";
import { imageUrl } from "../content/images";
import { useCategories } from "../data/categories";
import { useWhatsappLink } from "../data/whatsapp";
import "./Footer.css";

const Footer = () => {
  const { social, copyright, about, floatingWhatsapp } = useContent("footer");
  const { info } = useContent("contact");
  const { logo } = useContent("common");
  const categories = useCategories();
  const whatsappLink = useWhatsappLink();

  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <img
              className="footer-logo"
              src={imageUrl(logo.path)}
              alt={logo.alt}
              width={160}
              loading="lazy"
            />
            <p className="footer-about">{about}</p>
            <div className="footer-social">
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="אינסטגרם">
                <BsInstagram />
              </a>
              <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="פייסבוק">
                <BsFacebook />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ">
                <BsWhatsapp />
              </a>
              <a href={social.waze.url} target="_blank" rel="noopener noreferrer" aria-label="ניווט עם Waze">
                <FaWaze />
              </a>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <h3 className="footer-title">סוגי צילומים</h3>
            <ul className="footer-links footer-links-grid">
              {categories.map((category) => (
                <li key={category.key}>
                  <Link to={category.pricesPath}>{category.title}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={4} md={12}>
            <h3 className="footer-title">יצירת קשר</h3>
            <ul className="footer-links footer-contact">
              <li>
                <BsTelephone />
                <a href={`tel:${social.phone.number}`} dir="ltr">{social.phone.display}</a>
              </li>
              <li>
                <BsEnvelope />
                <a href={`mailto:${social.email.address}`}>{social.email.address}</a>
              </li>
              <li>
                <FaWaze />
                <a href={social.waze.url} target="_blank" rel="noopener noreferrer">
                  {info.address.street.replace("כתובת - ", "")}, {info.address.city}
                </a>
              </li>
            </ul>
            <p className="footer-hours">
              {info.businessHours.weekdays}
              <br />
              {info.businessHours.friday}
            </p>
          </Col>
        </Row>

        <div className="footer-bottom">
          {copyright} {new Date().getFullYear()}
        </div>
      </Container>

      {floatingWhatsapp.visible && (
        <a
          className="floating-whatsapp"
          href={whatsappLink(floatingWhatsapp.message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שליחת הודעה בוואטסאפ"
        >
          <BsWhatsapp />
          <span className="floating-whatsapp-label">{floatingWhatsapp.label}</span>
        </a>
      )}
    </footer>
  );
};

export default Footer;
