import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsCamera, BsHeart, BsStars, BsHouseHeart } from "react-icons/bs";
import Recommendations from "../components/Recommendations";
import Reveal from "../components/Reveal";
import Photo from "../components/Photo";
import ComingSoon from "../components/ComingSoon";
import TrustRow from "../components/TrustRow";
import Faq from "../components/Faq";
import { useCategories, coverUrl, galleryPath } from "../data/categories";
import { useWhatsappLink } from "../data/whatsapp";
import { useContent } from "../content/ContentProvider";
import { imageUrl, thumbUrl } from "../content/images";
import usePageTitle from "../hooks/usePageTitle";
import "./HomeScreen.css";

// Icons for the highlights, in order (they repeat if more highlights are added).
const HIGHLIGHT_ICONS = [BsHouseHeart, BsHeart, BsStars];

const HomeScreen = () => {
  usePageTitle();
  const categories = useCategories();
  const whatsappLink = useWhatsappLink();
  const { hero, highlights, services, about, steps, testimonials, faq, cta } = useContent("home");

  return (
    <div className="home">
      <section className="hero">
        <Photo
          className="hero-image"
          src={imageUrl(hero.image)}
          thumb={thumbUrl(hero.image)}
          sizes="100vw"
          alt={hero.imageAlt}
          fetchpriority="high"
          decoding="async"
        />
        <div className="hero-sparkles" aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="hero-overlay">
          <Container>
            <div className="hero-content">
              <span className="hero-eyebrow">{hero.eyebrow}</span>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
              <div className="hero-actions">
                <a
                  className="btn-whatsapp"
                  href={whatsappLink(hero.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsWhatsapp /> {hero.whatsappButton}
                </a>
                <Link to="/gallery" className="btn-outline-light-brand">
                  {hero.galleryButton}
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {highlights.visible && (
        <section className="highlights">
          <Container>
            <Row className="g-3">
              {highlights.items.map(({ title, text }, index) => {
                const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
                return (
                  <Col md={4} key={index}>
                    <Reveal className="highlight" delay={index * 100}>
                      <span className="highlight-icon"><Icon /></span>
                      <div>
                        <h3>{title}</h3>
                        <p>{text}</p>
                      </div>
                    </Reveal>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
      )}

      {services.visible && (
        <section className="section">
          <Container>
            <Reveal className="section-heading">
              <span className="section-eyebrow">{services.eyebrow}</span>
              <h2>{services.title}</h2>
              <p>{services.text}</p>
            </Reveal>
            <div className="services-grid">
              {categories.map((category, index) => (
                <Reveal key={category.key} className="service-card" delay={(index % 4) * 80}>
                  <Link to={galleryPath(category)} className="service-card-link">
                    {coverUrl(category) ? (
                      <Photo src={coverUrl(category)} alt={category.title} loading="lazy" decoding="async" />
                    ) : (
                      <ComingSoon compact />
                    )}
                    <span className="service-card-title">{category.title}</span>
                  </Link>
                  <Link to={category.pricesPath} className="service-card-price">
                    {services.priceLink}
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {about.visible && (
        <section className="section section-soft">
          <Container>
            <Row className="align-items-center g-4 g-lg-5">
              <Col lg={6}>
                <Reveal className="about-image-wrap">
                  <Photo src={thumbUrl(about.image)} alt={about.imageAlt} loading="lazy" decoding="async" />
                </Reveal>
              </Col>
              <Col lg={6}>
                <Reveal className="about-text" delay={120}>
                  <span className="section-eyebrow">{about.eyebrow}</span>
                  <h2>{about.title}</h2>
                  <p>{about.text}</p>
                  <div className="about-actions">
                    <Link to="/about" className="btn-brand">
                      {about.moreButton}
                    </Link>
                    <Link to="/contact" className="btn-outline-brand">
                      <BsCamera /> {about.contactButton}
                    </Link>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {steps.visible && (
        <section className="section">
          <Container>
            <Reveal className="section-heading">
              <span className="section-eyebrow">{steps.eyebrow}</span>
              <h2>{steps.title}</h2>
            </Reveal>
            <Row className="g-4 steps">
              {steps.items.map((step, index) => (
                <Col md={6} lg={3} key={index}>
                  <Reveal className="step" delay={index * 100}>
                    <span className="step-number">{index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </Reveal>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {testimonials.visible && (
        <section className="section section-soft">
          <Container>
            <Reveal className="section-heading">
              <span className="section-eyebrow">{testimonials.eyebrow}</span>
              <h2>{testimonials.title}</h2>
            </Reveal>
            <Recommendations quotes={testimonials.quotes} images={testimonials.images} />
          </Container>
        </section>
      )}

      <TrustRow />

      <Faq faq={faq} />

      {cta.visible && (
        <section className="cta-band">
          <Container>
            <Reveal className="cta-band-inner">
              <h2>{cta.title}</h2>
              <p>{cta.text}</p>
              <div className="hero-actions">
                <a
                  className="btn-whatsapp"
                  href={whatsappLink(cta.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsWhatsapp /> {cta.whatsappButton}
                </a>
                <Link to="/contact" className="btn-outline-light-brand">
                  {cta.formButton}
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      )}
    </div>
  );
};

export default HomeScreen;
