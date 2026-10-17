import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsWhatsapp, BsCamera, BsHeart, BsStars, BsHouseHeart } from "react-icons/bs";
import ImagesCarousel from "../components/ImagesCarousel";
import Recommendations from "../components/Recommendations";
import Reveal from "../components/Reveal";
import categories, { coverUrl, galleryPath } from "../data/categories";
import { whatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import homeData from "../data/components/screens/home.json";
import "./HomeScreen.css";

const highlights = [
  { Icon: BsHouseHeart, title: "סטודיו ולוקיישן", text: "צילום בסטודיו המאובזר או בלוקיישן חיצוני לבחירתכם" },
  { Icon: BsHeart, title: "אווירה רגועה וכיפית", text: "צילום טבעי שמתאים את עצמו לקצב של הילדים" },
  { Icon: BsStars, title: "עריכה מקצועית", text: "תמונות ערוכות בפוטושופ, מוכנות להדפסה ולשיתוף" },
];

const steps = [
  { title: "יוצרים קשר", text: "שולחים הודעה בוואטסאפ או ממלאים טופס, ואני חוזרת אליכם בהקדם." },
  { title: "מתכננים יחד", text: "בוחרים חבילה, מועד, רקעים ואביזרים שמתאימים בדיוק לכם." },
  { title: "יום הצילומים", text: "מגיעים לסטודיו, נהנים ומשאירים לי לתפוס את הרגעים." },
  { title: "מקבלים את התמונות", text: "בוחרים את התמונות האהובות ומקבלים אותן ערוכות ומוכנות." },
];

const HomeScreen = () => {
  usePageTitle();
  const aboutImagePath = `${process.env.PUBLIC_URL}/images/thumbs/About/About.jpeg`;
  const { welcome } = homeData;

  return (
    <div className="home">
      <section className="hero">
        <ImagesCarousel />
        <div className="hero-overlay">
          <Container>
            <div className="hero-content">
              <span className="hero-eyebrow">צילומי ניובורן · הריון · ילדים · משפחות</span>
              <h1>{welcome.title}</h1>
              <p>רגעים קטנים שהופכים לזיכרונות גדולים. צילום טבעי, חם ומלא באהבה במודיעין.</p>
              <div className="hero-actions">
                <a
                  className="btn-whatsapp"
                  href={whatsappLink("היי, אשמח לתאם צילומים")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsWhatsapp /> לתיאום צילום
                </a>
                <Link to="/gallery" className="btn-outline-light-brand">
                  לגלריה
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section className="highlights">
        <Container>
          <Row className="g-3">
            {highlights.map(({ Icon, title, text }, index) => (
              <Col md={4} key={title}>
                <Reveal className="highlight" delay={index * 100}>
                  <span className="highlight-icon"><Icon /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <Reveal className="section-heading">
            <span className="section-eyebrow">סוגי צילומים</span>
            <h2>מה תרצו לצלם?</h2>
            <p>בחרו סוג צילום כדי לראות תמונות מהסטודיו ואת המחירון המלא</p>
          </Reveal>
          <div className="services-grid">
            {categories.map((category, index) => (
              <Reveal key={category.key} className="service-card" delay={(index % 4) * 80}>
                <Link to={galleryPath(category)} className="service-card-link">
                  <img src={coverUrl(category)} alt={category.title} loading="lazy" decoding="async" />
                  <span className="service-card-title">{category.title}</span>
                </Link>
                <Link to={category.pricesPath} className="service-card-price">
                  למחירון ←
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-soft">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6}>
              <Reveal className="about-image-wrap">
                <img src={aboutImagePath} alt="הצלמת בסטודיו" loading="lazy" decoding="async" />
              </Reveal>
            </Col>
            <Col lg={6}>
              <Reveal className="about-text" delay={120}>
                <span className="section-eyebrow">נעים להכיר</span>
                <h2>{welcome.about.title}</h2>
                <p>{welcome.about.text}</p>
                <div className="about-actions">
                  <Link to="/contact" className="btn-brand">
                    <BsCamera /> בואו נדבר
                  </Link>
                  <Link to="/gallery" className="btn-outline-brand">
                    לצפייה בעבודות
                  </Link>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <Reveal className="section-heading">
            <span className="section-eyebrow">פשוט וקל</span>
            <h2>איך זה עובד?</h2>
          </Reveal>
          <Row className="g-4 steps">
            {steps.map((step, index) => (
              <Col md={6} lg={3} key={step.title}>
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

      <section className="section section-soft">
        <Container>
          <Reveal className="section-heading">
            <span className="section-eyebrow">לקוחות מספרים</span>
            <h2>מה אומרים עליי</h2>
          </Reveal>
          <Recommendations />
        </Container>
      </section>

      <section className="cta-band">
        <Container>
          <Reveal className="cta-band-inner">
            <h2>מוכנים להנציח את הרגעים שלכם?</h2>
            <p>שלחו הודעה ונתאם יחד את הצילום המושלם עבורכם</p>
            <div className="hero-actions">
              <a
                className="btn-whatsapp"
                href={whatsappLink("היי, אשמח לתאם צילומים")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsWhatsapp /> שלחו הודעה בוואטסאפ
              </a>
              <Link to="/contact" className="btn-outline-light-brand">
                להשארת פרטים
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
};

export default HomeScreen;
