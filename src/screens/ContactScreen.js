import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { BsWhatsapp, BsTelephone, BsEnvelope, BsClock, BsGeoAlt, BsCheckCircle } from "react-icons/bs";
import { FaWaze } from "react-icons/fa";
import Message from "../components/Message";
import { useContent } from "../content/ContentProvider";
import { useCategories } from "../data/categories";
import { useWhatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import "./ContactScreen.css";

const ContactScreen = () => {
  const { page, form, info, whatsapp } = useContent("contact");
  const { social } = useContent("footer");
  const categories = useCategories();
  const whatsappLink = useWhatsappLink();
  usePageTitle(page.title);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState();
  const [validated, setValidated] = useState(false);
  const address = `${info.address.street.replace("כתובת - ", "")}, ${info.address.city}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!formElement.checkValidity()) {
      setValidated(true);
      return;
    }
    setStatus("sending");
    setError(undefined);
    emailjs
      .sendForm(form.emailjs.serviceId, form.emailjs.templateId, formElement, form.emailjs.userId)
      .then(() => {
        setStatus("sent");
        setValidated(false);
        formElement.reset();
      })
      .catch((err) => {
        setStatus("idle");
        setError(err?.text || err?.message || "השליחה נכשלה, אפשר לנסות שוב או לשלוח הודעה בוואטסאפ");
      });
  };

  return (
    <Container className="contact-page">
      <header className="page-hero">
        <h1>{page.title}</h1>
        <p>{page.text}</p>
      </header>

      <Row className="g-4">
        <Col lg={7}>
          <div className="contact-card">
            <h2>{form.title}</h2>
            {status === "sent" ? (
              <div className="contact-success" role="status">
                <BsCheckCircle />
                <h3>{form.messages.success}</h3>
                <p>{form.messages.successText}</p>
                <button className="btn-outline-brand" onClick={() => setStatus("idle")}>
                  שליחת הודעה נוספת
                </button>
              </div>
            ) : (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group controlId="contact-name">
                      <Form.Label>{form.fields.name} *</Form.Label>
                      <Form.Control name="name" required autoComplete="name" />
                      <Form.Control.Feedback type="invalid">נא למלא שם</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="contact-phone">
                      <Form.Label>{form.fields.phone} *</Form.Label>
                      <Form.Control
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        required
                        pattern="[0-9+\-\s]{9,15}"
                        autoComplete="tel"
                        dir="ltr"
                        className="text-end"
                      />
                      <Form.Control.Feedback type="invalid">נא למלא מספר טלפון תקין</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="contact-email">
                      <Form.Label>{form.fields.email}</Form.Label>
                      <Form.Control name="email" type="email" autoComplete="email" dir="ltr" className="text-end" />
                      <Form.Control.Feedback type="invalid">כתובת המייל אינה תקינה</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="contact-type">
                      <Form.Label>{form.fields.type}</Form.Label>
                      <Form.Select name="type" defaultValue="">
                        <option value="">בחרו (לא חובה)</option>
                        {categories.map((category) => (
                          <option key={category.key} value={category.title}>
                            {category.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contact-message">
                      <Form.Label>{form.fields.message}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="message"
                        placeholder={form.messagePlaceholder}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {error && (
                  <div className="mt-3">
                    <Message variant="danger">{error}</Message>
                  </div>
                )}

                <button type="submit" className="btn-brand contact-submit" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <Spinner animation="border" size="sm" /> שולח...
                    </>
                  ) : (
                    form.buttons.submit
                  )}
                </button>
              </Form>
            )}
          </div>
        </Col>

        <Col lg={5}>
          <aside className="contact-info">
            <h2>{info.studio.name}</h2>
            <a
              className="btn-whatsapp contact-whatsapp"
              href={whatsappLink(whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsWhatsapp /> {whatsapp.button}
            </a>
            <ul className="contact-list">
              <li>
                <BsTelephone />
                <div>
                  <strong>טלפון</strong>
                  <a href={`tel:${social.phone.number}`}>{info.studio.photographer}</a>
                </div>
              </li>
              <li>
                <BsEnvelope />
                <div>
                  <strong>מייל</strong>
                  <a href={`mailto:${social.email.address}`}>{social.email.address}</a>
                </div>
              </li>
              <li>
                <BsGeoAlt />
                <div>
                  <strong>כתובת הסטודיו</strong>
                  <span>{address}</span>
                  <a href={social.waze.url} target="_blank" rel="noopener noreferrer" className="contact-waze">
                    <FaWaze /> ניווט עם Waze
                  </a>
                </div>
              </li>
              <li>
                <BsClock />
                <div>
                  <strong>{info.businessHours.title}</strong>
                  <span>{info.businessHours.weekdays}</span>
                  <span>{info.businessHours.friday}</span>
                  <span className="text-muted">{info.businessHours.saturday}</span>
                </div>
              </li>
            </ul>
          </aside>
        </Col>
      </Row>

      <div className="contact-map">
        <iframe
          title="מפת הגעה לסטודיו"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=he&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
};

export default ContactScreen;
