import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsInstagram, BsFacebook, BsTelephone, BsEnvelope } from "react-icons/bs";
import { FaWaze } from "react-icons/fa";
import footerData from "../data/components/screens/footer.json";
import contactData from "../data/components/screens/contact.json";
import commonData from "../data/components/screens/common.json";
import categories from "../data/categories";
import { whatsappLink } from "../data/whatsapp";
import "./Footer.css";

const Footer = () => {
  const { social, copyright } = footerData;
  const { info } = contactData;
  const { logo } = commonData;

  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <img
              className="footer-logo"
              src={`${process.env.PUBLIC_URL}${logo.path}`}
              alt={logo.alt}
              width={160}
              loading="lazy"
            />
            <p className="footer-about">
              צילומי ניובורן, הריון, ילדים ומשפחות בסטודיו ובלוקיישן, באווירה רגועה וכיפית.
            </p>
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
                <a href={`tel:${social.phone.number}`} dir="ltr">050-423-0342</a>
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

      <a
        className="floating-whatsapp"
        href={whatsappLink("היי, אשמח לפרטים על צילומים")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שליחת הודעה בוואטסאפ"
      >
        <BsWhatsapp />
        <span className="floating-whatsapp-label">דברו איתי בוואטסאפ</span>
      </a>
    </footer>
  );
};

export default Footer;
