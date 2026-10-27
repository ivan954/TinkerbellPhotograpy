import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp } from "react-icons/bs";
import Reveal from "../components/Reveal";
import Photo from "../components/Photo";
import TrustRow from "../components/TrustRow";
import { useContent } from "../content/ContentProvider";
import { imageUrl, thumbUrl } from "../content/images";
import { useWhatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import "./AboutScreen.css";

const AboutScreen = () => {
  const about = useContent("about");
  const { floatingWhatsapp } = useContent("footer");
  const whatsappLink = useWhatsappLink();
  usePageTitle(about.pageTitle, about.description);

  // Blank lines in the story start a new paragraph.
  const paragraphs = about.story
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="about-page">
      <Container>
        <header className="page-hero">
          <nav className="breadcrumbs" aria-label="ניווט">
            <Link to="/">בית</Link> / {about.pageTitle}
          </nav>
          <span className="section-eyebrow">{about.eyebrow}</span>
          <h1>{about.title}</h1>
        </header>

        <Row className="g-4 g-lg-5 align-items-start">
          <Col lg={5}>
            <Reveal className="about-page-photo">
              <Photo
                src={imageUrl(about.image)}
                thumb={thumbUrl(about.image)}
                sizes="(max-width: 991px) 100vw, 480px"
                alt={about.imageAlt}
                decoding="async"
              />
            </Reveal>
          </Col>
          <Col lg={7}>
            <Reveal className="about-page-story" delay={120}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <div className="about-actions">
                <a
                  className="btn-whatsapp"
                  href={whatsappLink(floatingWhatsapp.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsWhatsapp /> {about.contactButton}
                </a>
                <Link to="/gallery" className="btn-outline-brand">
                  {about.galleryButton}
                </Link>
              </div>
            </Reveal>
          </Col>
        </Row>
      </Container>

      <div className="about-page-trust">
        <TrustRow />
      </div>
    </div>
  );
};

export default AboutScreen;
